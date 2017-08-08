import PromiseAction from '../../infrastructure/PromiseAction';
import PromiseReducer from '../../infrastructure/PromiseReducer';
import PromiseState from '../../infrastructure/PromiseState';

import * as actionTypes from './actionTypes';

import GistCriteria from '../../models/GistCriteria';
import EditingGist from '../../models/EditingGist';

export function gistCriteria(state = GistCriteria.MY, action) {
  switch (action.type) {
    case actionTypes.CHANGE_GIST_CRITERIA:
      return action.payload;
    default:
      return state;
  }
}

export const gistList = PromiseReducer({
  type: actionTypes.LIST_GISTS,
  handle: (state, action) => {
    switch (action.type) {
      case PromiseAction.resolvedTypeOf(actionTypes.LIST_NEXT_GISTS):
        return PromiseState.resolved([...state.payload, ...action.payload]);
      default:
        return state;
    }
  },
})

export const gistListPagenation = PromiseReducer({
  types: [actionTypes.LIST_GISTS, actionTypes.LIST_NEXT_GISTS],
})

export const gist = PromiseReducer({type: actionTypes.READ_GIST})

export const createdGist = PromiseReducer({type: actionTypes.CREATE_GIST})

export const updatedGist = PromiseReducer({type: actionTypes.UPDATE_GIST})

export const editingGist = PromiseReducer({
  type: actionTypes.READ_GIST,
  mapResolved: payload => EditingGist.createFromExistentGist(payload),
  handle: (state, action) => {
    switch (action.type) {
      case actionTypes.NEW_EDITING_GIST:
        return PromiseState.resolved(EditingGist.createNew());
      case actionTypes.CHANGE_EDITING_GIST:
        return PromiseState.resolved(action.payload);
      default:
        return state;
    }
  },
})
