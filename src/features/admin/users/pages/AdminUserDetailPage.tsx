import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { ROUTES } from "@/shared/constants/routes";
import { useAdminUserDetail } from "../hooks/useAdminUsers";
import {
  useBanUserMutation,
  useUnbanUserMutation,
} from "../hooks/useBanUserMutations";
import type { AdminUserDto } from "../types";

const MIN_REASON_LENGTH = 10;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

function DetailSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useAdminUserDetail(
    id ?? null,
    { enabled: Boolean(id) },
  );
  const banMutation = useBanUserMutation();
  const unbanMutation = useUnbanUserMutation();

  const [banOpen, setBanOpen] = useState(false);
  const [unbanOpen, setUnbanOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  const displayName = (u: AdminUserDto) =>
    `${u.firstName} ${u.lastName}`.trim() || u.userName || u.email;

  const handleConfirmBan = () => {
    if (!id || banReason.trim().length < MIN_REASON_LENGTH) return;
    banMutation.mutate(
      { id, reason: banReason.trim() },
      {
        onSuccess: () => {
          setBanOpen(false);
          setBanReason("");
        },
      },
    );
  };

  const handleConfirmUnban = () => {
    if (!id) return;
    unbanMutation.mutate(id, { onSuccess: () => setUnbanOpen(false) });
  };

  return (
    <section className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="-ml-2"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Button>
      </div>

      {isLoading && <DetailSkeleton />}

      {isError && (
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Không tải được dữ liệu."}
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
              <Button asChild>
                <Link to={ROUTES.ADMIN_USERS}>Về danh sách</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
                  <UserIcon className="size-7 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{displayName(data)}</h2>
                  <p className="text-sm text-muted-foreground">@{data.userName}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.status === "Banned" ? (
                      <Badge variant="destructive">Đã khóa</Badge>
                    ) : (
                      <Badge variant="secondary">Hoạt động</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{data.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Điện thoại</p>
                    <p className="font-medium">{data.phone ?? "—"}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{formatDate(data.createdAt)}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Onboarding</p>
                  <p className="font-medium">
                    {data.isOnboardingCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trạng thái tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {data.status === "Banned" ? (
                <Button
                  type="button"
                  onClick={() => setUnbanOpen(true)}
                  disabled={unbanMutation.isPending}
                >
                  Mở khóa tài khoản
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setBanOpen(true)}
                  disabled={banMutation.isPending}
                >
                  Khóa tài khoản
                </Button>
              )}
            </CardContent>
          </Card>

          <AlertDialog open={banOpen} onOpenChange={setBanOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Khóa tài khoản</AlertDialogTitle>
                <AlertDialogDescription>
                  Nhập lý do (tối thiểu {MIN_REASON_LENGTH} ký tự).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="ban-reason">Lý do</Label>
                <Input
                  id="ban-reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="VD: Vi phạm điều khoản..."
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" type="button">
                    Huỷ
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={
                      banReason.trim().length < MIN_REASON_LENGTH ||
                      banMutation.isPending
                    }
                    onClick={handleConfirmBan}
                  >
                    {banMutation.isPending ? "Đang xử lý..." : "Xác nhận khóa"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={unbanOpen} onOpenChange={setUnbanOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mở khóa tài khoản</AlertDialogTitle>
                <AlertDialogDescription>
                  Người dùng <strong>{displayName(data)}</strong> sẽ đăng nhập lại được.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" type="button">
                    Huỷ
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="button"
                    disabled={unbanMutation.isPending}
                    onClick={handleConfirmUnban}
                  >
                    {unbanMutation.isPending ? "Đang xử lý..." : "Xác nhận mở khóa"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </section>
  );
}
