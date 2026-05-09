import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { authService } from "../services";
import { useAuthStore } from "../store";
import { ROUTES } from "@/shared/constants/routes";

function useAuthSuccessNavigation() {
  const navigate = useNavigate();

  return (response: AuthResponse) => {
    if (response.user.role === "admin") {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      return;
    }
    navigate(ROUTES.DASHBOARD, { replace: true });
  };
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
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const goAfterAuth = useAuthSuccessNavigation();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setAuth({
        accessToken: response.accessToken,
        role: response.user.role,
        user: response.user,
      });
      goAfterAuth(response);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const goAfterAuth = useAuthSuccessNavigation();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setAuth({
        accessToken: response.accessToken,
        role: response.user.role,
        user: response.user,
      });
      goAfterAuth(response);
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      void queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
