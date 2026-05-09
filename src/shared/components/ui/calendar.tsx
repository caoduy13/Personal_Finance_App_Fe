import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        root: "w-fit",
        months: "relative flex",
        month: "flex flex-col gap-2",
        month_caption:
          "relative mx-10 mb-1 flex h-8 items-center justify-center",
        caption_label: "text-sm font-medium text-slate-800",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 shrink-0 p-0 text-[#6366F1] shadow-none border-indigo-200/80 bg-white hover:bg-indigo-50",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 shrink-0 p-0 text-[#6366F1] shadow-none border-indigo-200/80 bg-white hover:bg-indigo-50",
        ),
        weekdays: "flex",
        weekday:
          "w-9 text-[0.65rem] font-medium uppercase tracking-wide text-slate-500",
        week: "mt-0.5 flex w-full",
        day: "size-9 p-0 text-center",
        day_button: cn(
          "size-9 rounded-lg p-0 text-sm font-normal text-slate-800 transition-colors",
          "hover:bg-indigo-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35",
        ),
        selected:
          "relative rounded-lg bg-[#6366F1] text-white hover:bg-[#4F46E5] hover:text-white [&_button]:text-white [&_button]:hover:text-white",
        today: "rounded-lg bg-indigo-50 text-[#4338ca] font-semibold",
        outside: "text-slate-300 opacity-55",
        disabled: "text-slate-300 opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chClass }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("size-4", chClass)} aria-hidden />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
