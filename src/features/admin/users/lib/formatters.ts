const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const relativeFormatter = new Intl.RelativeTimeFormat("vi-VN", {
  numeric: "auto",
});

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
};

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dateTimeFormatter.format(d);
};

export const formatVND = (amount: number | null | undefined): string => {
  if (amount == null) return "—";
  return vndFormatter.format(amount);
};

export const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const diffMs = target - Date.now();
  const diffMin = Math.round(diffMs / 60000);

  if (Math.abs(diffMin) < 60) {
    return relativeFormatter.format(diffMin, "minute");
  }
  const diffHour = Math.round(diffMs / 3_600_000);
  if (Math.abs(diffHour) < 24) {
    return relativeFormatter.format(diffHour, "hour");
  }
  const diffDay = Math.round(diffMs / 86_400_000);
  if (Math.abs(diffDay) < 30) {
    return relativeFormatter.format(diffDay, "day");
  }
  const diffMonth = Math.round(diffMs / (86_400_000 * 30));
  if (Math.abs(diffMonth) < 12) {
    return relativeFormatter.format(diffMonth, "month");
  }
  const diffYear = Math.round(diffMs / (86_400_000 * 365));
  return relativeFormatter.format(diffYear, "year");
};

export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  const first = parts[0]!.charAt(0);
  const last = parts[parts.length - 1]!.charAt(0);
  return (first + last).toUpperCase();
};
