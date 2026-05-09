export interface UserProfile {
  id: string;
  email: string;
  userName?: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  preferredCurrency: string;
  isOnboardingCompleted: boolean;
}

export interface UpdateUserProfilePayload {
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

/** Tuỳ BE trả shape; chỉ đọc field FE cần. */
export interface UserSetupPreview {
  isOnboardingCompleted?: boolean;
  monthlyIncome?: number | null;
  budgetMethodPreference?: string | null;
  financialAccountCount?: number;
  jarCount?: number;
  [key: string]: unknown;
}
