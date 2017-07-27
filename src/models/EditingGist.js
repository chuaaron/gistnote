import { Record, Seq } from 'immutable';

import EditingGistFile from './EditingGistFile';

/**
 * @see https://developer.github.com/v3/gists/#edit-a-gist
 */
export default class EditingGist extends Record({
  gist: null,
  description: null,
  files: Seq(),
}) {
  static createFromGistContent(gist) {
    return new EditingGist({
      gist,
      description: gist.description,
      files: Seq(gist.files).valueSeq().map((file, index) =>
        EditingGistFile.createFromGistContentFile(index, file)),
    });
  }

  setDescription(value) {
    return this.set('description', value);
  }

  setFile(file) {
    return this.set('files', this.files.map(currentFile => {
      if (currentFile.id === file.id) {
        return file;
      } else {
        return currentFile;
      }
    }));
  }

  addNewFile() {
    return this.set('files',
      this.files.concat([EditingGistFile.createNew(this.files.size)]));
  }

  toGitHubRequest() {
    return {
      description: this.description,
      files: this.files
        .map(file => Seq(file.toGitHubRequest()))
        .reduce((r, file) => Seq(r).concat(file))
        .toJS(),
    };
  }
}
