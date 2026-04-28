import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "../services";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminUserService.list,
  });
}
