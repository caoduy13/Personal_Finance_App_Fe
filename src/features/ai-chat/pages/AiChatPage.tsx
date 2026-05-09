import { AiChatContent } from "../components/AiChatContent";

export function AiChatPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">Trợ lý AI</h1>
        <p className="mt-1 text-sm text-slate-500">
          Trò chuyện tư vấn tài chính (API <code className="text-xs">POST /ai/chat</code>
          ).
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <AiChatContent className="flex min-h-[480px] flex-col" />
      </div>
    </section>
  );
}
