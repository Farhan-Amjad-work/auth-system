import { axiosAuth } from '@/lib/axiosAuth'
import { axiosPublic } from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'

import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types'

export const authApi = {
  // Public routes — no token needed, no refresh logic
  register: (payload: RegisterPayload) =>
    axiosPublic.post<ApiResponse<AuthResponse>>('/api/auth/register', payload),

  login: (payload: LoginPayload) =>
    axiosPublic.post<ApiResponse<AuthResponse>>('/api/auth/login', payload),

  // Protected routes — requires valid access token
  logout: () =>
    axiosAuth.post<ApiResponse>('/api/auth/logout'),

  logoutAll: () =>
    axiosAuth.post<ApiResponse>('/api/auth/logout-all'),
}