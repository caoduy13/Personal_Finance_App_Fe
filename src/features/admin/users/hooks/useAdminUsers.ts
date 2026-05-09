import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "../services";
import type { AdminUsersListParams } from "../types";

export function useAdminUsers(params: AdminUsersListParams) {
  return useQuery({
    queryKey: ["admin", "users", "list", params],
    queryFn: () => adminUserService.list(params),
    placeholderData: (prev) => prev,
  });
}
