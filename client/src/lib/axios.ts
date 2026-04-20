import axios from "axios";

// A module-level token ref that AuthProvider keeps in sync
// This avoids calling a hook outside React (hooks can't run in axios interceptors)
let _accessToken: string | null = null;

export const setInterceptorToken = (token: string | null) => {
  _accessToken = token;
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const isAuthRoute = (url?: string) =>
  !!url &&
  ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"].some((path) =>
    url.endsWith(path),
  );

axiosInstance.interceptors.request.use((config) => {
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthRoute(original.url)
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = data.data.accessToken;
        setInterceptorToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        setInterceptorToken(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
