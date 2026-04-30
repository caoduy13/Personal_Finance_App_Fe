import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import type { JarItem } from "./types";

const JAR_STRATEGY = {
  list: "mock" as RequestMode,
} as const;

export const jarService = {
  async list(): Promise<JarItem[]> {
    const realRequest = () => apiClient.get<JarItem[]>("/jars") as unknown as Promise<JarItem[]>;

    const mockRequest = async () => {
      await wait(200);
      return mockData.tables.jars.map((jar) => ({
        id: jar.id,
        name: jar.name,
        percentage: jar.percentage,
        balance: jar.balance,
        color: jar.color,
        status: jar.status,
      }));
    };

    return requestWithStrategy(JAR_STRATEGY.list, realRequest, mockRequest);
  },
};
