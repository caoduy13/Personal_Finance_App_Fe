import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Chuỗi `yyyy-MM-ddTHH:mm` (local) cho submit form. */
function toDatetimeLocalValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function fromDatetimeLocalValue(s: string): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function clampPastTime(d: Date, disablePastTime: boolean) {
  if (!disablePastTime || d.getTime() >= Date.now()) return d;
  const n = new Date();
  n.setSeconds(0, 0);
  return n;
}

export type ScheduleDateTimePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Mặc định true (lịch broadcast). Đặt false khi cần ngày quá khứ (audit, giao dịch…). */
  disablePast?: boolean;
  /** Đặt true để không cho chọn ngày sau hôm nay. */
  disableFuture?: boolean;
  /** Khi `disablePast` bật, khóa cả giờ/phút đã qua nếu ngày đang chọn là hôm nay. */
  disablePastTime?: boolean;
  /** Hiện nút «Xóa» để để trống. Mặc định true; đặt false khi bắt buộc có ngày giờ. */
  allowClear?: boolean;
};

function TimeColumn({
  label,
  values,
  selected,
  onSelect,
  formatLabel,
  isDisabled,
}: {
  label: string;
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  formatLabel: (v: number) => string;
  isDisabled?: (v: number) => boolean;
}) {
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="flex flex-col gap-1">
      <p className="px-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="scrollbar-none flex max-h-[13.5rem] w-11 flex-col gap-0.5 overflow-y-auto rounded-lg border border-indigo-100/90 bg-slate-50/90 py-1 pr-0.5">
        {values.map((v) => {
          const disabled = isDisabled?.(v) ?? false;
          return (
            <button
              key={v}
              ref={selected === v ? selectedRef : undefined}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(v)}
              className={cn(
                "mx-0.5 min-h-8 shrink-0 rounded-md px-1 py-1 text-center text-xs tabular-nums transition-colors",
                selected === v
                  ? "bg-[#6366F1] font-medium text-white shadow-sm"
                  : "text-slate-700 hover:bg-indigo-100/70",
                disabled &&
                  "cursor-not-allowed text-slate-300 hover:bg-transparent",
              )}
            >
              {formatLabel(v)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ScheduleDateTimePicker({
  id,
  value,
  onChange,
  className,
  disablePast = true,
  disableFuture = false,
  disablePastTime = false,
  allowClear = true,
}: ScheduleDateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsed = React.useMemo(() => fromDatetimeLocalValue(value), [value]);

  const selectedDate = parsed ? new Date(parsed) : undefined;
  const now = new Date();
  const hour = parsed?.getHours() ?? now.getHours();
  const minute = parsed?.getMinutes() ?? now.getMinutes();
  const minuteRounded = Math.min(55, Math.round(minute / 5) * 5);
  const effectiveMinute = MINUTES.includes(minuteRounded)
    ? minuteRounded
    : MINUTES.reduce((a, b) =>
        Math.abs(b - minute) < Math.abs(a - minute) ? b : a,
      );

  function applyDateTime(next: { date?: Date; h?: number; m?: number }) {
    const base = next.date ?? selectedDate ?? new Date();
    const h = next.h ?? hour;
    const m = next.m ?? effectiveMinute;
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    onChange(toDatetimeLocalValue(clampPastTime(d, disablePastTime)));
  }

  const isSelectedToday = Boolean(
    selectedDate && selectedDate.toDateString() === now.toDateString(),
  );

  const displayLabel = parsed
    ? format(parsed, "dd/MM/yyyy HH:mm", { locale: vi })
    : "Chọn ngày giờ…";

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full max-w-md justify-start gap-2 border-input font-normal shadow-sm",
            !parsed && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-[#6366F1]" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-1.5rem)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-indigo-100/90">
          <div className="p-2">
            <Calendar
              key={value || "empty"}
              mode="single"
              defaultMonth={parsed ?? new Date()}
              selected={selectedDate}
              onSelect={(d) => {
                if (!d) return;
                applyDateTime({ date: d });
              }}
              {...(disablePast
                ? {
                    disabled: {
                      before: (() => {
                        const t = new Date();
                        t.setHours(0, 0, 0, 0);
                        return t;
                      })(),
                    },
                  }
                : {})}
              {...(disableFuture
                ? {
                    disabled: {
                      ...(disablePast
                        ? {
                            before: (() => {
                              const t = new Date();
                              t.setHours(0, 0, 0, 0);
                              return t;
                            })(),
                          }
                        : {}),
                      after: (() => {
                        const t = new Date();
                        t.setHours(23, 59, 59, 999);
                        return t;
                      })(),
                    },
                  }
                : {})}
              initialFocus
            />
            <div
              className={cn(
                "mt-1 flex items-center gap-2 border-t border-indigo-100/80 px-1 pt-2",
                allowClear ? "justify-between" : "justify-end",
              )}
            >
              {allowClear ? (
                <button
                  type="button"
                  className="text-xs font-medium text-[#6366F1] hover:underline"
                  onClick={() => onChange("")}
                >
                  Xóa
                </button>
              ) : null}
              <button
                type="button"
                className="text-xs font-medium text-[#6366F1] hover:underline"
                onClick={() => {
                  const n = new Date();
                  const m = Math.min(55, Math.round(n.getMinutes() / 5) * 5);
                  applyDateTime({ date: n, h: n.getHours(), m });
                }}
              >
                Hôm nay
              </button>
            </div>
          </div>
          <div className="flex gap-2 border-t border-indigo-100/90 p-3 sm:border-t-0 sm:pt-4">
            <TimeColumn
              label="Giờ"
              values={HOURS}
              selected={hour}
              onSelect={(h) => applyDateTime({ h })}
              formatLabel={(v) => pad2(v)}
              isDisabled={(v) =>
                disablePastTime && isSelectedToday && v < now.getHours()
              }
            />
            <TimeColumn
              label="Phút"
              values={MINUTES}
              selected={effectiveMinute}
              onSelect={(m) => applyDateTime({ m })}
              formatLabel={(v) => pad2(v)}
              isDisabled={(v) =>
                disablePastTime &&
                isSelectedToday &&
                hour === now.getHours() &&
                v < now.getMinutes()
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
