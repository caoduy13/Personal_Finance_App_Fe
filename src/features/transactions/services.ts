import { apiClient } from "@/lib/axios";
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

const BASE = API_ENDPOINT.TRANSACTIONS;

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
  const raw = row as TransactionApiRow & Record<string, unknown>;
  const financialAccount =
    row.financialAccount ??
    (raw.FinancialAccount as TransactionApiRow["financialAccount"]);
  const jar = row.jar ?? (raw.Jar as TransactionApiRow["jar"]);
  const category = row.category ?? (raw.Category as TransactionApiRow["category"]);
  return {
    id: String(row.id ?? raw.Id ?? ""),
    type: String(row.type ?? raw.Type ?? "Expense") as TransactionType,
    amount: Number(row.transactionsAmount ?? raw.TransactionsAmount ?? 0),
    note: String(row.note ?? raw.Note ?? ""),
    transactionDate: String(row.date ?? raw.Date ?? ""),
    financialAccountId: financialAccount?.id,
    financialAccountName: financialAccount?.name,
    jarId: jar?.id,
    jarName: jar?.name,
    categoryId: category?.id,
    categoryName: category?.name,
  };
}

function normalizePagination(raw?: Partial<TransactionPagination> & {
  Page?: number;
  PageIndex?: number;
  PageSize?: number;
  TotalCount?: number;
  TotalPages?: number;
}): TransactionPagination {
  const pageIndex = Number(raw?.pageIndex ?? raw?.page ?? raw?.PageIndex ?? raw?.Page ?? 1);
  return {
    page: pageIndex,
    pageIndex,
    pageSize: Number(raw?.pageSize ?? raw?.PageSize ?? 20),
    totalCount: Number(raw?.totalCount ?? raw?.TotalCount ?? 0),
    totalPages: Number(raw?.totalPages ?? raw?.TotalPages ?? 1),
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
    const body = (await apiClient.get(BASE, {
      params: buildListParams(params),
    })) as TransactionsListApiBody;
    const rawBody = body as TransactionsListApiBody & {
      Data?: TransactionApiRow[];
      Pagination?: TransactionPagination;
    };
    const rows = body.data ?? rawBody.Data ?? [];
    return {
      items: rows.map(mapRow),
      pagination: normalizePagination(body.pagination ?? rawBody.Pagination),
    };
  },

  async getById(id: string): Promise<TransactionItem> {
    const raw = (await apiClient.get(`${BASE}/${id}`)) as
      | TransactionApiRow
      | { data?: TransactionApiRow; Data?: TransactionApiRow };
    const wrapped = raw as { data?: TransactionApiRow; Data?: TransactionApiRow };
    const row = wrapped.data ?? wrapped.Data ?? (raw as TransactionApiRow);
    return mapRow(row);
  },

  async create(payload: CreateTransactionPayload): Promise<TransactionItem> {
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
    const row = (await apiClient.post(BASE, body)) as {
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
  },

  async update(
    id: string,
    payload: UpdateTransactionPayload,
  ): Promise<TransactionItem> {
    const row = (await apiClient.patch(`${BASE}/${id}`, payload)) as {
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
  },

  async remove(id: string): Promise<DeleteTransactionResult> {
    return (await apiClient.delete(`${BASE}/${id}`)) as DeleteTransactionResult;
  },
};
