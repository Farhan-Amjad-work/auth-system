import axios from 'axios'

// Plain instance — no token attachment, no refresh logic
// Used for: /api/auth/login, /api/auth/register, /api/auth/refresh
export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})