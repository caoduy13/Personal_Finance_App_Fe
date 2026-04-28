export interface AdminUserItem {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: "Active" | "Banned";
  roleCode: string;
}
