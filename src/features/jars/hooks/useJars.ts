import { useQuery } from "@tanstack/react-query";
import { jarService } from "../services";

export function useJars() {
  return useQuery({
    queryKey: ["jars", "list"],
    queryFn: jarService.list,
  });
}
