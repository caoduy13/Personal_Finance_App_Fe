import { Bell } from "lucide-react";

export function UserNotificationsPage() {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-8 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)]">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#E8EFFF] text-[#3B5BDB] shadow-inner">
          <Bell className="size-8" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-900">Thông báo</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Trang thông báo đang được hoàn thiện. Tại đây sẽ hiển thị cảnh báo hạn mức,
          cập nhật mục tiêu và tin tức hệ thống theo phong cách card mềm.
        </p>
      </div>
    </div>
  );
}
