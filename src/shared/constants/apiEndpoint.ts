export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    LOGOUT: "auth/logout",
  },
  USER: {
    ME: "/User/me",
    SETUP: "/User/me/setup",
  },
  /** POST — khớp BE `[Route("api/v1/onboarding")]` */
  ONBOARDING: "onboarding",
  CATEGORIES: {
    LIST: "categories",
    DETAIL: (id: string) => `categories/${id}`,
  },
  ADMIN_CATEGORIES: {
    LIST: "admin/categories",
    DETAIL: (id: string) => `admin/categories/${id}`,
  },
  IMPORTS: {
    IMAGE: "imports/image",
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
