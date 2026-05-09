export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USER: {
    ME: "/user/me",
  },
  CATEGORIES: "/categories",
  FINANCIAL_ACCOUNT: "/financial-accounts",
  JAR: "/jars",
  TRANSACTIONS: "/transactions",
  GOALS: "/goals",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CATEGORIES: "/admin/categories",
    BROADCASTS: "/admin/broadcasts",
    AUDIT_LOGS: "/admin/audit-logs",
  },
} as const;
