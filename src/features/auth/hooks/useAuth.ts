import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { authService } from "../services";
import { useAuthStore } from "../store";
import { ROUTES } from "@/shared/constants/routes";
import type { UserRole } from "@/shared/types";
import { toast } from "sonner";

function apiRoleToAppRole(apiRole: string): UserRole {
  return apiRole.trim().toLowerCase() === "admin" ? "admin" : "user";
}

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    accessToken,
    role,
    user,
    isAuthenticated: Boolean(accessToken),
    isAdmin: role === "admin",
    setAuth,
    clearAuth,
  };
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? ROUTES.DASHBOARD;

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (response) => {
      const user = {
        id: response.id,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
      };
      const appRole = apiRoleToAppRole(response.role);
      setAuth({
        accessToken: response.accessToken,
        role: appRole,
        user,
      });
      navigate(appRole === "admin" ? ROUTES.ADMIN_DASHBOARD : from, {
        replace: true,
      });
    },
  });
}

export function useRegisterMutation() {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: () => {
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      navigate(ROUTES.LOGIN, { replace: true });
      toast.success("Đăng xuất thành công");
    },
  });
}
