import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import { mapAxiosAuthError, splitFullName } from "./backendAuth";
import { apiClient } from "@/lib/axios";
import { extractRoleFromToken } from "@/lib/jwt";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";

/** BE trả phẳng, không bọc `{ data }`, không có `user` lồng nhau. */
interface BackendAuthResponse {
  id: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  accessToken: string;
  isOnboardingCompleted?: boolean;
}

function adaptAuthResponse(be: BackendAuthResponse): AuthResponse {
  const first = be.firstName?.trim() ?? "";
  const last = be.lastName?.trim() ?? "";
  const fullName = `${first} ${last}`.trim() || be.username || be.email;
  return {
    accessToken: be.accessToken,
    user: {
      id: be.id,
      email: be.email,
      fullName,
      role: extractRoleFromToken(be.accessToken),
      isOnboardingCompleted: be.isOnboardingCompleted ?? false,
    },
  };
}

const AUTH_STRATEGY = {
  login: "real" as RequestMode,
  register: "real" as RequestMode,
  logout: "real" as RequestMode,
} as const;

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const realRequest = async () => {
      try {
        const be = (await apiClient.post<BackendAuthResponse>(
          API_ENDPOINT.AUTH.LOGIN,
          {
            email: payload.email.trim(),
            password: payload.password,
          },
        )) as unknown as BackendAuthResponse;
        return adaptAuthResponse(be);
      } catch (e) {
        throw mapAxiosAuthError(e);
      }
    };

    const mockRequest = async () => {
      await wait(300);
      return mockData.auth.login(payload.email);
    };

    return requestWithStrategy(AUTH_STRATEGY.login, realRequest, mockRequest);
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const realRequest = async () => {
      const { firstName, lastName } = splitFullName(payload.fullName);
      try {
        const be = (await apiClient.post<BackendAuthResponse>(
          API_ENDPOINT.AUTH.REGISTER,
          {
            username: payload.username.trim(),
            email: payload.email.trim(),
            password: payload.password,
            firstName,
            lastName,
          },
        )) as unknown as BackendAuthResponse;
        return adaptAuthResponse(be);
      } catch (e) {
        throw mapAxiosAuthError(e);
      }
    };

    const mockRequest = async () => {
      await wait(300);
      return mockData.auth.register(payload.username, payload.email, payload.fullName);
    };

    return requestWithStrategy(AUTH_STRATEGY.register, realRequest, mockRequest);
  },

  async logout(): Promise<void> {
    const realRequest = async () => {
      await apiClient.post(API_ENDPOINT.AUTH.LOGOUT);
    };

    const mockRequest = async () => {
      await wait(200);
    };

    return requestWithStrategy(AUTH_STRATEGY.logout, realRequest, mockRequest);
  },
};
