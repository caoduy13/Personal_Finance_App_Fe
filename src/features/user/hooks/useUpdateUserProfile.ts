import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import type { UpdateUserProfilePayload } from "../types";
import { userService } from "../services";

export function useUpdateUserProfile() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (patch: UpdateUserProfilePayload) =>
      userService.updateProfile(patch),
    onSuccess: (profile) => {
      void qc.invalidateQueries({ queryKey: ["user"] });
      updateUser({
        fullName: profile.fullName,
        email: profile.email,
      });
    },
  });
}
