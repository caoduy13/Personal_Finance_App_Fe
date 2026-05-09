import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import { AccountRole, type AdminUserItem } from "./types";

const ADMIN_USER_STRATEGY = {
  list: "mock" as RequestMode,
} as const;

export const adminUserService = {
  async list(): Promise<AdminUserItem[]> {
    const realRequest = () =>
      apiClient.get<AdminUserItem[]>("/admin/users") as unknown as Promise<
        AdminUserItem[]
      >;

    const mockRequest = async () => {
      await wait(200);
      const roleMap = new Map(
        mockData.tables.roles.map((role) => [role.id, role.code]),
      );
      return mockData.tables.accounts.map((account) => ({
        id: account.id,
        username: account.username,
        email: account.email,
        fullName: account.full_name,
        status: account.status,
        roleCode: roleMap.get(account.role_id) ?? "USER",
      }));
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.list,
      realRequest,
      mockRequest,
    );
  },

  async changeRole(accountId: string, role: AccountRole): Promise<string> {
    const realRequest = async () => {
      const { data } = await apiClient.patch<string | unknown>(
        `${API_ENDPOINT.ADMIN.CHANGE_ROLE}/${accountId}`,
        null,
        { params: { role } },
      );
      return typeof data === "string" ? data : String(data);
    };

    const mockRequest = async () => {
      await wait(200);
      const account = mockData.tables.accounts.find((a) => a.id === accountId);
      if (!account) throw new Error("User not found");
      const row = account as { role_id: number; updated_at: string };
      // Mock DB: role_id 1 = ADMIN, 2 = USER (see mockData.roles)
      row.role_id = role === AccountRole.Admin ? 1 : 2;
      row.updated_at = new Date().toISOString();
      return "User role updated successfully";
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.list,
      realRequest,
      mockRequest,
    );
  },
};
