export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USER: {
    ME: "/user/me",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CATEGORIES: "/admin/categories",
  },
} as const;
