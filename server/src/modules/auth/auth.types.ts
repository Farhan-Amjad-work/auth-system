export interface JwtPayload {
  userId: string;
  email: string;
  sessionId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
