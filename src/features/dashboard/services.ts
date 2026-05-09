import { apiClient } from "@/lib/axios";
import { dashboardMock } from "@/lib/dashboardMock";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type { DashboardResponse } from "./types";

const DASHBOARD_STRATEGY = {
  userSummary: "real" as RequestMode,
} as const;

export const dashboardService = {
  async getUserDashboard(): Promise<DashboardResponse> {
    return requestWithStrategy(
      DASHBOARD_STRATEGY.userSummary,
      async () =>
        apiClient.get<DashboardResponse>("/user/dashboard") as unknown as Promise<DashboardResponse>,
      async () => {
        await wait(300);
        return dashboardMock;
      },
    );
  },
};
