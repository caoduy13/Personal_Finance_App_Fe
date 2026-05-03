import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import type { UserRole } from "@/shared/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, role, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  const onboardingDone =
    user?.isOnboardingCompleted === true ||
    user?.is_onboarding_completed === true;
  const isAdminUser = role === "admin" || (role as string) === "ADMIN";

  if (
    !isAdminUser &&
    !onboardingDone &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
