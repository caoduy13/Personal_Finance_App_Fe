import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { profileService } from "../services";

export const currentUserQueryKey = ["user", "me"] as const;

/** BE `UserController` chỉ policy `User` — admin gọi `/User/me` sẽ 403; không fetch khi role admin. */
export function useCurrentUser() {
  const { role } = useAuth();
  const enabled = role === "user";

  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => profileService.getMe(),
    enabled,
  });
}
