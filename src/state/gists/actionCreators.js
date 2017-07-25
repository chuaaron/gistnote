import * as actionTypes from './actionTypes'

import GistOwner from '../../models/GistOwner';

export const selectPublicGists = () => ({type: actionTypes.SELECT_GISTS_OWNER, owner: GistOwner.PUBLIC})
export const selectMyGists = () => ({type: actionTypes.SELECT_GISTS_OWNER, owner: GistOwner.MY})

export const fetchPublicGists = () => ({type: actionTypes.FETCH_GISTS, owner: GistOwner.PUBLIC})
export const fetchMyGists = () => ({type: actionTypes.FETCH_GISTS, owner: GistOwner.MY})

export const fetchGistContent = id => ({type: actionTypes.FETCH_GIST_CONTENT, id})
export const destroyGistContent = () => ({type: actionTypes.DESTROY_GIST_CONTENT})

export const fetchGistContentForUpdate = id => ({type: actionTypes.FETCH_GIST_CONTENT_FOR_UPDATE, id})
