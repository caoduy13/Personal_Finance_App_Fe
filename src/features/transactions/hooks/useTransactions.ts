import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services";
import type { CreateTransactionPayload } from "../types";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions", "list"],
    queryFn: transactionService.list,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
