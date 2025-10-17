const ACCESS_TOKEN_KEY = "accessTokenKey";
const REFRESH_TOKEN_KEY = "refreshTokenKey";
const EXPIRES_IN_KEY = "expiresInKey"; 
const USER_ROLE = "userRole";

import {
  REFRESH,
} from "@api/endpoints";

class AuthService {

setTokens(data) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(EXPIRES_IN_KEY, data.expiresIn);
  localStorage.setItem(USER_ROLE, data.userRole); 
}

    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(EXPIRES_IN_KEY);
        localStorage.removeItem(USER_ROLE);
        localStorage.removeItem("jwtToken");

        window.location.href = "/login/"; 
    }

    async refreshAccessToken() {
        const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!currentRefreshToken) {
            console.error("Refresh Token not found. Forcing logout.");
            this.logout();
            return false;
        }

        try {
            const response = await fetch(REFRESH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: currentRefreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data);
                return true;
            } else {
                console.error("Refresh Token renewal failed. Expired.");
                this.logout();
                return false;
            }
        } catch (error) {
            console.error("Network error during refresh:", error);
            this.logout();
            return false;
        }
    }

    async apiClient(url, options = {}) {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        let headers = options.headers || {};

        if (token) {
            headers = { ...headers, "Authorization": `Bearer ${token}` };
        }
        
        let response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            const isRefreshed = await this.refreshAccessToken();

            if (isRefreshed) {
                const newToken = localStorage.getItem(ACCESS_TOKEN_KEY);
                headers = { ...options.headers, "Authorization": `Bearer ${newToken}` };
                                response = await fetch(url, { ...options, headers });
            } else {
                return response; 
            }
        } 
        
        return response;
    }

}

const authService = new AuthService();
export { authService };
