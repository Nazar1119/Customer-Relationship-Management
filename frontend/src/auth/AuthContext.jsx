import { createContext, useContext, useMemo, useState } from 'react'
import { login as loginApi, logout as logoutApi } from '../services/dotnetApi'

const AuthContext = createContext(null)

const normalizeRole = (role) => (role ? String(role).toLowerCase() : 'user')

const decodeJwt = (token) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    return JSON.parse(json)
  } catch (err) {
    console.warn('Failed to decode JWT', err)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role = normalizeRole(localStorage.getItem('role'))
    const name = localStorage.getItem('name')
    return token ? { token, role, name } : null
  })

  const normalizeLoginResponse = (payload) => {
    if (!payload) throw new Error('Empty login response')
    if (typeof payload === 'string') {
      const decoded = decodeJwt(payload)
      const claimedRole =
        decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      return { token: payload, role: normalizeRole(claimedRole), name: decoded?.name || null }
    }
    const token =
      payload.token ||
      payload.access_token ||
      payload.accessToken ||
      payload.jwt ||
      payload.id_token
    if (!token) throw new Error('Login response missing token')
    const roleRaw =
      payload.role ||
      payload.roles?.[0] ||
      payload.user?.role ||
      payload.claims?.role ||
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decodeJwt(token)?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decodeJwt(token)?.roles?.[0] ||
      decodeJwt(token)?.role ||
      'user'
    const role = normalizeRole(roleRaw)
    const name = payload.name || payload.user?.name || payload.username || payload.email || null
    return { token, role, name }
  }

  const login = async (credentials) => {
    const result = await loginApi(credentials)
    const { token, role, name } = normalizeLoginResponse(result)
    const normalizedRole = normalizeRole(role)

    if (token) localStorage.setItem('token', token)
    if (normalizedRole) localStorage.setItem('role', normalizedRole)
    if (name) localStorage.setItem('name', name)

    setUser({ token, role: normalizedRole, name })
    return { token, role: normalizedRole, name }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (err) {
      // ignore logout errors to avoid trapping the user
      console.warn('Logout failed', err)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isAuthenticated: Boolean(user?.token),
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
