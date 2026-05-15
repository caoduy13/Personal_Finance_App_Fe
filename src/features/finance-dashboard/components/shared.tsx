import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";

export function LegendDot({
  color,
  outline,
}: {
  color: string;
  outline?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        outline ? "border-2 bg-transparent" : color,
      )}
      style={outline ? { borderColor: color } : undefined}
    />
  );
}

export function DropdownPill({
  value,
  onValueChange,
  options,
  getLabel,
  className,
}: {
  value: string;
  onValueChange?: (v: string) => void;
  options: readonly string[];
  getLabel?: (value: string) => string;
  className?: string;
}) {
  const label = (opt: string) => getLabel?.(opt) ?? opt;
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-9 w-auto gap-1 rounded-full border-neutral-200 bg-white px-4 text-sm font-medium shadow-none dark:border-neutral-700 dark:bg-neutral-900",
          className,
        )}
      >
        <SelectValue>{label(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {label(opt)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SectionCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 text-left dark:border-neutral-800 dark:bg-neutral-900",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function ViewReportButton({ label = "View Report" }: { label?: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium dark:border-neutral-700 dark:bg-neutral-900"
    >
      {label}
      <ChevronDown className="h-4 w-4 opacity-60" />
    </button>
  );
}
