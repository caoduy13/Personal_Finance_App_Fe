import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services";

export function useCategories() {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: () => categoryService.list(),
  });
}
