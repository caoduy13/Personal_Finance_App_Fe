import { apiClient } from "@/lib/axios";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";

export interface ImportReceiptPreviewTransaction {
  merchantName?: string | null;
  amount?: number | null;
  date?: string | null;
  type?: string | null;
  suggestedCategoryId?: string | null;
  suggestedCategoryName?: string | null;
  matchedBy?: string | null;
  note?: string | null;
}

export interface ImportReceiptPreviewItem {
  name?: string | null;
  amount?: number | null;
}

export interface ImportReceiptPreviewSummary {
  subtotal?: number | null;
  discount?: number | null;
  total?: number | null;
}

export interface ImportReceiptPreview {
  id?: string | null;
  status?: "success" | "uploaded" | string | null;
  imageUrl?: string | null;
  transaction?: ImportReceiptPreviewTransaction | null;
  items?: ImportReceiptPreviewItem[] | null;
  summary?: ImportReceiptPreviewSummary | null;
  warnings?: string[] | null;
}

export interface ImportReceiptExtraction {
  isSuccess?: boolean;
  totalAmount?: number | null;
  totalRawText?: string | null;
  transactionDate?: string | null;
  transactionDateRawText?: string | null;
  merchantName?: string | null;
  suggestedCategoryId?: string | null;
  suggestedCategoryName?: string | null;
  categoryMatchedBy?: string | null;
  warnings?: string[] | null;
}

export interface ImportImageResult {
  id?: string;
  financialAccountId?: string;
  status?: "Pending" | "AwaitingReview" | "Failed" | string;
  message?: string;
  fileName?: string;
  originalFileName?: string;
  contentType?: string | null;
  sizeInBytes?: number;
  receipt?: ImportReceiptExtraction | null;
  preview?: ImportReceiptPreview | null;
  ocrResult?: {
    isSuccess?: boolean;
    text?: string | null;
    layout?: string | null;
    engine?: string | null;
    errorMessage?: string | null;
  };
  rawOcrJson?: string | null;
}

export interface ImportDraftResult {
  id: string;
  rowIndex: number;
  transactionDate?: string | null;
  amount?: number | null;
  type?: "Income" | "Expense" | string | null;
  rawDescription?: string | null;
  editedNote?: string | null;
  isValid: boolean;
  validationError?: string | null;
  editedCategoryId?: string | null;
  editedCategoryName?: string | null;
  editedJarId?: string | null;
  editedJarName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateImportDraftPayload {
  transactionDate?: string;
  amount?: number;
  type?: "Income" | "Expense";
  editedNote?: string;
  editedCategoryId?: string | null;
  editedJarId?: string | null;
  isValid?: boolean;
  validationError?: string | null;
}

export interface ConfirmImportPayload {
  financialAccountId?: string;
  fromJarId?: string;
  draftIds?: string[];
}

export interface ConfirmedTransactionResult {
  id: string;
  draftId: string;
  financialAccountId?: string | null;
  fromJarId?: string | null;
  categoryId?: string | null;
  type: string;
  transactionsAmount: number;
  transactionDate: string;
}

export interface ConfirmImportResult {
  importJobId: string;
  status: string;
  createdCount: number;
  transactions: ConfirmedTransactionResult[];
  message?: string;
}

interface UploadReceiptOptions {
  financialAccountId?: string;
  bankCode?: string;
  layout?: "invoice" | "document" | "none" | string;
  runOcr?: boolean;
  includeDebug?: boolean;
}

function unwrapImportResult(raw: unknown): ImportImageResult {
  if (raw && typeof raw === "object" && "body" in raw) {
    return (raw as { body: ImportImageResult }).body;
  }
  return raw as ImportImageResult;
}

function normalizeDraft(raw: unknown): ImportDraftResult {
  const row = raw as Partial<ImportDraftResult>;
  return {
    id: String(row.id ?? ""),
    rowIndex: Number(row.rowIndex ?? 0),
    transactionDate: row.transactionDate ?? null,
    amount: row.amount == null ? null : Number(row.amount),
    type: row.type ?? null,
    rawDescription: row.rawDescription ?? null,
    editedNote: row.editedNote ?? null,
    isValid: Boolean(row.isValid),
    validationError: row.validationError ?? null,
    editedCategoryId: row.editedCategoryId ?? null,
    editedCategoryName: row.editedCategoryName ?? null,
    editedJarId: row.editedJarId ?? null,
    editedJarName: row.editedJarName ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const importService = {
  async uploadReceiptImage(
    file: File,
    options?: UploadReceiptOptions,
  ): Promise<ImportImageResult> {
    const fd = new FormData();
    fd.append("file", file);
    if (options?.financialAccountId) {
      fd.append("financialAccountId", options.financialAccountId);
    }
    fd.append("bankCode", options?.bankCode ?? "");
    fd.append("layout", options?.layout ?? "invoice");
    fd.append("runOcr", String(options?.runOcr ?? true));
    fd.append("includeDebug", String(options?.includeDebug ?? false));

    const raw = await apiClient.post(API_ENDPOINT.IMPORTS.IMAGE, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapImportResult(raw);
  },

  async updateFirstDraft(
    importJobId: string,
    payload: UpdateImportDraftPayload,
  ): Promise<ImportDraftResult> {
    const raw = await apiClient.patch(
      `${API_ENDPOINT.IMPORTS.BASE}/${importJobId}`,
      payload,
    );
    return normalizeDraft(raw);
  },

  async confirmImport(
    importJobId: string,
    payload: ConfirmImportPayload,
  ): Promise<ConfirmImportResult> {
    return (await apiClient.post(
      `${API_ENDPOINT.IMPORTS.BASE}/${importJobId}/confirm`,
      payload,
    )) as ConfirmImportResult;
  },
};
