export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  ownerUserId: string | null;
  displayOrder: number;
  isActive: boolean;
}
