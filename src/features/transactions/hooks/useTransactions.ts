import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services";
import type {
  CreateTransactionPayload,
  TransactionListParams,
  UpdateTransactionPayload,
} from "../types";

export function useTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: ["transactions", "list", params ?? {}],
    queryFn: () => transactionService.list(params),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["jars"] });
      queryClient.invalidateQueries({ queryKey: ["financialAccounts"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransactionPayload;
    }) => transactionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["jars"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["jars"] });
    },
  });
}
