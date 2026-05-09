import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCategoryService } from "../services";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../type";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export const useAdminCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: adminCategoryService.getCategories,
  });
};

export const useAddCategoryMutation = () => {
  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: (payload) => adminCategoryService.addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");

      // đóng modal hoặc về lại trang chính
    },
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation<Category, Error, UpdateCategoryRequest>({
    mutationFn: (payload) => adminCategoryService.updateCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");

      // đóng modal hoặc về lại trang chính
    },
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation<void, Error, string>({
    mutationFn: (id) => adminCategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
  });
};
