import { mockData } from "@/lib/mockData";
import { apiClient } from "@/lib/axios";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type { FinancialAccountItem } from "./types";

const STRATEGY = { list: "mock" as RequestMode };

function mapApiRow(row: {
  id: string;
  name: string;
  accountType: string;
  connectionMode: string;
  currency: string;
  currentBalance: number;
  isActive: boolean;
  isDefault: boolean;
}): FinancialAccountItem {
  return {
    id: row.id,
    name: row.name,
    accountType: row.accountType,
    connectionMode: row.connectionMode,
    currency: row.currency,
    currentBalance: Number(row.currentBalance),
    isActive: row.isActive,
    isDefault: row.isDefault,
  };
}

export const financialAccountService = {
  async list(): Promise<FinancialAccountItem[]> {
    const realRequest = async () => {
      const body = (await apiClient.get(API_ENDPOINT.FINANCIAL_ACCOUNT)) as {
        data: Array<{
          id: string;
          name: string;
          accountType: string;
          connectionMode: string;
          currency: string;
          currentBalance: number;
          isActive: boolean;
          isDefault: boolean;
        }>;
      };
      return (body.data ?? []).map(mapApiRow).filter((a) => a.isActive);
    };

    const mockRequest = async (): Promise<FinancialAccountItem[]> => {
      await wait(150);
      return mockData.tables.financial_accounts
        .filter((r) => r.is_active)
        .map((r) => ({
          id: r.id,
          name: r.name,
          accountType: r.account_type,
          connectionMode: r.connection_mode,
          currency: r.currency,
          currentBalance: r.current_balance,
          isActive: r.is_active,
          isDefault: r.is_default,
        }));
    };

    return requestWithStrategy(STRATEGY.list, realRequest, mockRequest);
  },
};
