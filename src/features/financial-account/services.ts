import { apiClient } from "@/lib/axios";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";

const ACCOUNT_STRATEGY = { list: "real" as RequestMode } as const;

export interface FinancialAccountRow {
  id: string;
  name: string;
  currentBalance: number;
  isDefault: boolean;
}

function parseAccounts(raw: unknown): FinancialAccountRow[] {
  if (raw == null || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const rows = Array.isArray(o.data) ? o.data : [];
  return rows
    .map((row): FinancialAccountRow | null => {
      if (row == null || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = String(r.id ?? "");
      if (!id) return null;
      return {
        id,
        name: String(r.name ?? ""),
        currentBalance: Number(r.currentBalance ?? 0),
        isDefault: Boolean(r.isDefault),
      };
    })
    .filter((x): x is FinancialAccountRow => x != null);
}

export const financialAccountService = {
  async list(): Promise<FinancialAccountRow[]> {
    const realRequest = async () =>
      parseAccounts(await apiClient.get<unknown>("/FinancialAccount"));

    const mockRequest = async () => {
      await wait(100);
      return [
        { id: "mock-fa", name: "Tiền mặt", currentBalance: 0, isDefault: true },
      ];
    };

    return requestWithStrategy(ACCOUNT_STRATEGY.list, realRequest, mockRequest);
  },
};
