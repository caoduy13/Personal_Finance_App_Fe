import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type { AdminAuditLogItem, AdminAuditLogListResult, AdminAuditLogParams } from "./types";

const AUDIT_STRATEGY = {
  list: "mock" as RequestMode,
} as const;

function mapMockLog(row: (typeof mockData.tables.audit_logs)[number]): AdminAuditLogItem {
  return {
    id: row.id,
    adminUsername: "admin",
    actionType: row.action_type,
    entityType: row.entity_type,
    description: row.description,
    createdAt: row.created_at,
  };
}

export const adminAuditLogService = {
  async list(params?: AdminAuditLogParams): Promise<AdminAuditLogListResult> {
    const realRequest = async () => {
      const body = (await apiClient.get(API_ENDPOINT.ADMIN.AUDIT_LOGS, {
        params: {
          adminId: params?.adminId,
          actionType: params?.actionType,
          entityType: params?.entityType,
          fromDate: params?.fromDate,
          toDate: params?.toDate,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 50,
        },
      })) as {
        items: AdminAuditLogItem[];
        pagination: AdminAuditLogListResult["pagination"];
      };
      return { items: body.items, pagination: body.pagination };
    };

    const mockRequest = async (): Promise<AdminAuditLogListResult> => {
      await wait(200);
      const items = mockData.tables.audit_logs.map(mapMockLog);
      return {
        items,
        pagination: {
          pageIndex: 1,
          pageSize: items.length,
          totalCount: items.length,
          totalPages: 1,
        },
      };
    };

    return requestWithStrategy(AUDIT_STRATEGY.list, realRequest, mockRequest);
  },
};
