import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import type { CreateTransactionPayload, TransactionItem } from "./types";

const TRANSACTION_STRATEGY = {
  list: "mock" as RequestMode,
  create: "mock" as RequestMode,
} as const;

export const transactionService = {
  async list(): Promise<TransactionItem[]> {
    const realRequest = () =>
      apiClient.get<TransactionItem[]>("/transactions") as unknown as Promise<TransactionItem[]>;

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
    const realRequest = () =>
      apiClient.post<TransactionItem>("/transactions", payload) as unknown as Promise<TransactionItem>;

    const mockRequest = async () => {
      await wait(200);
      return {
        id: crypto.randomUUID(),
        ...payload,
        transactionDate: new Date().toISOString(),
      };
    };

    return requestWithStrategy(TRANSACTION_STRATEGY.create, realRequest, mockRequest);
  },
};
