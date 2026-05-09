/** Một hũ trong response GET /Jar (camelCase từ BE). */
export interface JarApiRow {
  id: string;
  name: string;
  balance: number;
  color: string;
  icon: string;
  status: string;
}

/** Body GET /Jar đầy đủ. */
export interface JarsOverviewApi {
  methodType: string;
  totalJarBalance: number;
  unallocatedBalance: number;
  data: JarApiRow[];
}

/** Model gọn cho UI (tương thích JarsPage). */
export interface JarItem {
  id: string;
  name: string;
  percentage: number | null;
  balance: number;
  color: string;
  icon: string;
  status: string;
}

export interface CreateJarPayload {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateJarPayload {
  name?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface DeleteJarResult {
  message: string;
}
