import { createBrowserRouter } from "react-router-dom";
import { LoginPage, RegisterPage } from "@/features/auth";
import { TransactionsPage, AddTransactionPage } from "@/features/transactions";
import { JarsPage } from "@/features/jars";
import { BudgetPage } from "@/features/budget";
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminNotificationsPage,
  AdminAuditLogsPage,
} from "@/features/admin";
import { ROUTES } from "@/shared/constants/routes";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { UnauthorizedPage } from "@/shared/pages/UnauthorizedPage";
import { UserGoalsPage } from "@/shared/pages/UserGoalsPage";
import { UserNotificationsPage } from "@/shared/pages/UserNotificationsPage";
import { UserProfilePage } from "@/shared/pages/UserProfilePage";
import { UserLayout } from "@/shared/layout/UserLayout";
import { AdminLayout } from "@/shared/layout/AdminLayout";

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
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <TransactionsPage /> }],
  },
  {
    path: ROUTES.TRANSACTIONS,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <TransactionsPage /> }],
  },
  {
    path: ROUTES.TRANSACTIONS_ADD,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <AddTransactionPage /> }],
  },
  {
    path: ROUTES.JARS,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <JarsPage /> }],
  },
  {
    path: ROUTES.BUDGET,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <BudgetPage /> }],
  },
  {
    path: ROUTES.GOALS,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <UserGoalsPage /> }],
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <UserNotificationsPage /> }],
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <UserProfilePage /> }],
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
      { path: "notifications", element: <AdminNotificationsPage /> },
      { path: "audit-logs", element: <AdminAuditLogsPage /> },
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
