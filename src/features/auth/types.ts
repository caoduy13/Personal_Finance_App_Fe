import type { UserRole } from "@/shared/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  role: UserRole | null;
}

export interface AuthActions {
  setAuth: (payload: { accessToken: string; role: UserRole; user: AuthUser }) => void;
  clearAuth: () => void;
}
