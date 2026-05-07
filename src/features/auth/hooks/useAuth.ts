import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { authService } from "../services";
import { useAuthStore } from "../store";
import { ROUTES } from "@/shared/constants/routes";

function useAuthSuccessNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? ROUTES.DASHBOARD;

  return (response: AuthResponse) => {
    navigate(
      response.user.role === "admin" ? ROUTES.ADMIN_DASHBOARD : from,
      {
        replace: true,
      },
    );
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
  const { setAuth } = useAuthStore();
  const goAfterAuth = useAuthSuccessNavigation();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (response) => {
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
  const { setAuth } = useAuthStore();
  const goAfterAuth = useAuthSuccessNavigation();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (response) => {
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
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
