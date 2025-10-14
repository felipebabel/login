const ACCESS_TOKEN_KEY = "tokenAcesso";
const REFRESH_TOKEN_KEY = "tokenRenovacao";
const EXPIRES_IN_KEY = "expiraEm"; 

import {
  REFRESH,
} from "@api/endpoints";

class AuthService {

    setTokens(data) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(EXPIRES_IN_KEY, data.expiresIn);
    }

    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(EXPIRES_IN_KEY);
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
        } else if (response.status === 403) {
            const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "black";
        overlay.style.zIndex = 9999;
        document.body.appendChild(overlay);
            alert("Inactive session. Please log in again.");
            this.logout();
            return response;
        }
        
        return response;
    }

}

const authService = new AuthService();
export { authService };
