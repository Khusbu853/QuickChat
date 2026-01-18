export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/profile`
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/delete-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;