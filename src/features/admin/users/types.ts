/** Matches backend `AccountRole`: User = 1, Admin = 2 */
export enum AccountRole {
  User = 1,
  Admin = 2,
}

export interface AdminUserItem {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: "Active" | "Banned";
  roleCode: string;
}
