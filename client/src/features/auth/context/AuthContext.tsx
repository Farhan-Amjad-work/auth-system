import { createContext, useContext, useState, useCallback } from 'react'

import type { SafeUser } from '../types/auth.types'

// â”€â”€â”€ shape of what the context provides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface AuthContextValue {
  user: SafeUser | null
  accessToken: string | null
  setAuth: (user: SafeUser, accessToken: string) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

// â”€â”€â”€ context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AuthContext = createContext<AuthContextValue | null>(null)

// â”€â”€â”€ provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SafeUser | null>(() => {
    // rehydrate user from localStorage on page refresh
    const stored = localStorage.getItem('auth-user')
    return stored ? JSON.parse(stored) : null
  })

  const [accessToken, setAccessTokenState] = useState<string | null>(null)
  // accessToken intentionally NOT in localStorage â€” XSS risk

  const setAuth = useCallback((user: SafeUser, accessToken: string) => {
    setUser(user)
    setAccessTokenState(accessToken)
    localStorage.setItem('auth-user', JSON.stringify(user))
  }, [])

  const setAccessToken = useCallback((token: string) => {
    setAccessTokenState(token)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setAccessTokenState(null)
    localStorage.removeItem('auth-user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, accessToken, setAuth, setAccessToken, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

// â”€â”€â”€ hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}
