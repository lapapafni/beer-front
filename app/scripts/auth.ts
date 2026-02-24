const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const authService = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);

    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem(ROLE_KEY, payload.role);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
