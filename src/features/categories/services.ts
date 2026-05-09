import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import { normalizeCategoriesResponse } from "./lib/normalizeCategoriesResponse";
import type { Category, UserCategoryOption } from "./types";

const categoriesRequestMode = (): RequestMode => "real";
const userOptionsStrategy = { list: "real" as RequestMode };

type MockCategoryRow = (typeof mockData.tables.categories)[number];

function mapMockRow(row: MockCategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? null,
    color: row.color ?? null,
    isDefault: Boolean(row.is_default),
    ownerUserId: row.owner_user_id,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

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

export const categoryService = {
  async list(): Promise<Category[]> {
    const realRequest = async () => {
      const raw = await apiClient.get(API_ENDPOINT.CATEGORIES.LIST);
      return normalizeCategoriesResponse(raw);
    };

    const mockRequest = async () => {
      await wait(100);
      return [...mockData.tables.categories]
        .map(mapMockRow)
        .sort(
          (a, b) =>
            a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
        );
    };

    return requestWithStrategy(
      categoriesRequestMode(),
      realRequest,
      mockRequest,
    );
  },
};

export const userCategoryService = {
  async listOptions(): Promise<UserCategoryOption[]> {
    const realRequest = async () => {
      const raw: unknown = await apiClient.get(API_ENDPOINT.CATEGORIES.LIST);
      if (raw != null && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        const d = o.defaultCategories ?? o.DefaultCategories;
        const c = o.customCategories ?? o.CustomCategories;
        if (Array.isArray(d) && Array.isArray(c)) {
          return mergeCategories(raw as CategoriesApiBody);
        }
      }
      const flat = normalizeCategoriesResponse(raw);
      return flat.map((cat) => ({
        id: cat.id,
        name: cat.name,
        kind: cat.isDefault ? ("default" as const) : ("custom" as const),
      }));
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

    return requestWithStrategy(
      userOptionsStrategy.list,
      realRequest,
      mockRequest,
    );
  },
};
