import * as actionTypes from './actionTypes'

export const login = () => ({type: actionTypes.LOGIN})
export const handleOAuthRedirect = () => ({type: actionTypes.HANDLE_OAUTH_REDIRECT})
export const logout = () => ({type: actionTypes.LOGOUT})

export const changeAuthenticated = payload => ({type: actionTypes.CHANGE_AUTHENTICATED, payload})
