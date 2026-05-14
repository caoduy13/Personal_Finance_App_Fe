import { useEffect, useRef, useState } from "react";
import { Bot, CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiChatService, type AiChatMessage } from "../services";

type Bubble = { id: string; role: "user" | "assistant"; text: string };

export function AiChatContent({ className }: { className?: string }) {
  const [turns, setTurns] = useState<Bubble[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Chào bạn! Hỏi mình về giới hạn chi tiêu, phân loại chi tiêu hoặc mẹo tiết kiệm.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns, pending]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    setError(null);
    const userBubble: Bubble = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setTurns((prev) => [...prev, userBubble]);
    setInput("");
    setPending(true);

    const recent: AiChatMessage[] = turns
      .filter((b) => b.id !== "welcome")
      .map((b) => ({
        sender: b.role === "user" ? "user" : "assistant",
        content: b.text,
      }));

    try {
      const res = await aiChatService.send(
        text,
        recent.length > 0 ? recent : undefined,
      );
      const answer = res.answer?.trim() || "Không có phản hồi.";
      const extra =
        res.suggestions?.length && res.suggestions.length > 0
          ? `\n\nGợi ý: ${res.suggestions.join(" · ")}`
          : "";
      setTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: answer + extra,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gửi tin nhắn thất bại.");
      setTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Đã có lỗi khi gọi API. Kiểm tra mạng hoặc cấu hình AI trên server.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-linear-to-b from-violet-50/90 to-white text-slate-800",
        className,
      )}
    >
      <div
        ref={listRef}
        className="scrollbar-none max-h-[min(520px,65vh)] min-h-[280px] flex-1 overflow-y-auto px-3 py-3"
      >
        <div className="flex flex-col gap-3">
          {turns.map((b) => {
            const isUser = b.role === "user";
            const avatar = (
              <div
                className={cn(
                  "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  isUser
                    ? "bg-[#6366F1]/15 ring-2 ring-[#6366F1]/35"
                    : "bg-linear-to-br from-violet-200 to-indigo-400 ring-2 ring-violet-200/80",
                )}
                aria-hidden
              >
                {isUser ? (
                  <CircleUserRound
                    className="h-[18px] w-[18px] text-[#6366F1]"
                    strokeWidth={2}
                  />
                ) : (
                  <Bot
                    className="h-[18px] w-[18px] text-white drop-shadow-sm"
                    strokeWidth={2}
                  />
                )}
              </div>
            );
            const body = (
              <div
                className={cn(
                  "flex min-w-0 max-w-[min(100%,20rem)] flex-col",
                  isUser ? "items-end" : "items-start",
                )}
              >
                <p
                  className={cn(
                    "mb-1 text-xs font-medium",
                    isUser ? "text-[#6366F1]" : "text-slate-500",
                  )}
                >
                  {isUser ? "Bạn" : "Trợ lý FinJar"}
                </p>
                <div
                  className={cn(
                    "w-fit max-w-full whitespace-pre-wrap rounded-2xl px-3 py-2 text-[15px] leading-snug shadow-sm",
                    isUser
                      ? "rounded-tr-sm bg-[#6366F1] text-white"
                      : "rounded-tl-sm border border-violet-100 bg-white text-slate-800",
                  )}
                >
                  {b.text}
                </div>
              </div>
            );
            return (
              <div
                key={b.id}
                className={cn(
                  "flex w-full gap-2",
                  isUser ? "justify-end" : "justify-start",
                )}
              >
                {isUser ? (
                  <>
                    {body}
                    {avatar}
                  </>
                ) : (
                  <>
                    {avatar}
                    {body}
                  </>
                )}
              </div>
            );
          })}
          {pending ? (
            <p className="text-xs text-slate-500">Đang trả lời...</p>
          ) : null}
          {error ? (
            <p className="text-xs font-medium text-amber-700">{error}</p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 px-2 pb-3 pt-2 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Nhập câu hỏi..."
            disabled={pending}
            className="min-h-10 flex-1 rounded-full border border-violet-200 bg-white px-4 py-2 text-[15px] text-slate-800 shadow-inner placeholder:text-slate-400 focus:border-[#6366F1]/50 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 disabled:opacity-60"
            aria-label="Nhập tin nhắn"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={pending || !input.trim()}
            className="mb-0.5 shrink-0 rounded-full bg-[#6366F1] px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-500/20 transition hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
