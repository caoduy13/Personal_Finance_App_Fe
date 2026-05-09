import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  CreateTransactionPayload,
  DeleteTransactionResult,
  TransactionItem,
  TransactionListParams,
  TransactionListResult,
  TransactionPagination,
  TransactionType,
  UpdateTransactionPayload,
} from "./types";

const TRANSACTION_STRATEGY = {
  list: "mock" as RequestMode,
  create: "mock" as RequestMode,
  update: "mock" as RequestMode,
  remove: "mock" as RequestMode,
} as const;

interface TransactionApiRow {
  id: string;
  type: string;
  transactionsAmount: number;
  note?: string | null;
  date: string;
  financialAccount?: { id?: string | null; name?: string | null };
  jar?: { id?: string | null; name?: string | null };
  category?: { id?: string | null; name?: string | null };
}

interface TransactionsListApiBody {
  data: TransactionApiRow[];
  pagination: TransactionPagination;
}

function mapRow(row: TransactionApiRow): TransactionItem {
  return {
    id: row.id,
    type: row.type as TransactionType,
    amount: Number(row.transactionsAmount),
    note: row.note ?? "",
    transactionDate: row.date,
    financialAccountName: row.financialAccount?.name,
    jarName: row.jar?.name,
    categoryName: row.category?.name,
  };
}

function buildListParams(params?: TransactionListParams) {
  if (!params) return undefined;
  return {
    pageIndex: params.pageIndex ?? 1,
    pageSize: params.pageSize ?? 20,
    financialAccountId: params.financialAccountId,
    type: params.type,
    jarId: params.jarId,
    categoryId: params.categoryId,
    fromDate: params.fromDate,
    toDate: params.toDate,
    keyword: params.keyword,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
  };
}

export const transactionService = {
  async list(params?: TransactionListParams): Promise<TransactionListResult> {
    const realRequest = async () => {
      const body = (await apiClient.get(API_ENDPOINT.TRANSACTIONS, {
        params: buildListParams(params),
      })) as TransactionsListApiBody;
      return {
        items: body.data.map(mapRow),
        pagination: body.pagination,
      };
    };

    const mockRequest = async (): Promise<TransactionListResult> => {
      await wait(200);
      const items: TransactionItem[] = mockData.tables.transactions.map(
        (item) => ({
          id: item.id,
          type: item.type as TransactionType,
          amount: item.amount,
          note: item.note ?? "",
          transactionDate: item.transaction_date,
        }),
      );
      return {
        items,
        pagination: {
          page: 1,
          pageSize: items.length,
          totalCount: items.length,
          totalPages: 1,
        },
      };
    };

    return requestWithStrategy(
      TRANSACTION_STRATEGY.list,
      realRequest,
      mockRequest,
    );
  },

  async create(payload: CreateTransactionPayload): Promise<TransactionItem> {
    const realRequest = async () => {
      const body = {
        financialAccountId: payload.financialAccountId ?? undefined,
        type: payload.type,
        transactionsAmount: payload.amount,
        categoryId: payload.categoryId ?? undefined,
        fromJarId: payload.fromJarId ?? undefined,
        toJarId: payload.toJarId ?? undefined,
        note: payload.note ?? null,
        date: payload.date ?? new Date().toISOString(),
      };
      const row = (await apiClient.post(API_ENDPOINT.TRANSACTIONS, body)) as {
        id: string;
        type: string;
        transactionsAmount: number;
        date: string;
      };
      return {
        id: row.id,
        type: row.type as TransactionType,
        amount: Number(row.transactionsAmount),
        note: payload.note ?? "",
        transactionDate: row.date,
      };
    };

    const mockRequest = async (): Promise<TransactionItem> => {
      await wait(200);
      return {
        id: crypto.randomUUID(),
        type: payload.type,
        amount: payload.amount,
        note: payload.note ?? "",
        transactionDate: new Date().toISOString(),
      };
    };

    return requestWithStrategy(
      TRANSACTION_STRATEGY.create,
      realRequest,
      mockRequest,
    );
  },

  async update(
    id: string,
    payload: UpdateTransactionPayload,
  ): Promise<TransactionItem> {
    const realRequest = async () => {
      const row = (await apiClient.patch(
        `${API_ENDPOINT.TRANSACTIONS}/${id}`,
        payload,
      )) as {
        id: string;
        type: string;
        transactionsAmount: number;
        date: string;
      };
      return {
        id: row.id,
        type: row.type as TransactionType,
        amount: Number(row.transactionsAmount),
        note: payload.note ?? "",
        transactionDate: row.date,
      };
    };

    const mockRequest = async (): Promise<TransactionItem> => {
      await wait(200);
      return {
        id,
        type: "Expense",
        amount: payload.transactionsAmount ?? 0,
        note: payload.note ?? "",
        transactionDate: new Date().toISOString(),
      };
    };

    return requestWithStrategy(
      TRANSACTION_STRATEGY.update,
      realRequest,
      mockRequest,
    );
  },

  async remove(id: string): Promise<DeleteTransactionResult> {
    const realRequest = async () => {
      return (await apiClient.delete(
        `${API_ENDPOINT.TRANSACTIONS}/${id}`,
      )) as DeleteTransactionResult;
    };

    const mockRequest = async (): Promise<DeleteTransactionResult> => {
      await wait(200);
      return { message: "Transaction deleted" };
    };

    return requestWithStrategy(
      TRANSACTION_STRATEGY.remove,
      realRequest,
      mockRequest,
    );
  },
};
