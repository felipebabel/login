const API_BASE_URL = import.meta.env.VITE_API_URL; 

export const LOGIN = `${API_BASE_URL}/api/v1/login`;
export const CREATE_ACCOUNT = `${API_BASE_URL}/api/v1/login/create-account`;
export const RECOVER_PASSWORD = `${API_BASE_URL}/api/v1/login/send-email`;
export const RESET_PASSWORD = `${API_BASE_URL}/api/v1/login/reset-password`;
export const VALIDATE_CODE = `${API_BASE_URL}/login/validate-code`;
