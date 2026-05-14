import { useQuery } from "@tanstack/react-query";
import { limitsService } from "../services";

export function useLimits() {
  return useQuery({
    queryKey: ["limits", "list"],
    queryFn: limitsService.list,
  });
}
