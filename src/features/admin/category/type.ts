export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface CategoriesList {
  data: Category[];
}
