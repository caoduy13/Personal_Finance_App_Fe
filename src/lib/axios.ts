import axios from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  // Render free tier có cold start ~30s, nâng timeout lên đủ rộng cho lần đầu
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
  // JWT đính qua header Bearer; KHÔNG dùng cookie → tránh CORS preflight phức tạp
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
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
