import type { Language } from "../types";

const MONTH_EN_TO_VI: Record<string, string> = {
  Jan: "Th1",
  Feb: "Th2",
  Mar: "Th3",
  Apr: "Th4",
  May: "Th5",
  Jun: "Th6",
  Jul: "Th7",
  Aug: "Th8",
  Sep: "Th9",
  Oct: "Th10",
  Nov: "Th11",
  Dec: "Th12",
};

/** "Nov 20" → "Th11 20" khi lang = vi */
export function formatMonthLabel(monthKey: string, lang: Language): string {
  if (lang === "en") return monthKey;
  const [mon, year] = monthKey.split(" ");
  const viMon = MONTH_EN_TO_VI[mon];
  return viMon ? `${viMon} ${year}` : monthKey;
}

/** "Nov" → "Th11" khi lang = vi */
export function formatCalendarMonthShort(mon: string, lang: Language): string {
  if (lang === "en") return mon;
  return MONTH_EN_TO_VI[mon] ?? mon;
}

export function formatMonthRangeOption(option: string, lang: Language): string {
  if (lang === "en") return option;
  const map: Record<string, string> = {
    "1-6 Months": "1-6 tháng",
    "3 Months": "3 tháng",
    "12 Months": "12 tháng",
    "Year to date": "Từ đầu năm",
  };
  return map[option] ?? option;
}
