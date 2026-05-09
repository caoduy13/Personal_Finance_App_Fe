import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  AdminBroadcast,
  AdminBroadcastListParams,
  AdminBroadcastListResult,
  CreateBroadcastPayload,
} from "./types";

const BROADCAST_STRATEGY = {
  list: "mock" as RequestMode,
  create: "mock" as RequestMode,
} as const;

function mapMockBroadcast(row: (typeof mockData.tables.broadcasts)[number]): AdminBroadcast {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    targetAudience: row.target_audience,
    status: row.status,
    scheduledAt: null,
    sentAt: row.sent_at,
    targetCount: row.target_count,
    deliveredCount: row.delivered_count,
  };
}

export const adminBroadcastService = {
  async list(params?: AdminBroadcastListParams): Promise<AdminBroadcastListResult> {
    const realRequest = async () => {
      const body = (await apiClient.get(API_ENDPOINT.ADMIN.BROADCASTS, {
        params: {
          pageIndex: params?.pageIndex ?? 1,
          pageSize: params?.pageSize ?? 10,
          /** Mặc định Sent để lịch sử đã gửi; đổi qua params nếu cần Queued. */
          status: params?.status ?? "Sent",
        },
      })) as {
        items: AdminBroadcast[];
        pagination: AdminBroadcastListResult["pagination"];
      };
      return { items: body.items, pagination: body.pagination };
    };

    const mockRequest = async (): Promise<AdminBroadcastListResult> => {
      await wait(200);
      const items = mockData.tables.broadcasts.map(mapMockBroadcast);
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

    return requestWithStrategy(BROADCAST_STRATEGY.list, realRequest, mockRequest);
  },

  async create(payload: CreateBroadcastPayload): Promise<AdminBroadcast> {
    const realRequest = async () => {
      return (await apiClient.post(API_ENDPOINT.ADMIN.BROADCASTS, {
        title: payload.title,
        body: payload.body,
        targetAudience: payload.targetAudience ?? "All",
        scheduledAt: payload.scheduledAt ?? null,
      })) as AdminBroadcast;
    };

    const mockRequest = async (): Promise<AdminBroadcast> => {
      await wait(250);
      return {
        id: crypto.randomUUID(),
        title: payload.title,
        body: payload.body,
        targetAudience: payload.targetAudience ?? "All",
        status: "Queued",
        scheduledAt: payload.scheduledAt ?? null,
        sentAt: null,
        targetCount: 0,
        deliveredCount: 0,
      };
    };

    return requestWithStrategy(BROADCAST_STRATEGY.create, realRequest, mockRequest);
  },
};
