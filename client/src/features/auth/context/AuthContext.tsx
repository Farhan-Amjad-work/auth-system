import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { setInterceptorToken } from "@/lib/axiosAuth";

import type { SafeUser } from "../types/auth.types";

// ─── types ────────────────────────────────────────────────
interface AuthContextValue {
  user: SafeUser | null;
  accessToken: string | null;
  setAuth: (user: SafeUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

// ─── context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── provider ────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SafeUser | null>(() => {
    try {
      const stored = localStorage.getItem("auth-user");
      return stored ? (JSON.parse(stored) as SafeUser) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  // Every time accessToken changes — login, silent refresh, logout —
  // sync it to the axios interceptor so outgoing requests stay up to date
  useEffect(() => {
    setInterceptorToken(accessToken);
  }, [accessToken]);

  const setAuth = useCallback((newUser: SafeUser, newToken: string) => {
    setUser(newUser);
    setAccessTokenState(newToken);
    localStorage.setItem("auth-user", JSON.stringify(newUser));
  }, []);

  const setAccessToken = useCallback((token: string) => {
    setAccessTokenState(token);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessTokenState(null);
    localStorage.removeItem("auth-user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setAuth, setAccessToken, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── hook ─────────────────────────────────────────────────
export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
