import { Goal, Rocket } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function UserGoalsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-10 text-center shadow-inner">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100">
          <Goal className="size-8 text-[#4A6CF5]" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-900">
          Mục tiêu đang được hoàn thiện
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Giao diện sẽ hiển thị tiến độ tiết kiệm, hạn hoàn thành và gợi ý đóng góp
          hàng tháng — phong cách card mềm giống trang chủ.
        </p>
        <Button
          type="button"
          className="mt-6 rounded-xl bg-[#FCD34D] font-semibold text-slate-900 hover:bg-[#FBBF24]"
        >
          <Rocket className="mr-2 size-4" />
          Thông báo khi có bản cập nhật
        </Button>
      </div>
      <aside className="space-y-4 rounded-[1.35rem] bg-white p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-slate-800">Gợi ý</p>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            Đặt mục tiêu SMART (có hạn và số tiền cụ thể).
          </li>
          <li className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            Gắn mỗi mục với một hũ tiền để theo dõi dễ hơn.
          </li>
        </ul>
      </aside>
    </div>
  );
}
