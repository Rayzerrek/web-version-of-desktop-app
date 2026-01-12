import { useCallback, useState, useEffect, useRef } from "react";
import { apiFetch, authHeaders } from "../services/ApiClient";
import { isAuthenticated as isAuth, clearAuthTokens, getAccessToken } from "../utils/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuth());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const adminCheckInProgress = useRef<boolean>(false);
  
  const refreshAdmin = useCallback(async () => {
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
      setIsAdmin(Boolean(res && res.isAdmin === true));
    } catch (error) {
      setIsAdmin(false);
    } finally {
      adminCheckInProgress.current = false;
    }
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
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
      setIsAdmin(false);
    }
  }, [refreshAdmin]);

  return { isAuthenticated, isAdmin, refreshAdmin, login, logout };
}
