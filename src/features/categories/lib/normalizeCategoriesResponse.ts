import type { Category } from "../types";

type Raw = Record<string, unknown>;

function pickString(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

function mapOne(raw: Raw): Category | null {
  const id = pickString(raw.id ?? raw.Id).trim();
  if (!id) return null;
  const name = pickString(raw.name ?? raw.Name).trim();
  return {
    id,
    name,
    icon:
      raw.icon != null || raw.Icon != null
        ? pickString(raw.icon ?? raw.Icon)
        : null,
    color:
      raw.color != null || raw.Color != null
        ? pickString(raw.color ?? raw.Color)
        : null,
    isDefault: Boolean(raw.isDefault ?? raw.is_default ?? false),
    ownerUserId: (raw.ownerUserId ?? raw.owner_user_id ?? null) as
      | string
      | null,
    displayOrder: Number(raw.displayOrder ?? raw.display_order ?? 0) || 0,
    isActive:
      raw.isActive !== undefined
        ? Boolean(raw.isActive)
        : raw.is_active !== undefined
          ? Boolean(raw.is_active)
          : true,
  };
}

function flattenCategoryPayload(raw: unknown): Raw[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw as Raw[];
  if (typeof raw !== "object") return [];
  const o = raw as Raw;

  const d = o.defaultCategories;
  const c = o.customCategories;
  if (Array.isArray(d) && Array.isArray(c)) return [...d, ...c] as Raw[];

  if (Array.isArray(o.items)) return o.items as Raw[];
  if (Array.isArray(o.categories)) return o.categories as Raw[];

  const data = o.data;
  if (Array.isArray(data)) return data as Raw[];
  if (data != null && typeof data === "object") {
    const inner = data as Raw;
    const idDef = inner.defaultCategories;
    const idCust = inner.customCategories;
    if (Array.isArray(idDef) && Array.isArray(idCust))
      return [...idDef, ...idCust] as Raw[];
  }

  return [];
}

export function normalizeCategoriesResponse(raw: unknown): Category[] {
  return flattenCategoryPayload(raw)
    .map((row) => mapOne(row))
    .filter((x): x is Category => x != null)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}
