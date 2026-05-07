import { useState } from "react";
import { toast } from "sonner";
import { useCategories } from "@/features/categories";
import {
  useUpdateUserProfile,
  useUserProfile,
  type UserProfile,
} from "@/features/user";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

function ProfileEditor({ profile }: { profile: UserProfile }) {
  const update = useUpdateUserProfile();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      toast.error("Vui lòng nhập họ và tên.");
      return;
    }
    update.mutate(
      {
        firstName: fn,
        lastName: ln,
        phone: phone.trim() || null,
      },
      {
        onSuccess: () => toast.success("Đã cập nhật hồ sơ."),
        onError: () => toast.error("Không thể cập nhật hồ sơ."),
      },
    );
  };

  return (
    <form className="mt-6 max-w-md space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium" htmlFor="profile-email">
          Email
        </label>
        <Input
          id="profile-email"
          className="mt-1.5 bg-muted/40"
          value={profile.email}
          disabled
          readOnly
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="profile-first">
          Họ / tên đệm
        </label>
        <Input
          id="profile-first"
          className="mt-1.5"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="profile-last">
          Tên
        </label>
        <Input
          id="profile-last"
          className="mt-1.5"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="profile-phone">
          Số điện thoại
        </label>
        <Input
          id="profile-phone"
          className="mt-1.5"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="Tuỳ chọn"
        />
      </div>
      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? "Đang lưu…" : "Lưu thay đổi"}
      </Button>
    </form>
  );
}

export function UserProfilePage() {
  const { data, isPending, error, refetch, dataUpdatedAt } = useUserProfile();
  const categories = useCategories();

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-white p-6 text-sm">
        <p className="text-destructive">Không tải được hồ sơ.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Hồ sơ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cập nhật họ, tên và số điện thoại đồng bộ với máy chủ khi đăng nhập thật.
        </p>

        {isPending || !data ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        ) : (
          <ProfileEditor key={dataUpdatedAt} profile={data} />
        )}
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Danh mục chi tiêu</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách từ API (hoặc mock) dùng cho giao dịch và ngân sách.
        </p>
        <Separator className="my-4" />
        {categories.isPending ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        ) : categories.error ? (
          <p className="text-sm text-destructive">Không tải được danh mục.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {(categories.data ?? []).map((c) => (
              <li key={c.id}>
                <Badge
                  variant={c.isDefault ? "secondary" : "outline"}
                  className="gap-1.5 font-normal"
                  style={
                    c.color
                      ? { borderColor: c.color, color: c.color }
                      : undefined
                  }
                >
                  {c.name}
                  {c.isDefault ? (
                    <span className="text-[10px] uppercase opacity-70">
                      mặc định
                    </span>
                  ) : null}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
