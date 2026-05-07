import { apiClient } from "@/lib/axios";
import type { CategoriesList } from "./type";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";

const CATEGORY_STRATEGY = {
  categories: "mock" as RequestMode,
} as const;

export const adminCategoryService = {
  getCategories: async (): Promise<CategoriesList> => {
    const realRequest = () =>
      apiClient.get<CategoriesList>(
        API_ENDPOINT.ADMIN.CATEGORIES,
      ) as unknown as Promise<CategoriesList>;

    const mockRequest = async () => {
      await wait(200);
      return {
        data: mockData.tables.categories
          .map((item) => ({
            id: item.id,
            name: item.name,
            icon: item.icon,
            color: item.color,
            order: item.display_order,
            isActive: item.is_active,
          }))
          .sort((a, b) => a.order - b.order),
      };
    };

    return requestWithStrategy(
      CATEGORY_STRATEGY.categories,
      realRequest,
      mockRequest,
    );
  },
};
