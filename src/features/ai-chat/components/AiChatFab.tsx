import { forwardRef, useState } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  Minus,
  Pencil,
  Phone,
  Plus,
  Smile,
  ThumbsUp,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const messenger = {
  header: "#A000F0",
  bg: "#242526",
  bubble: "#3E4042",
  textMuted: "#B0B3B8",
} as const;

const HeaderIconButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { label: string }
>(function HeaderIconButton({ children, label, className, type, ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/95 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export function AiChatFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#18191A] text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition hover:bg-[#2d2f32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A000F0] focus-visible:ring-offset-2",
          "bottom-24 right-4 md:bottom-6 md:right-6",
        )}
        aria-label="Mở trò chuyện AI"
      >
        <Pencil className="h-6 w-6" strokeWidth={2} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showClose={false}
          className={cn(
            "flex max-h-[min(560px,85vh)] w-[min(100vw-1.5rem,380px)] max-w-[min(100vw-1.5rem,380px)] flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 shadow-2xl",
            "bg-[#242526] text-white",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          <DialogDescription className="sr-only">
            Cửa sổ chat trợ lý AI FinJar. Tính năng gửi tin nhắn sẽ được bật khi
            kết nối API.
          </DialogDescription>

          {/* Messenger-style header */}
          <header
            className="flex shrink-0 items-center justify-between gap-2 px-2 py-2.5 pl-3"
            style={{ backgroundColor: messenger.header }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="relative shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gradient-to-br from-violet-200 to-indigo-500 text-xs font-bold text-indigo-950"
                  style={{ borderColor: messenger.header }}
                >
                  AI
                </div>
                <span
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#A000F0] bg-emerald-400"
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate text-[15px] font-semibold leading-tight text-white">
                  Trợ lý FinJar
                </DialogTitle>
                <p
                  className="truncate text-xs"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Đang hoạt động
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center">
              <HeaderIconButton label="Thêm tùy chọn">
                <ChevronDown className="h-5 w-5" strokeWidth={2} />
              </HeaderIconButton>
              <HeaderIconButton label="Gọi thoại (demo)">
                <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
              </HeaderIconButton>
              <HeaderIconButton label="Gọi video (demo)">
                <Video className="h-[18px] w-[18px]" strokeWidth={2} />
              </HeaderIconButton>
              <HeaderIconButton label="Thu nhỏ" onClick={() => setOpen(false)}>
                <Minus className="h-5 w-5" strokeWidth={2} />
              </HeaderIconButton>
              <DialogClose asChild>
                <HeaderIconButton label="Đóng">
                  <X className="h-5 w-5" strokeWidth={2} />
                </HeaderIconButton>
              </DialogClose>
            </div>
          </header>

          {/* Thread */}
          <div
            className="min-h-[220px] flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
            style={{ backgroundColor: messenger.bg }}
          >
            <div className="flex gap-2">
              <div
                className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-200 to-indigo-500"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p
                  className="mb-1 text-xs font-medium"
                  style={{ color: messenger.textMuted }}
                >
                  Trợ lý FinJar
                </p>
                <div
                  className="inline-block max-w-[95%] rounded-2xl rounded-tl-sm px-3 py-2 text-[15px] leading-snug text-white"
                  style={{ backgroundColor: messenger.bubble }}
                >
                  Chào bạn! Mình có thể giúp gợi ý ngân sách, phân loại chi tiêu
                  và mẹo tiết kiệm. Kết nối API chat sẽ được bật trong thời gian
                  tới — hiện bạn có thể xem trước giao diện tại đây.
                </div>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div
            className="shrink-0 border-t border-white/10 px-2 pb-3 pt-2"
            style={{ backgroundColor: messenger.bg }}
          >
            <div className="mb-2 flex items-center gap-0.5 px-1">
              <button
                type="button"
                aria-label="Đính kèm"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0084FF] transition hover:bg-white/5"
              >
                <Plus className="h-6 w-6" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Ảnh"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0084FF] transition hover:bg-white/5"
              >
                <ImageIcon className="h-6 w-6" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Nhãn dán"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0084FF] transition hover:bg-white/5"
              >
                <Smile className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex items-end gap-2">
              <div
                className="relative flex min-h-10 flex-1 items-center rounded-full border border-white/10 bg-[#3A3B3C] px-4 pr-11"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                <input
                  type="text"
                  readOnly
                  disabled
                  placeholder="Aa"
                  className="h-10 w-full bg-transparent text-[15px] text-white placeholder:text-[#B0B3B8] focus:outline-none disabled:cursor-not-allowed disabled:opacity-80"
                  aria-label="Nhập tin nhắn (sắp có)"
                />
                <button
                  type="button"
                  aria-label="Biểu tượng cảm xúc"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#0084FF] transition hover:bg-white/5"
                >
                  <Smile className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
              <button
                type="button"
                aria-label="Thích"
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0084FF] transition hover:bg-white/5"
              >
                <ThumbsUp className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
