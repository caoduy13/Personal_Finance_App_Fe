import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";

const AUTH_STRATEGY = {
  login: "real" as RequestMode,
  register: "real" as RequestMode,
  logout: "real" as RequestMode,
} as const;

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const realRequest = () =>
      apiClient.post<AuthResponse>(
        API_ENDPOINT.AUTH.LOGIN,
        payload,
      ) as unknown as Promise<AuthResponse>;

    const mockRequest = async () => {
      await wait(300);
      return mockData.auth.login(payload.email);
    };

    return requestWithStrategy(AUTH_STRATEGY.login, realRequest, mockRequest);
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const realRequest = () =>
      apiClient.post<AuthResponse>(
        API_ENDPOINT.AUTH.REGISTER,
        payload,
      ) as unknown as Promise<AuthResponse>;

    const mockRequest = async () => {
      await wait(300);
      return mockData.auth.register(
        payload.username,
        payload.email,
        payload.firstName,
        payload.lastName,
      );
    };

    return requestWithStrategy(
      AUTH_STRATEGY.register,
      realRequest,
      mockRequest,
    );
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
