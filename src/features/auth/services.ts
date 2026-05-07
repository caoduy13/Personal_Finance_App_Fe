import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import {
  mapAxiosAuthError,
  buildAuthResponse,
  splitFullName,
} from "./backendAuth";
import { apiBare } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { env } from "@/lib/env";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";

import type { AxiosResponse } from "axios";
import { API_ENDPOINT } from "@/shared/constants";

interface BackendAuthEnvelope {
  id: string;
  username?: string;
  accessToken?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
}

/** Logout không có trong Swagger deployed — chỉ luôn mock (xóa local ở hook). */
const AUTH_STRATEGY = {
  login: (env.USE_REAL_AUTH ? "real" : "mock") as RequestMode,
  register: (env.USE_REAL_AUTH ? "real" : "mock") as RequestMode,
  logout: "mock" as RequestMode,
} as const;

async function unwrapAuthPost(
  work: Promise<AxiosResponse<BackendAuthEnvelope>>,
): Promise<AuthResponse> {
  const { data } = await work;
  return buildAuthResponse(data);
}

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const realRequest = async () => {
      try {
        return await unwrapAuthPost(
          apiBare.post<BackendAuthEnvelope>(API_ENDPOINT.AUTH.LOGIN, {
            email: payload.email,
            password: payload.password,
          }),
        );
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
        return await unwrapAuthPost(
          apiBare.post<BackendAuthEnvelope>(
            API_ENDPOINT.AUTH.REGISTER,
            {
              username: payload.username,
              email: payload.email,
              password: payload.password,
              firstName,
              lastName,
            },
          ),
        );
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
      // Không có endpoint logout trên BE hiện tại
    };

    const mockRequest = async () => {
      await wait(200);
    };

    return requestWithStrategy(AUTH_STRATEGY.logout, realRequest, mockRequest);
  },
};
