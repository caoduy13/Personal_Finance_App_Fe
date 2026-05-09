import { apiClient } from "@/lib/axios";
import type {
  CategoriesList,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./type";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";

const CATEGORY_STRATEGY = {
  categories: "mock" as RequestMode,
  addCategory: "mock" as RequestMode,
  updateCategory: "mock" as RequestMode,
  deleteCategory: "mock" as RequestMode,
} as const;

export const adminCategoryService = {
  /** `undefined` = không gửi query (backend trả cả hai trạng thái). */
  getCategories: async (isActive?: boolean): Promise<CategoriesList> => {
    const realRequest = () =>
      apiClient.get<CategoriesList>(API_ENDPOINT.ADMIN.CATEGORIES, {
        params: isActive === undefined ? {} : { isActive },
      }) as unknown as Promise<CategoriesList>;

    const mockRequest = async () => {
      await wait(200);
      let rows = mockData.tables.categories
        .map((item) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          color: item.color,
          order: item.display_order,
          isActive: item.is_active,
        }))
        .sort((a, b) => a.order - b.order);
      if (isActive === true) rows = rows.filter((r) => r.isActive);
      if (isActive === false) rows = rows.filter((r) => !r.isActive);
      return { data: rows };
    };

    return requestWithStrategy(
      CATEGORY_STRATEGY.categories,
      realRequest,
      mockRequest,
    );
  },

  addCategory: async (category: CreateCategoryRequest): Promise<Category> => {
    const realRequest = () => {
      return apiClient.post<Category>(
        API_ENDPOINT.ADMIN.CATEGORIES,
        category,
      ) as unknown as Promise<Category>;
    };
    const mockRequest = async () => {
      await wait(200);
      return {
        ...category,
        id: crypto.randomUUID(),
        isActive: true,
      };
    };
    return requestWithStrategy(
      CATEGORY_STRATEGY.addCategory,
      realRequest,
      mockRequest,
    );
  },

  updateCategory: async (
    category: UpdateCategoryRequest,
  ): Promise<Category> => {
    const realRequest = () => {
      return apiClient.patch<Category>(
        `${API_ENDPOINT.ADMIN.CATEGORIES}/${category.id}`,
        category,
      ) as unknown as Promise<Category>;
    };
    const mockRequest = async () => {
      await wait(200);
      return { ...category, id: crypto.randomUUID(), isActive: true };
    };
    return requestWithStrategy(
      CATEGORY_STRATEGY.updateCategory,
      realRequest,
      mockRequest,
    );
  },

  deleteCategory: async (id: string): Promise<void> => {
    const realRequest = () => {
      return apiClient.delete<void>(
        `${API_ENDPOINT.ADMIN.CATEGORIES}/${id}`,
      ) as unknown as Promise<void>;
    };
    const mockRequest = async () => {
      await wait(200);
      return undefined;
    };
    return requestWithStrategy(
      CATEGORY_STRATEGY.deleteCategory,
      realRequest,
      mockRequest,
    );
  },
};
