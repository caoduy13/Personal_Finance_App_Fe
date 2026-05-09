export interface TransactionItem {
  id: string;
  type: "Income" | "Expense";
  amount: number;
  note: string;
  transactionDate: string;
}

export interface CreateTransactionPayload {
  type: "Income" | "Expense";
  amount: number;
  note: string;
  financialAccountId?: string | null;
  fromJarId?: string | null;
  toJarId?: string | null;
  categoryId?: string | null;
  date?: string;
}
