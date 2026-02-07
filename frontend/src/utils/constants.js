export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/profile`
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/delete-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;



export const CONTACT_ROUTES = "/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACT_ROUTES}/getDmContacts`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTES}/get-all-contacts`


export const MESSAGES_ROUTES = "/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/getMessages`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-file`



export const CHANNEL_ROUTES = "/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channel`
export const GET_USER_CHANNELS_MESSAGES_ROUTE = `${CHANNEL_ROUTES}/get-channel-messages`