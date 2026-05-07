export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USER: {
    ME: "/user/me",
  },
} as const;
