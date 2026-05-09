export interface FinancialAccountItem {
  id: string;
  name: string;
  accountType: string;
  connectionMode: string;
  currency: string;
  currentBalance: number;
  isActive: boolean;
  isDefault: boolean;
}
