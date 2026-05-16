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

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: () => transactionService.getById(id!),
    enabled: Boolean(id),
  });
}

function invalidateTransactionSideEffects(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["jars"] });
  queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "user"] });
  queryClient.invalidateQueries({ queryKey: ["budget", "limits"] });
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: () => {
      invalidateTransactionSideEffects(queryClient);
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
      invalidateTransactionSideEffects(queryClient);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.remove(id),
    onSuccess: () => {
      invalidateTransactionSideEffects(queryClient);
    },
  });
}
