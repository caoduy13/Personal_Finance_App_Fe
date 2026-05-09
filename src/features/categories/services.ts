import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import { normalizeCategoriesResponse } from "./lib/normalizeCategoriesResponse";
import type { Category } from "./types";

const categoriesRequestMode = (): RequestMode => "real";

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
          (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
        );
    };

    return requestWithStrategy(
      categoriesRequestMode(),
      realRequest,
      mockRequest,
    );
  },
};
