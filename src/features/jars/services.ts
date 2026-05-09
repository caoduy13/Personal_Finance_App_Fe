import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type { JarItem } from "./types";

const JAR_STRATEGY = {
  list: "real" as RequestMode,
  create: "real" as RequestMode,
  update: "real" as RequestMode,
  archive: "real" as RequestMode,
} as const;

export interface JarListResponse {
  methodType: string;
  totalJarBalance: number;
  unallocatedBalance: number;
  data: Array<{
    id: string;
    name: string;
    balance: number;
    color?: string | null;
    icon?: string | null;
    status: string;
  }>;
}

function mapBeJarList(raw: unknown): JarItem[] {
  if (raw == null || typeof raw !== "object") return [];
  const o = raw as JarListResponse;
  const rows = Array.isArray(o.data) ? o.data : [];
  return rows.map((j) => ({
    id: j.id,
    name: j.name,
    percentage: null,
    balance: Number(j.balance ?? 0),
    color: j.color ?? null,
    status: String(j.status ?? "Active"),
  }));
}

export const jarService = {
  async list(): Promise<JarItem[]> {
    const realRequest = async () =>
      mapBeJarList(await apiClient.get<unknown>("/Jar"));

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

  async create(payload: {
    name: string;
    color: string;
    icon: string;
  }): Promise<void> {
    const real = async () => {
      await apiClient.post("/Jar", payload);
    };
    const mock = async () => {
      await wait(200);
    };
    return requestWithStrategy(JAR_STRATEGY.create, real, mock);
  },

  async update(
    id: string,
    patch: { name?: string; color?: string; icon?: string },
  ): Promise<void> {
    const real = async () => {
      await apiClient.patch(`/Jar/${id}`, patch);
    };
    const mock = async () => {
      await wait(200);
    };
    return requestWithStrategy(JAR_STRATEGY.update, real, mock);
  },

  async archive(id: string): Promise<void> {
    const real = async () => {
      await apiClient.delete(`/Jar/${id}`);
    };
    const mock = async () => {
      await wait(200);
    };
    return requestWithStrategy(JAR_STRATEGY.archive, real, mock);
  },
};
