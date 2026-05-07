/** GET /api/v1/user/me — theo docs/apis.md */
export interface CurrentUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  preferredCurrency: string;
  isOnboardingCompleted: boolean;
}
