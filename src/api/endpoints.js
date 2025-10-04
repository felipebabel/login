const API_BASE_URL = import.meta.env.VITE_API_URL; 

export const LOGIN = `${API_BASE_URL}/api/v1/login`;
export const CREATE_ACCOUNT = `${API_BASE_URL}/api/v1/login/create-account`;
export const RECOVER_PASSWORD = `${API_BASE_URL}/api/v1/login/send-email`;
export const RESET_PASSWORD = `${API_BASE_URL}/api/v1/login/reset-password`;
export const VALIDATE_CODE = `${API_BASE_URL}/api/v1/login/validate-code`;
export const GET_USER = `${API_BASE_URL}/api/v1/admin/get-user-by-identifier`;
export const DELETE_USER = `${API_BASE_URL}/api/v1/admin/delete-user`;
export const LOGOUT = `${API_BASE_URL}/api/v1/login/logout`;
export const GET_CONFIG = `${API_BASE_URL}/api/v1/config/get-config`;
export const SET_CONFIG = `${API_BASE_URL}/api/v1/config/set-config`;
export const GET_LOGS = `${API_BASE_URL}/api/v1/admin/get-logs`;
export const UPDATE_ACCOUNT = `${API_BASE_URL}/api/v1/login/update-account`;
export const GET_ACCOUNT_MONTH = `${API_BASE_URL}/api/v1/admin/get-new-account-month`;

