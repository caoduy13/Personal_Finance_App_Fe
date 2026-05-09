import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  CreateGoalPayload,
  CreateGoalResult,
  GoalDetail,
  GoalListItem,
  UpdateGoalPayload,
  UpdateGoalResult,
} from "./types";

const GOAL_STRATEGY = {
  list: "mock" as RequestMode,
  detail: "mock" as RequestMode,
  create: "mock" as RequestMode,
  update: "mock" as RequestMode,
  remove: "mock" as RequestMode,
} as const;

function mapTableGoal(row: (typeof mockData.tables.goals)[number]): GoalListItem {
  const target = Number(row.target_amount);
  const saved = Number(row.saved_amount);
  const progress = target > 0 ? Math.round((saved / target) * 1000) / 10 : 0;
  return {
    id: row.id,
    title: row.title,
    targetAmount: target,
    savedAmount: saved,
    progressPercentage: progress,
    dueDate: row.due_date,
    status: row.status,
    suggestedMonthlyContribution: 0,
  };
}

export const goalService = {
  async list(): Promise<GoalListItem[]> {
    const realRequest = async () => {
      return (await apiClient.get(API_ENDPOINT.GOALS)) as GoalListItem[];
    };

    const mockRequest = async () => {
      await wait(200);
      return mockData.tables.goals.map(mapTableGoal);
    };

    return requestWithStrategy(GOAL_STRATEGY.list, realRequest, mockRequest);
  },

  async getById(id: string): Promise<GoalDetail> {
    const realRequest = async () => {
      return (await apiClient.get(`${API_ENDPOINT.GOALS}/${id}`)) as GoalDetail;
    };

    const mockRequest = async () => {
      await wait(200);
      const row = mockData.tables.goals.find((g) => g.id === id);
      if (!row) throw new Error("Goal not found");
      const base = mapTableGoal(row);
      return {
        ...base,
        daysRemaining: 30,
        linkedJarId: row.linked_jar_id ?? null,
      };
    };

    return requestWithStrategy(GOAL_STRATEGY.detail, realRequest, mockRequest);
  },

  async create(payload: CreateGoalPayload): Promise<CreateGoalResult> {
    const realRequest = async () => {
      return (await apiClient.post(API_ENDPOINT.GOALS, payload)) as CreateGoalResult;
    };

    const mockRequest = async () => {
      await wait(200);
      return {
        id: crypto.randomUUID(),
        title: payload.title,
        targetAmount: payload.targetAmount,
        savedAmount: 0,
        progressPercentage: 0,
        status: "Active",
        dueDate: payload.dueDate,
      };
    };

    return requestWithStrategy(GOAL_STRATEGY.create, realRequest, mockRequest);
  },

  async update(id: string, payload: UpdateGoalPayload): Promise<UpdateGoalResult> {
    const realRequest = async () => {
      return (await apiClient.patch(`${API_ENDPOINT.GOALS}/${id}`, payload)) as UpdateGoalResult;
    };

    const mockRequest = async () => {
      await wait(200);
      return {
        id,
        title: payload.title ?? "Goal",
        targetAmount: payload.targetAmount ?? 0,
        dueDate: payload.dueDate ?? new Date().toISOString(),
        status: "Active",
      };
    };

    return requestWithStrategy(GOAL_STRATEGY.update, realRequest, mockRequest);
  },

  async remove(id: string): Promise<{ message: string }> {
    const realRequest = async () => {
      return (await apiClient.delete(`${API_ENDPOINT.GOALS}/${id}`)) as { message: string };
    };

    const mockRequest = async () => {
      await wait(200);
      return { message: "Goal deleted" };
    };

    return requestWithStrategy(GOAL_STRATEGY.remove, realRequest, mockRequest);
  },
};
