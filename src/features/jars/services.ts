import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  CreateJarPayload,
  DeleteJarResult,
  JarApiRow,
  JarItem,
  JarsOverviewApi,
  UpdateJarPayload,
} from "./types";

const JAR_STRATEGY = {
  overview: "real" as RequestMode,
  create: "real" as RequestMode,
  update: "real" as RequestMode,
  remove: "real" as RequestMode,
} as const;

function mapRowToItem(row: JarApiRow): JarItem {
  return {
    id: row.id,
    name: row.name,
    percentage: null,
    balance: Number(row.balance),
    color: row.color ?? "#888888",
    icon: row.icon ?? "wallet",
    status: row.status,
  };
}

export const jarService = {
  async getOverview(): Promise<JarsOverviewApi> {
    const realRequest = async () => {
      return (await apiClient.get(API_ENDPOINT.JAR)) as JarsOverviewApi;
    };

    const mockRequest = async (): Promise<JarsOverviewApi> => {
      await wait(200);
      const data: JarApiRow[] = mockData.tables.jars.map((jar) => ({
        id: jar.id,
        name: jar.name,
        balance: jar.balance,
        color: jar.color ?? "#888",
        icon: jar.icon ?? "wallet",
        status: jar.status,
      }));
      return {
        methodType: mockData.tables.jar_setups[0]?.method_type ?? "SixJars",
        totalJarBalance: data.reduce((s, j) => s + Number(j.balance), 0),
        unallocatedBalance: 0,
        data,
      };
    };

    return requestWithStrategy(JAR_STRATEGY.overview, realRequest, mockRequest);
  },

  /** Danh sách phẳng cho UI hiện tại. */
  async list(): Promise<JarItem[]> {
    const overview = await this.getOverview();
    return overview.data.map(mapRowToItem);
  },

  async create(payload: CreateJarPayload): Promise<JarItem> {
    const realRequest = async () => {
      const row = (await apiClient.post(API_ENDPOINT.JAR, payload)) as {
        id: string;
        name: string;
        balance: number;
        status: string;
        color?: string;
        icon?: string;
      };
      return {
        id: row.id,
        name: row.name,
        percentage: null,
        balance: Number(row.balance),
        status: row.status,
        color: row.color ?? payload.color,
        icon: row.icon ?? payload.icon,
      };
    };

    const mockRequest = async (): Promise<JarItem> => {
      await wait(200);
      return {
        id: crypto.randomUUID(),
        name: payload.name,
        percentage: null,
        balance: 0,
        color: payload.color,
        icon: payload.icon,
        status: "Active",
      };
    };

    return requestWithStrategy(JAR_STRATEGY.create, realRequest, mockRequest);
  },

  async update(id: string, payload: UpdateJarPayload): Promise<JarItem> {
    const realRequest = async () => {
      const row = (await apiClient.patch(
        `${API_ENDPOINT.JAR}/${id}`,
        payload,
      )) as {
        id: string;
        name: string;
        color: string;
        icon: string;
        status: string;
        balance?: number;
      };
      return {
        id: row.id,
        name: row.name,
        percentage: null,
        balance: Number(row.balance ?? 0),
        color: row.color,
        icon: row.icon,
        status: row.status,
      };
    };

    const mockRequest = async (): Promise<JarItem> => {
      await wait(200);
      return {
        id,
        name: payload.name ?? "Jar",
        percentage: null,
        balance: 0,
        color: payload.color ?? "#888",
        icon: payload.icon ?? "wallet",
        status: "Active",
      };
    };

    return requestWithStrategy(JAR_STRATEGY.update, realRequest, mockRequest);
  },

  async remove(id: string): Promise<DeleteJarResult> {
    const realRequest = async () => {
      return (await apiClient.delete(
        `${API_ENDPOINT.JAR}/${id}`,
      )) as DeleteJarResult;
    };

    const mockRequest = async (): Promise<DeleteJarResult> => {
      await wait(200);
      return { message: "Jar deleted" };
    };

    return requestWithStrategy(JAR_STRATEGY.remove, realRequest, mockRequest);
  },
};
