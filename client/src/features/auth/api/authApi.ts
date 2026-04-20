import { axiosInstance } from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'

import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types'

export const authApi = {
  register: (payload: RegisterPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/register', payload),

  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/login', payload),

  logout: () =>
    axiosInstance.post<ApiResponse>('/api/auth/logout'),

  logoutAll: () =>
    axiosInstance.post<ApiResponse>('/api/auth/logout-all'),
}