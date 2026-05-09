import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getUserDashboard(),
    staleTime: 30_000,
  });
}
