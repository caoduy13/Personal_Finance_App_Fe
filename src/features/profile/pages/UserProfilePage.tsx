import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Pencil, Settings, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

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
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [draftFirstName, setDraftFirstName] = useState("");
  const [draftLastName, setDraftLastName] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftAvatarUrl, setDraftAvatarUrl] = useState("");

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

  const startEdit = () => {
    if (!data) return;
    setDraftFirstName(data.firstName);
    setDraftLastName(data.lastName);
    setDraftPhone(data.phone ?? "");
    setDraftAvatarUrl(data.avatarUrl ?? "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (data) {
      setDraftFirstName(data.firstName);
      setDraftLastName(data.lastName);
      setDraftPhone(data.phone ?? "");
      setDraftAvatarUrl(data.avatarUrl ?? "");
    }
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      await saveProfile({
        firstName: draftFirstName.trim(),
        lastName: draftLastName.trim(),
        phone: draftPhone.trim() === "" ? null : draftPhone.trim(),
        avatarUrl: draftAvatarUrl.trim() === "" ? null : draftAvatarUrl.trim(),
      });
      setIsEditing(false);
      setAvatarPreview(null);
      toast.success("Đã cập nhật hồ sơ");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không lưu được hồ sơ");
    }
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

  const effectiveAvatar =
    avatarPreview ?? (draftAvatarUrl.trim() || data.avatarUrl);
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

              <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
                {!isEditing ? (
                  <button
                    type="button"
                    className="inline-flex h-9 w-2/3 min-w-[200px] cursor-pointer items-center justify-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 text-sm font-medium text-black transition-colors hover:bg-violet-100 focus:outline-none focus-visible:outline-none"
                    onClick={startEdit}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                      disabled={saving}
                      onClick={() => void handleSave()}
                    >
                      {saving ? "Đang lưu…" : "Lưu"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={saving}
                      onClick={cancelEdit}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pf-first">Tên</Label>
                    <Input
                      id="pf-first"
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf-last">Họ</Label>
                    <Input
                      id="pf-last"
                      value={draftLastName}
                      onChange={(e) => setDraftLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-phone">Số điện thoại</Label>
                  <Input
                    id="pf-phone"
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="Tuỳ chọn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-avatar">URL ảnh đại diện</Label>
                  <Input
                    id="pf-avatar"
                    value={draftAvatarUrl}
                    onChange={(e) => setDraftAvatarUrl(e.target.value)}
                    placeholder="https://…"
                  />
                  <p className="text-xs text-slate-500">
                    BE lưu URL; chọn file ở menu avatar chỉ xem trước cục bộ
                    trừ khi bạn upload và dán link vào đây.
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Email và tên đăng nhập chỉ đọc — liên hệ hỗ trợ nếu cần đổi.
                </p>
              </div>
            ) : (
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
            )}
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
              Chọn ảnh (xem trước)
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
