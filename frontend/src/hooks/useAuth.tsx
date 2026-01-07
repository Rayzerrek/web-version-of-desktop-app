import { useCallback, useState, useEffect, useRef } from "react";
import { apiFetch, authHeaders } from "../services/ApiClient";
import { isAuthenticated as isAuth, clearAuthTokens, getAccessToken } from "../utils/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuth());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const adminCheckInProgress = useRef<boolean>(false);
  
  const refreshAdmin = useCallback(async () => {
    // Prevent multiple simultaneous admin checks
    if (adminCheckInProgress.current) {
      return;
    }
    
    const token = getAccessToken();
    if (!token) {
      setIsAdmin(false);
      return;
    }
    
    adminCheckInProgress.current = true;
    
    try {
      const res = await apiFetch<{ isAdmin: boolean }>(`/auth/check_admin`, {
        method: "GET",
        headers: authHeaders(token),
      });
      // Only set admin status if we got a clear positive response
      setIsAdmin(Boolean(res && res.isAdmin === true));
    } catch (error) {
      // On any error, user is NOT admin
      setIsAdmin(false);
    } finally {
      adminCheckInProgress.current = false;
    }
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    // Reset admin state before checking
    setIsAdmin(false);
    refreshAdmin();
  }, [refreshAdmin]);

  const logout = useCallback(() => {
    clearAuthTokens();
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    setIsAuthenticated(isAuth());
    if (isAuth()) {
      refreshAdmin();
    } else {
      // If not authenticated, definitely not admin
      setIsAdmin(false);
    }
  }, [refreshAdmin]);

  return { isAuthenticated, isAdmin, refreshAdmin, login, logout };
}
