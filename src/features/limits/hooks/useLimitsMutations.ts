import { useMutation, useQueryClient } from "@tanstack/react-query";
import { limitsService } from "../services";
import type { CreateLimitPayload, UpdateLimitPayload } from "../types";

export function useCreateLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLimitPayload) => limitsService.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["limits", "list"] });
    },
  });
}

export function useUpdateLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLimitPayload;
    }) => limitsService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["limits", "list"] });
    },
  });
}

export function useDeleteLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => limitsService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["limits", "list"] });
    },
  });
}
