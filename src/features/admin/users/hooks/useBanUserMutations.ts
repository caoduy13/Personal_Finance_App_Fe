import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUserService } from "../services";

const buildErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message === "CANNOT_BAN_ADMIN") {
      return "Không thể khóa tài khoản admin.";
    }
    if (error.message === "USER_NOT_FOUND") {
      return "Không tìm thấy người dùng.";
    }
  }
  return "Có lỗi xảy ra, vui lòng thử lại.";
};

export function useBanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminUserService.updateUserStatus(id, {
        status: "Banned",
        statusReason: reason,
      }),
    onSuccess: (data) => {
      toast.success("Đã khóa tài khoản người dùng.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.setQueryData(["admin", "users", "detail", data.id], data);
    },
    onError: (error) => {
      toast.error(buildErrorMessage(error));
    },
  });
}

export function useUnbanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminUserService.updateUserStatus(id, {
        status: "Active",
        statusReason: null,
      }),
    onSuccess: (data) => {
      toast.success("Đã mở khóa tài khoản người dùng.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.setQueryData(["admin", "users", "detail", data.id], data);
    },
    onError: (error) => {
      toast.error(buildErrorMessage(error));
    },
  });
}
