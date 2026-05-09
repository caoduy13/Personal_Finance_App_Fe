import type { UserRole } from "@/shared/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Session user; `role` is the string from the API (e.g. "User", "Admin"). */
export interface AuthUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse extends AuthUser {
  accessToken: string;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  role: UserRole | null;
}

export interface AuthActions {
  setAuth: (payload: {
    accessToken: string;
    role: UserRole;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;
}
