type Tokens = {
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
};

function getStorage(rememberMe: boolean = true): Storage {
  return rememberMe ? localStorage : sessionStorage;
}

function saveAuthTokens(tokens: Tokens, rememberMe: boolean = true) {
  const storage = getStorage(rememberMe);
  
  if (tokens.access_token) {
    storage.setItem("access_token", tokens.access_token);
    if (rememberMe) {
      sessionStorage.removeItem("access_token");
    } else {
      localStorage.removeItem("access_token");
    }
  }
  if (tokens.refresh_token) {
    storage.setItem("refresh_token", tokens.refresh_token);
    if (rememberMe) {
      sessionStorage.removeItem("refresh_token");
    } else {
      localStorage.removeItem("refresh_token");
    }
  }
  if (tokens.user_id) {
    storage.setItem("user_id", tokens.user_id);
    if (rememberMe) {
      sessionStorage.removeItem("user_id");
    } else {
      localStorage.removeItem("user_id");
    }
  }
}

function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("guest_mode");
  
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("guest_mode");
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("user_") || key.startsWith("auth_") || key.includes("admin"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

function setGuestMode() {
  localStorage.setItem("guest_mode", "true");
}

function isGuestMode(): boolean {
  return localStorage.getItem("guest_mode") === "true";
}

function getAccessToken(): string | null {
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
}

function getUserId(): string | null {
  return localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
}

function isAuthenticated(): boolean {
  const hasLocalToken = !!localStorage.getItem("access_token");
  const hasSessionToken = !!sessionStorage.getItem("access_token");
  return hasLocalToken || hasSessionToken || isGuestMode();
}

export { 
  saveAuthTokens, 
  clearAuthTokens, 
  isAuthenticated, 
  setGuestMode, 
  isGuestMode,
  getAccessToken,
  getRefreshToken,
  getUserId
};
