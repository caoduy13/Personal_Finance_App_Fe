import { apiClient } from "@/lib/axios";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  CassoConnectionSession,
  CassoSyncPayload,
  CassoSyncResult,
  CreateCassoConnectionPayload,
  CreateLinkApiFinancialAccountPayload,
  CreateManualFinancialAccountPayload,
  FinancialAccountItem,
  UpdateFinancialAccountPayload,
} from "./types";

const BASE = API_ENDPOINT.FINANCIAL_ACCOUNT;

function strId(v: unknown): string {
  return String(v ?? "");
}

function optStr(v: unknown): string | null {
  if (v == null || v === "") return null;
  return String(v);
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeRow(raw: Record<string, unknown>): FinancialAccountItem {
  return {
    id: strId(raw.id),
    name: String(raw.name ?? ""),
    accountType: String(raw.accountType ?? ""),
    connectionMode: String(raw.connectionMode ?? ""),
    currency: String(raw.currency ?? "VND"),
    currentBalance: num(raw.currentBalance),
    isActive: Boolean(raw.isActive),
    isDefault: Boolean(raw.isDefault),
    providerName: optStr(raw.providerName),
    maskedAccountNumber: optStr(raw.maskedAccountNumber),
    syncStatus: String(raw.syncStatus ?? "—"),
  };
}

function asRowArray(raw: unknown): FinancialAccountItem[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((x) => normalizeRow(x as Record<string, unknown>));
}

function normalizeCassoSession(raw: unknown): CassoConnectionSession {
  const r = raw as Record<string, unknown>;
  return {
    sessionId: strId(r.sessionId),
    authorizationUrl: String(r.authorizationUrl ?? ""),
    expiresAt: String(r.expiresAt ?? ""),
  };
}

function normalizeSyncResult(raw: unknown): CassoSyncResult {
  const r = raw as Record<string, unknown>;
  return {
    receivedCount: num(r.receivedCount),
    createdCount: num(r.createdCount),
    skippedCount: num(r.skippedCount),
    message: String(r.message ?? ""),
  };
}

export const financialAccountService = {
  /** GET — axios có thể đã unwrap `{ data: [...] }` thành mảng. */
  async list(): Promise<FinancialAccountItem[]> {
    const raw = await apiClient.get(BASE);
    if (Array.isArray(raw)) {
      return asRowArray(raw);
    }
    if (raw && typeof raw === "object" && "data" in raw) {
      return asRowArray((raw as { data: unknown }).data);
    }
    return [];
  },

  async createManual(
    payload: CreateManualFinancialAccountPayload,
  ): Promise<void> {
    await apiClient.post(`${BASE}/Manual`, {
      name: payload.name.trim(),
      accountType: payload.accountType,
      currentBalance: payload.currentBalance,
      currency: payload.currency ?? "VND",
      isDefault: payload.isDefault,
    });
  },

  async createLinkApi(
    payload: CreateLinkApiFinancialAccountPayload,
  ): Promise<void> {
    await apiClient.post(`${BASE}/LinkApi`, {
      bankName: payload.bankName.trim(),
      bankCode: payload.bankCode?.trim() || null,
      accountNumber: payload.accountNumber.trim(),
      accountHolderName: payload.accountHolderName?.trim() || null,
      isDefault: payload.isDefault,
    });
  },

  async connectCasso(
    payload: CreateCassoConnectionPayload,
  ): Promise<CassoConnectionSession> {
    const session = normalizeCassoSession(
      await apiClient.post(`${BASE}/casso/connect`, {
        returnUrl: payload.returnUrl ?? null,
        isDefault: payload.isDefault ?? null,
        autoSync: payload.autoSync ?? true,
      }),
    );

    if (!session.authorizationUrl) {
      throw new Error("Backend không trả authorizationUrl từ Casso.");
    }

    return session;
  },

  async syncCasso(
    id: string,
    payload: CassoSyncPayload = {},
  ): Promise<CassoSyncResult> {
    const raw = await apiClient.post(`${BASE}/${id}/sync`, {
      fromDate: payload.fromDate ?? null,
      toDate: payload.toDate ?? null,
      page: payload.page ?? 1,
      pageSize: payload.pageSize ?? 100,
      sort: payload.sort ?? "DESC",
      triggerProviderSync: payload.triggerProviderSync ?? true,
    });

    return normalizeSyncResult(raw);
  },

  async update(
    id: string,
    payload: UpdateFinancialAccountPayload,
  ): Promise<void> {
    const body: Record<string, string | number | boolean> = {};
    if (payload.name !== undefined && payload.name !== null) {
      body.name = payload.name;
    }
    if (
      payload.currentBalance !== undefined &&
      payload.currentBalance !== null
    ) {
      body.currentBalance = payload.currentBalance;
    }
    if (payload.isDefault !== undefined && payload.isDefault !== null) {
      body.isDefault = payload.isDefault;
    }
    await apiClient.patch(`${BASE}/${id}`, body);
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
