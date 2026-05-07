import { useQuery } from "@tanstack/react-query";
import { adminCategoryService } from "../services";

export const useAdminCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: adminCategoryService.getCategories,
  });
};
