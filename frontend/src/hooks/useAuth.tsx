import { useCallback, useState, useEffect } from 'react'
import { apiFetch, authHeaders } from '../services/ApiClient'
import { isAuthenticated as isAuth, clearAuthTokens } from '../utils/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuth())
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const refreshAdmin = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setIsAdmin(false)
      return
    }
    try {
      const res = await apiFetch<{ isAdmin: boolean }>(`/auth/check_admin`, {
        method: 'GET',
        headers: authHeaders(token),
      })
      setIsAdmin(Boolean(res && (res as any).isAdmin))
    } catch (error) {
      setIsAdmin(false)
    }
  }, [])

  const login = useCallback(() => {
    setIsAuthenticated(true)
    refreshAdmin()
  }, [refreshAdmin])

  const logout = useCallback(() => {
    clearAuthTokens()
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.location.reload()
  }, [])

  useEffect(() => {
    setIsAuthenticated(isAuth())
    if (isAuth()) {
      refreshAdmin()
    }
  }, [refreshAdmin])

  return { isAuthenticated, isAdmin, refreshAdmin, login, logout }
}
