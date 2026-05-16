export interface FinancialAccountItem {
  id: string;
  name: string;
  accountType: string;
  connectionMode: string;
  currency: string;
  currentBalance: number;
  isActive: boolean;
  isDefault: boolean;
  providerName: string | null;
  maskedAccountNumber: string | null;
  syncStatus: string;
}

export interface CreateManualFinancialAccountPayload {
  name: string;
  accountType: string;
  currentBalance: number;
  currency?: string;
  isDefault: boolean;
}

export interface CreateLinkApiFinancialAccountPayload {
  bankName: string;
  bankCode?: string | null;
  accountNumber: string;
  accountHolderName?: string | null;
  isDefault: boolean;
}

export interface CreateCassoConnectionPayload {
  returnUrl?: string | null;
  isDefault?: boolean | null;
  autoSync?: boolean | null;
}

export interface CassoConnectionSession {
  sessionId: string;
  authorizationUrl: string;
  expiresAt: string;
}

export interface CassoSyncPayload {
  fromDate?: string | null;
  toDate?: string | null;
  page?: number | null;
  pageSize?: number | null;
  sort?: "ASC" | "DESC" | null;
  triggerProviderSync?: boolean | null;
}

export interface CassoSyncResult {
  receivedCount: number;
  createdCount: number;
  skippedCount: number;
  message: string;
}

export interface UpdateFinancialAccountPayload {
  name?: string | null;
  currentBalance?: number | null;
  isDefault?: boolean | null;
}
