import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Pencil, Settings, User, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useCurrentUser } from "../hooks/useCurrentUser";

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm font-medium text-violet-500">{label}</span>
      <span className="text-sm text-slate-900 sm:text-right">{value}</span>
    </div>
  );
}

export function UserProfilePage() {
  const { data, isLoading, isError, error } = useCurrentUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
    setIsAvatarModalOpen(false);
  };

  const handleSelectAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarLoadFailed(false);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-medium">Không tải được hồ sơ</p>
        <p className="mt-1 text-red-700">
          {error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi gọi API user/me."}
        </p>
      </div>
    );
  }

  const displayName =
    [data.lastName, data.firstName].filter(Boolean).join(" ").trim() || "—";

  const effectiveAvatar = avatarPreview ?? data.avatarUrl;
  const canShowAvatarImage =
    Boolean(effectiveAvatar && effectiveAvatar.trim()) && !avatarLoadFailed;

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card className="border-slate-200">
          <CardHeader className="space-y-0 pb-4">
            <div className="mx-auto flex w-full max-w-3xl flex-col">
              <div className="mx-auto flex w-2/3 items-start justify-between">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-violet-200 bg-violet-50/60"
                    onClick={() => setIsAvatarModalOpen(true)}
                    aria-label="Đổi ảnh đại diện"
                  >
                    {canShowAvatarImage ? (
                      <img
                        src={effectiveAvatar ?? ""}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                        onError={() => setAvatarLoadFailed(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-10 w-10 text-violet-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/35">
                      <Camera className="h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </button>

                  <div className="min-w-0 flex-1 text-left">
                    <CardTitle className="text-2xl font-semibold text-violet-700">
                      {data.username}
                    </CardTitle>
                    <p className="mt-1 text-sm text-violet-500">
                      {displayName}
                    </p>
                    <p className="text-sm text-slate-600">{data.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-black transition hover:bg-slate-100 focus:outline-none focus-visible:outline-none"
                  aria-label="Cài đặt"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex w-full justify-center">
                <button
                  type="button"
                  className="inline-flex h-9 w-2/3 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 text-sm font-medium text-black transition-colors hover:bg-violet-100 focus:outline-none focus-visible:outline-none"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4">
                <FieldRow label="Họ" value={data.lastName || "—"} />
                <FieldRow label="Tên" value={data.firstName || "—"} />
                <FieldRow label="Số điện thoại" value={data.phone ?? "—"} />
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4">
                <FieldRow label="Email" value={data.email} />
                <FieldRow label="Tiền tệ" value={data.preferredCurrency} />
                <FieldRow
                  label="Onboarding"
                  value={
                    data.isOnboardingCompleted
                      ? "Đã hoàn thành"
                      : "Chưa hoàn thành"
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelectAvatar}
      />

      {isAvatarModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                Ảnh đại diện
              </p>
              <button
                type="button"
                className="cursor-pointer rounded-full p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setIsAvatarModalOpen(false)}
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              className="w-full cursor-pointer border-b px-4 py-3 text-sm font-medium text-[#6366F1] hover:bg-slate-50"
              onClick={handleOpenFilePicker}
            >
              Đổi ảnh đại diện
            </button>
            <button
              type="button"
              className="w-full cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
