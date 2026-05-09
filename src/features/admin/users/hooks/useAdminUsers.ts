import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { adminUserService } from "../services";
import type { AccountRole } from "../types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminUserService.list,
  });
}

export function useChangeUserRoleMutation() {
  return useMutation<string, Error, { accountId: string; role: AccountRole }>({
    mutationFn: ({ accountId, role }) =>
      adminUserService.changeRole(accountId, role),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(message);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to change role");
    },
  });
}
