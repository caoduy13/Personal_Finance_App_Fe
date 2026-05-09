export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    LOGOUT: "/api/v1/auth/logout",
  },
  USER: {
    ME: "/User/me",
    SETUP: "/User/me/setup",
  },
  ONBOARDING: "/Onboarding",
  CATEGORIES: {
    LIST: "/api/v1/categories",
    DETAIL: (id: string) => `/api/v1/categories/${id}`,
  },
  ADMIN_CATEGORIES: {
    LIST: "/api/v1/admin/categories",
    DETAIL: (id: string) => `/api/v1/admin/categories/${id}`,
  },
  IMPORTS: {
    IMAGE: "/api/v1/imports/image",
  },
  HEALTH: {
    PING: "/health",
    DB_RENDER: "/health/db/render",
    DB_LOCAL: "/health/db/local",
  },
  FINANCIAL_ACCOUNT: "/FinancialAccount",
  JAR: "/Jar",
  TRANSACTIONS: "/Transactions",
  GOALS: "/goals",
  ADMIN: {
    DASHBOARD: "/api/v1/admin/dashboard",
    USERS: "/api/v1/admin/users",
    CATEGORIES: "/api/v1/admin/categories",
    BROADCASTS: "/api/v1/admin/broadcasts",
    AUDIT_LOGS: "/api/v1/admin/audit-logs",
  },
} as const;
