import { apiClient } from "@/lib/axios";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  NotificationItem,
  NotificationListParams,
  NotificationListResult,
  UpdateNotificationStatusPayload,
  UpdateNotificationStatusResult,
} from "./types";

const BASE = API_ENDPOINT.NOTIFICATIONS;

function parseMetadata(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  if (typeof value === "object") return value as Record<string, unknown>;
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function mapItem(raw: Record<string, unknown>): NotificationItem {
  const id = raw.id ?? raw.Id;
  const occurredAt = raw.occurredAt ?? raw.OccurredAt;
  const metadata = raw.metadataJson ?? raw.MetadataJson ?? raw.metadata ?? raw.Metadata;
  return {
    id: String(id ?? ""),
    type: String(raw.type ?? raw.Type ?? ""),
    title: String(raw.title ?? raw.Title ?? ""),
    body: String(raw.body ?? raw.Body ?? ""),
    isRead: Boolean(raw.isRead ?? raw.IsRead),
    occurredAt:
      typeof occurredAt === "string"
        ? occurredAt
        : occurredAt != null
          ? new Date(occurredAt as string | number).toISOString()
          : "",
    metadata: parseMetadata(metadata),
  };
}

function normalizeList(raw: unknown): NotificationListResult {
  const r = raw as Record<string, unknown>;
  const itemsRaw = r.items ?? r.Items;
  const list = Array.isArray(itemsRaw)
    ? itemsRaw.map((x) => mapItem(x as Record<string, unknown>))
    : [];

  return {
    items: list,
    totalItems: Number(r.totalItems ?? r.TotalItems ?? 0),
    pageSize: Number(r.pageSize ?? r.PageSize ?? 10),
    pageIndex: Number(r.pageIndex ?? r.PageIndex ?? 1),
    unreadCount: Number(r.unreadCount ?? r.UnreadCount ?? 0),
  };
}

export const notificationService = {
  async list(params?: NotificationListParams): Promise<NotificationListResult> {
    const query = {
      type: params?.type,
      status: params?.status,
      pageSize: params?.pageSize ?? 10,
      pageIndex: params?.pageIndex ?? 1,
    };
    const raw = (await apiClient.get(BASE, { params: query })) as unknown;
    return normalizeList(raw);
  },

  async updateStatus(
    payload: UpdateNotificationStatusPayload,
  ): Promise<UpdateNotificationStatusResult> {
    const body = {
      ids: payload.ids,
      isRead: payload.isRead,
      markAll: payload.markAll ?? false,
    };
    const raw = (await apiClient.patch(`${BASE}/status`, body)) as unknown;
    const r = raw as Record<string, unknown>;
    return {
      updatedCount: Number(r.updatedCount ?? r.UpdatedCount ?? 0),
      unreadCount: Number(r.unreadCount ?? r.UnreadCount ?? 0),
    };
  },
};
