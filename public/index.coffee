---
---

# Enforce reload after authorization to clear cache
if sessionStorage.state
  delete sessionStorage.state
  location.reload true

github =
  token: localStorage.token
  get: (resource) ->
    $.ajax "https://api.github.com/#{resource}",
      headers: Authorization: "token #{@token}" if @token
  post: (resource, data) ->
    $.ajax "https://api.github.com/#{resource}",
      data: data
      contentType: 'application/json'
      type: 'POST'
      headers: Authorization: "token #{@token}"
  patch: (resource, data) ->
    $.ajax "https://api.github.com/#{resource}",
      data: data
      contentType: 'application/json'
      type: 'PATCH'
      headers: Authorization: "token #{@token}"
  gistsOfCurrentUser: -> @get 'gists'
  gistsOfPublic:      -> @get 'gists/public'
  gist: (id)          -> @get "gists/#{id}"
  createGist: (r)     -> @post  'gists', JSON.stringify(r)
  updateGist: (id, r) -> @patch "gists/#{id}", JSON.stringify(r)
  user:               -> @get 'user'

vm = new Vue
  el: 'body'
  data:
    user: null
    gists:
      all: []
      isPublic: !github.token
    gist: null
    state: 'loading'
  methods:
    fetchUser: ->
      if github.token
        github.user().then (user) => @user = user
    fetchGists: ->
      if @gists.isPublic
        github.gistsOfPublic().then (gists) => @gists.all = gists
      else
        github.gistsOfCurrentUser().then (gists) => @gists.all = gists
    fetchGist: (id) ->
      if @gist?.id == id
        $.Deferred().resolve()
      else
        @state = 'loading'
        github.gist(id).then (gist) =>
          gist.files = Object.keys(gist.files).map (name) ->
            file = gist.files[name]
            file.state = 'loaded'
            file
          @gist = gist
    addGistFile: ->
      @gist.files.push
        filename: "gistfile#{@gist.files.length + 1}.md"
        content: ''
        state: 'new'
    removeGistFile: (filename) ->
      @gist.files = @gist.files.filter (file) -> file.filename != filename
    createGist: (isPublic) ->
      req =
        public: isPublic
        description: @gist.description
        files: {}
      @gist.files.forEach (file) ->
        req.files[file.filename] = if file.state == 'removed' then null else content: file.content
      github.createGist(req).then (created) -> page "/#{created.id}"
    updateGist: ->
      req =
        description: @gist.description
        files: {}
      @gist.files.forEach (file) ->
        req.files[file.filename] = if file.state == 'removed' then null else content: file.content
      github.updateGist(@gist.id, req).then (created) -> page "/#{created.id}"
    openGist: (id) ->
      @fetchGist(id).then => @state = 'view'
    editGist: (id) ->
      @fetchGist(id).then => @state = 'edit'
    newGist: ->
      @state = 'new'
      @gist = description: '', files: []
      @addGistFile()
    openTop: ->
      @state = 'top'
      @gist = null
  components:
    'login-status':       template: '#template-login-status'
    'gist-top':           template: '#template-gist-top'
    'gist-loading':       template: '#template-gist-loading'
    'gist-view':          template: '#template-gist-view'
    'gist-edit':          template: '#template-gist-edit'
    'gist-new':           template: '#template-gist-new'
    'gist-edit-file':     template: '#template-gist-edit-file'
    'gist-new-file':      template: '#template-gist-new-file'
    'gist-view-metadata': template: '#template-gist-view-metadata'
  filters:
    marked: (content) -> marked(content) if content
    highlight: (content) -> hljs.highlightAuto(content).value if content
    timeago: (time) -> $.timeago(time)
    gistTitle: (gist) -> gist.description or "gist:#{gist.id}" if gist
  created: ->
    @fetchUser()
    @fetchGists()
    @$watch 'gists.isPublic', -> @fetchGists()
  compiled: ->
    marked.setOptions highlight: (code, lang) -> hljs.highlightAuto(code, [lang]).value

page '/login', ->
  clientId = '741e291348ea3f2305bd'
  endpoint = 'https://github.com/login/oauth/authorize'
  uri = "#{location.origin}/auth.html"
  scope = 'gist'
  sessionStorage.state = state = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  location.href = "#{endpoint}?client_id=#{clientId}&redirect_uri=#{uri}&scope=#{scope}&state=#{state}"

page '/logout', ->
  delete localStorage.token
  location.replace '/'

page '/new', ->
  vm.newGist()

page '/:id', (context) ->
  vm.openGist context.params.id

page '/:id/edit', (context) ->
  vm.editGist context.params.id

page ->
  vm.openTop()

page hashbang: true
