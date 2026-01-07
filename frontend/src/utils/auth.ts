type Tokens = {
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
};

function saveAuthTokens(tokens: Tokens) {
  if (tokens.access_token) {
    localStorage.setItem("access_token", tokens.access_token);
  }
  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }
  if (tokens.user_id) {
    localStorage.setItem("user_id", tokens.user_id);
  }
}

function clearAuthTokens() {
  // Clear all possible auth-related items from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("guest_mode");
  
  // Also clear any cached admin status or user data
  // This ensures no state leaks between users
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("user_") || key.startsWith("auth_") || key.includes("admin"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

function setGuestMode() {
  localStorage.setItem("guest_mode", "true");
}

function isGuestMode(): boolean {
  return localStorage.getItem("guest_mode") === "true";
}

function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token") || isGuestMode();
}

export { saveAuthTokens, clearAuthTokens, isAuthenticated, setGuestMode, isGuestMode };
