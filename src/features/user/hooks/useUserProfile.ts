import { useQuery } from "@tanstack/react-query";
import { userService } from "../services";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
  });
}
