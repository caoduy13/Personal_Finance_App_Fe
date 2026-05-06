import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "../services";

export function useAdminUserDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "users", "detail", id],
    queryFn: () => {
      if (!id) throw new Error("MISSING_USER_ID");
      return adminUserService.getById(id);
    },
    enabled: Boolean(id),
  });
}
