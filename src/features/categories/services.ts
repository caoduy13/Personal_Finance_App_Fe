import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type { UserCategoryOption } from "./types";

const STRATEGY = { list: "mock" as RequestMode };

interface CategoriesApiBody {
  defaultCategories?: { id: string; name: string }[];
  customCategories?: { id: string; name: string }[];
  DefaultCategories?: { id: string; name: string }[];
  CustomCategories?: { id: string; name: string }[];
}

function mergeCategories(body: CategoriesApiBody): UserCategoryOption[] {
  const def = body.defaultCategories ?? body.DefaultCategories ?? [];
  const cust = body.customCategories ?? body.CustomCategories ?? [];
  const out: UserCategoryOption[] = [
    ...def.map((c) => ({ id: c.id, name: c.name, kind: "default" as const })),
    ...cust.map((c) => ({ id: c.id, name: c.name, kind: "custom" as const })),
  ];
  return out.sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export const userCategoryService = {
  async listOptions(): Promise<UserCategoryOption[]> {
    const realRequest = async () => {
      const body = (await apiClient.get(
        API_ENDPOINT.CATEGORIES,
      )) as CategoriesApiBody;
      return mergeCategories(body);
    };

    const mockRequest = async (): Promise<UserCategoryOption[]> => {
      await wait(150);
      return mockData.tables.categories
        .filter((c) => c.is_active)
        .map((c) => ({
          id: c.id,
          name: c.name,
          kind: c.is_default ? ("default" as const) : ("custom" as const),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));
    };

    return requestWithStrategy(STRATEGY.list, realRequest, mockRequest);
  },
};
