import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'

import { authApi } from '../api/authApi'
import { useAuthContext } from '../context/AuthContext'
import type { LoginPayload, RegisterPayload } from '../types/auth.types'

export const useAuth = () => {
  const { setAuth, clearAuth } = useAuthContext()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (payload: LoginPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await authApi.login(payload)
      setAuth(data.data!.user, data.data!.accessToken)
      navigate(ROUTES.DASHBOARD)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await authApi.register(payload)
      setAuth(data.data!.user, data.data!.accessToken)
      navigate(ROUTES.DASHBOARD)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try { await authApi.logout() } catch { /* best effort â€” clear locally even if server fails */ }
    clearAuth()
    navigate(ROUTES.LOGIN)
  }

  return { login, register, logout, isLoading, error }
}
