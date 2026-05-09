import axios from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  // JWT qua header Bearer — không cần cookie cross-origin; `true` bắt buộc BE trả
  // Access-Control-Allow-Credentials (và không được dùng * cho origin).
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  // Luôn tắt cookie cross-origin; tránh CORS bắt Access-Control-Allow-Credentials.
  config.withCredentials = false;

  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined
      ? response.data.data
      : response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  },
);
