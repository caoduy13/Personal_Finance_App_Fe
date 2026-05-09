import { createBrowserRouter } from "react-router-dom";
import { LoginPage, RegisterPage } from "@/features/auth";
import { OnboardingPage } from "@/features/onboarding";
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminBroadcastsPage,
  AdminAuditLogsPage,
} from "@/features/admin";
import { UserDashboardPage } from "@/features/dashboard";
import { TransactionsPage, AddTransactionPage } from "@/features/transactions";
import { JarsPage } from "@/features/jars";
import { BudgetPage } from "@/features/budget";
import { ROUTES } from "@/shared/constants/routes";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { UnauthorizedPage } from "@/shared/pages/UnauthorizedPage";
import { UserGoalsPage } from "@/shared/pages/UserGoalsPage";
import { UserNotificationsPage } from "@/shared/pages/UserNotificationsPage";
import { UserProfilePage } from "@/features/profile";
import { UserLayout } from "@/shared/layout/UserLayout";
import { AdminLayout } from "@/shared/layout/AdminLayout";
import AdminCategoriesPage from "@/features/admin/category/pages/AdminCategoriesPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <UserDashboardPage /> },
      { path: ROUTES.TRANSACTIONS, element: <TransactionsPage /> },
      { path: ROUTES.TRANSACTIONS_ADD, element: <AddTransactionPage /> },
      { path: ROUTES.JARS, element: <JarsPage /> },
      { path: ROUTES.BUDGET, element: <BudgetPage /> },
      { path: ROUTES.GOALS, element: <UserGoalsPage /> },
      { path: ROUTES.NOTIFICATIONS, element: <UserNotificationsPage /> },
      { path: ROUTES.PROFILE, element: <UserProfilePage /> },
    ],
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "users/:id", element: <AdminUserDetailPage /> },
      { path: "notifications", element: <AdminBroadcastsPage /> },
      { path: "audit-logs", element: <AdminAuditLogsPage /> },
      { path: "categories", element: <AdminCategoriesPage /> },
    ],
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: ROUTES.ROOT,
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
