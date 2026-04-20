import axios from 'axios'
import { axiosPublic } from './axios'

let _accessToken: string | null = null

export const setInterceptorToken = (token: string | null) => {
  _accessToken = token
}

// Protected instance — used for all routes that require authentication
export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

axiosAuth.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`
  }
  return config
})

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Use axiosPublic here — plain call, no interceptor loop risk
        const { data } = await axiosPublic.post('/api/auth/refresh')
        const newToken: string = data.data.accessToken
        setInterceptorToken(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosAuth(originalRequest)
      } catch {
        setInterceptorToken(null)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)