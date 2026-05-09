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
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CATEGORIES: "/admin/categories",
    BROADCASTS: "/admin/broadcasts",
    AUDIT_LOGS: "/admin/audit-logs",
    AI_SETTINGS: "/admin/ai-settings",
    CHANGE_ROLE: "/change-role",
  },
} as const;
