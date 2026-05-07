/** GET `/User/me` (deployed Swagger) — camelCase trong response. */
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
