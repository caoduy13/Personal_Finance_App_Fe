import axios from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store";

/** Raw axios — dùng khi cần body đầy đủ (vd: pagination + data). */
export const apiBare = axios.create({
  baseURL: env.API_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiBare.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiBare.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  config.withCredentials = false;

  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** Trả về JSON body gốc (`response.data`), không tách lớp `{ data }` để tránh mất pagination. */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);
