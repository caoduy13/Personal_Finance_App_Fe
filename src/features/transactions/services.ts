import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type { CreateTransactionPayload, TransactionItem } from "./types";

const TRANSACTION_STRATEGY = {
  list: "real" as RequestMode,
  create: "real" as RequestMode,
} as const;

function mapTransactionRow(raw: unknown): TransactionItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const x = raw as Record<string, unknown>;
  const id = String(x.id ?? "");
  if (!id) return null;
  const type = x.type === "Income" || x.type === "Expense" ? x.type : "Expense";
  const amount = Number(x.transactionsAmount ?? x.amount ?? 0);
  const note = x.note != null ? String(x.note) : "";
  const transactionDate = String(
    x.date ?? x.transactionDate ?? new Date().toISOString(),
  );
  return {
    id,
    type,
    amount: Math.abs(amount),
    note,
    transactionDate,
  };
}

function parseListResponse(raw: unknown): TransactionItem[] {
  if (raw == null || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const rows = Array.isArray(o.data) ? o.data : [];
  return rows
    .map(mapTransactionRow)
    .filter((r): r is TransactionItem => r != null);
}

export const transactionService = {
  async list(params?: {
    pageIndex?: number;
    pageSize?: number;
    type?: string;
    keyword?: string;
  }): Promise<TransactionItem[]> {
    const realRequest = async () => {
      const q = new URLSearchParams();
      q.set("pageIndex", String(params?.pageIndex ?? 1));
      q.set("pageSize", String(params?.pageSize ?? 50));
      if (params?.type) q.set("type", params.type);
      if (params?.keyword) q.set("keyword", params.keyword);
      const raw = await apiClient.get<unknown>(`/Transactions?${q.toString()}`);
      return parseListResponse(raw);
    };

    const mockRequest = async () => {
      await wait(200);
      return mockData.tables.transactions.map((item) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        note: item.note ?? "",
        transactionDate: item.transaction_date,
      }));
    };

    return requestWithStrategy(TRANSACTION_STRATEGY.list, realRequest, mockRequest);
  },

  async create(payload: CreateTransactionPayload): Promise<TransactionItem> {
    const realRequest = async () => {
      const body = {
        financialAccountId: payload.financialAccountId ?? null,
        type: payload.type,
        transactionsAmount: payload.amount,
        categoryId: payload.categoryId ?? null,
        fromJarId: payload.fromJarId ?? null,
        toJarId: payload.toJarId ?? null,
        note: payload.note?.trim() || null,
        date: payload.date ?? new Date().toISOString(),
      };
      const raw = await apiClient.post<unknown>("/Transactions", body);
      const mapped = mapTransactionRow(raw);
      if (mapped) return mapped;
      return {
        id: crypto.randomUUID(),
        type: payload.type,
        amount: payload.amount,
        note: payload.note ?? "",
        transactionDate: payload.date ?? new Date().toISOString(),
      };
    };

    const mockRequest = async () => {
      await wait(200);
      return {
        id: crypto.randomUUID(),
        type: payload.type,
        amount: payload.amount,
        note: payload.note ?? "",
        transactionDate: payload.date ?? new Date().toISOString(),
      };
    };

    return requestWithStrategy(TRANSACTION_STRATEGY.create, realRequest, mockRequest);
  },
};
