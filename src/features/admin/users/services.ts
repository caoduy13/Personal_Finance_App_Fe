import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import type { AdminUserItem } from "./types";

const ADMIN_USER_STRATEGY = {
  list: "mock" as RequestMode,
} as const;

export const adminUserService = {
  async list(): Promise<AdminUserItem[]> {
    const realRequest = () => apiClient.get<AdminUserItem[]>("/admin/users") as unknown as Promise<AdminUserItem[]>;

    const mockRequest = async () => {
      await wait(200);
      const roleMap = new Map(mockData.tables.roles.map((role) => [role.id, role.code]));
      return mockData.tables.accounts.map((account) => ({
        id: account.id,
        username: account.username,
        email: account.email,
        fullName: account.full_name,
        status: account.status,
        roleCode: roleMap.get(account.role_id) ?? "USER",
      }));
    };

    return requestWithStrategy(ADMIN_USER_STRATEGY.list, realRequest, mockRequest);
  },
};
