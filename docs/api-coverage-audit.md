# Audit phủ API BE vs FE

Tài liệu này phục vụ họp team và chia việc. **Không** thay đổi cấu hình BE.  
Cơ sở: mã nguồn FE trên `main` (đọc `src/shared/constants/apiEndpoint.ts`, `src/lib/env.ts`, và mọi `**/services.ts`).  
Lưu ý: file `docs/API V2.md` **không tồn tại** trên remote `Personal_Finance_App_Fe` (404); danh sách endpoint dưới đây suy ra từ FE + convention `/api/v1` qua `VITE_API_URL`.

Prefix: mọi path dưới đây là **suffix** sau `VITE_API_URL` (mặc định dev `http://localhost:3000/api/v1`), trừ các path admin/health ghi rõ có dấu `/` đầu.

---

## API BE đã gắn service/hook trên FE

| Phương thức & path (suffix) | Service | Hook / caller chính | Page / UI |
|----------------------------|---------|----------------------|-----------|
| POST `auth/login` | `authService.login` | `useAuth` / `useLoginMutation` | `LoginPage` |
| POST `auth/register` | `authService.register` | `useRegisterMutation` | `RegisterPage` |
| POST `auth/logout` | `authService.logout` | `useLogoutMutation` | layout / profile |
| GET `user/me` | `profileService.getMe` | `useAuth` (hydrate), queries profile | `UserProfilePage`, guard |
| PATCH `user/me` | `profileService.updateMe` | `useUpdateProfile` | `UserProfilePage` |
| POST `onboarding` | `onboardingService.complete` | `useOnboardingForm` | `OnboardingPage` |
| GET `categories` | `userCategoryService.getGrouped` | `useUserCategoriesGrouped`, `useUserCategories` | `CategoriesPage`, form giao dịch, … |
| POST `categories` | `userCategoryService.create` | `useCreateUserCategory` | `CategoriesPage` |
| PATCH `categories/:id` | `userCategoryService.update` | `useUpdateUserCategory` | `CategoriesPage` |
| DELETE `categories/:id` | `userCategoryService.remove` | `useDeleteUserCategory` | `CategoriesPage` |
| GET `limits` | `budgetService.list` | `useBudgetLimits` | `BudgetPage` |
| POST `limits` | `budgetService.create` | `useCreateBudgetLimit` | `BudgetPage` |
| PATCH `limits/:id` | `budgetService.update` | `useUpdateBudgetLimit` | `BudgetPage` |
| DELETE `limits/:id` | `budgetService.remove` | `useDeleteBudgetLimit` | `BudgetPage` |
| GET `reminders` | `reminderService.list` | `useReminders` | `RemindersPage` |
| POST `reminders` | `reminderService.create` | `useReminderMutations` | `RemindersPage` |
| PATCH `reminders/:id` | `reminderService.update` | `useReminderMutations` | `RemindersPage` |
| DELETE `reminders/:id` | `reminderService.cancel` | `useReminderMutations` | `RemindersPage` |
| GET `notifications` | `notificationService.list` | `useNotifications`, `useNotificationUnreadCount` | `UserNotificationsPage`, `UserLayout` |
| PATCH `notifications/status` | `notificationService.updateStatus` | `useUpdateNotificationStatus` | notifications UI |
| POST `ai/chat` | `aiChatService.send` | hooks / FAB | `AiChatFab`, `AiChatPage` |
| POST `imports/image` | `importService.uploadReceiptImage` | mutation trong OCR | `OcrImportPage` |
| GET `financial-accounts` | `financialAccountService.list` | `useFinancialAccounts` | `AccountsPage` |
| POST `financial-accounts/Manual` | create manual | mutations | `AccountsPage` |
| POST `financial-accounts/LinkApi` | link API | mutations | `AccountsPage` |
| PATCH `financial-accounts/:id` | update | mutations | `AccountsPage` |
| DELETE `financial-accounts/:id` | remove | mutations | `AccountsPage` |
| GET `jars` | `jarService.getOverview` / `list` | `useJars` | `JarsPage`, nhiều form |
| POST `jars` | `jarService.create` | mutation | `JarsPage` |
| PATCH `jars/:id` | `jarService.update` | mutation | `JarsPage` |
| DELETE `jars/:id` | `jarService.remove` | mutation | `JarsPage` |
| GET `transactions` | `transactionService.list` | `useTransactions` | `TransactionsPage` |
| POST `transactions` | `transactionService.create` | `useCreateTransaction` | `AddTransactionPage` |
| PATCH `transactions/:id` | `transactionService.update` | `useUpdateTransaction` | (hook export; UI chỉnh sửa có thể chưa gắn) |
| DELETE `transactions/:id` | `transactionService.remove` | `useDeleteTransaction` | tuỳ UI |
| GET `goals` | `goalService.list` | `useGoals` | `UserGoalsPage` |
| GET `goals/:id` | `goalService.getById` | query | goals |
| POST `goals` | `goalService.create` | mutation | `UserGoalsPage` |
| PATCH `goals/:id` | `goalService.update` | mutation | `UserGoalsPage` |
| DELETE `goals/:id` | `goalService.remove` | mutation | `UserGoalsPage` |
| GET `dashboard` | `dashboardService.getUserDashboard` | `useUserDashboard` | `DashboardPage` |
| GET `/admin/dashboard` | `adminDashboardService.getSummary` | hook admin dashboard | `AdminDashboardPage` |
| GET `/admin/users` | `adminUserService.getUsers` | `useAdminUsers` | `AdminUsersPage` |
| GET `/admin/users/:id` | `adminUserService.getUserById` | optional detail | admin |
| PATCH `/admin/users/:id/status` | `adminUserService.updateUserStatus` | mutations | `AdminUsersPage` |
| PATCH `/change-role/:accountId` | `adminUserService.changeRole` | mutation đổi role | admin users |
| GET `/admin/categories` | `adminCategoryService.getCategories` | hooks | `AdminCategoriesPage` |
| POST `/admin/categories` | `adminCategoryService.addCategory` | mutations | `AdminCategoriesPage` |
| PATCH `/admin/categories/:id` | `adminCategoryService.updateCategory` | mutations | `AdminCategoriesPage` |
| DELETE `/admin/categories/:id` | `adminCategoryService.deleteCategory` | mutations | `AdminCategoriesPage` |
| GET `/admin/broadcasts` | `adminBroadcastService.list` | hooks | `AdminBroadcastsPage` |
| POST `/admin/broadcasts` | `adminBroadcastService.create` | mutations | `AdminBroadcastsPage` |
| GET `/admin/audit-logs` | `adminAuditLogService.list` | hooks | `AdminAuditLogsPage` |
| GET `/admin/ai-settings` | `adminAiSettingsService.get` | hooks | `AdminAiSettingsPage` |
| PATCH `/admin/ai-settings` | `adminAiSettingsService.patch` | mutations | `AdminAiSettingsPage` |

---

## API / hằng số BE (hoặc nghi ngờ có trên BE) chưa có service FE tương ứng

| Path / capability | Ghi chú từ FE | Đề xuất UI hoặc hạng mục |
|---------------------|---------------|---------------------------|
| `user/me/setup` | Có trong `API_ENDPOINT.USER.SETUP` nhưng **không** thấy `apiClient` gọi | Nếu BE dùng cho wizard cài đặt nhanh: gọi sau login hoặc gộp vào onboarding |
| `GET /health/ping`, `GET /health/db/render`, `GET /health/db/local` | Khai báo trong `API_ENDPOINT.HEALTH` nhưng không dùng | Trang status dev-only hoặc CI smoke test |
| `GET/POST …/transactions/.../Casso` (đồng bộ ngân hàng) | UI chỉ `toast` “Sync Casso” tại `AccountsPage`, **không** gọi API | Nối service + nút loading/error khi BE sẵn sàng |
| Webhook / callback Casso | Không có FE | Thuần BE / DevOps |
| Bất kỳ endpoint chỉ có trên Swagger BE** | Không có trong repo FE | Đối chiếu Swagger BE lần 2 khi có `API V2.md` |

\* Đường dẫn Casso cụ thể cần xác nhận từ Swagger BE.  
\** Khuyến nghị: thêm `docs/API V2.md` hoặc export OpenAPI vào repo để giữ bảng này khớp 100%.

---

## UI mock / chiến lược `requestWithStrategy` — cần chuyển real khi BE ổn định

| Khu vực | Strategy hiện tại | Ghi chú | Đề xuất |
|---------|-------------------|---------|---------|
| `adminDashboardService.getSummary` | `mock` (`DASHBOARD_STRATEGY.adminSummary`) | Toàn bộ số liệu admin dashboard từ `mockData` | Đổi `mock` → `real`, chỉnh mapping theo response BE |
| `authService` login/register/logout | `real` nhưng có nhánh mock | Auth đang ưu tiên API thật | Giữ; chỉ tắt mock khi không cần dev offline |
| `adminUserService.changeRole` | `real` + mock fallback | Đổi role đã gọi API | Giữ real; mock cho storybook nếu cần |

Các màn **broadcasts**, **audit logs**, **admin categories**, **goals**, **notifications**, … đang gọi `apiClient` trực tiếp (không `requestWithStrategy` trong file đã đọc) — coi là **real**; nếu môi trường lỗi 404 thì xử lý ở ticket riêng (CORS / proxy / route BE).

---

## Ghi chú triển khai

1. **Vite**: `vite.config.ts` hiện **không** proxy `/api`; mọi gọi đi thẳng `VITE_API_URL`. Nếu dev cần tránh CORS, cân nhắc `server.proxy` (ticket infra, ngoài phạm vi audit này).  
2. **Nhánh remote `fix`**: tồn tại branch tên `fix` nên không thể push nhánh con `fix/...` (Git ref conflict). Dùng tên dạng `fix-ten-ticket` cho PR fix.  
3. Cập nhật tài liệu: mỗi khi thêm `services.ts` mới, bổ sung một dòng vào bảng phần một hoặc hai.

---

*Tạo bởi quy trình audit FE-only; không chỉnh sửa BE.*
