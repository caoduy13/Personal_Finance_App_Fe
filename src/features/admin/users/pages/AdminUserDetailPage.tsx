import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Lock,
  Mail,
  Phone,
  Receipt,
  Shield,
  Unlock,
  User as UserIcon,
  Wallet,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAdminUserDetail } from "../hooks/useAdminUserDetail";
import {
  useBanUserMutation,
  useUnbanUserMutation,
} from "../hooks/useBanUserMutations";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  formatVND,
} from "../lib/formatters";
import { UserAvatar } from "../components/UserAvatar";
import type { AdminUserDetail, AdminUserRoleCode } from "../types";

const MIN_REASON_LENGTH = 10;

const RoleBadge = ({ roleCode }: { roleCode: AdminUserRoleCode }) => {
  if (roleCode === "ADMIN") {
    return (
      <Badge variant="destructive">
        <Shield className="size-3" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge variant="info">
      <UserIcon className="size-3" />
      User
    </Badge>
  );
};

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="space-y-1">
    <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
      {icon}
      {label}
    </p>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-5">
      <div className="flex size-12 items-center justify-center rounded-md bg-muted text-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-9 w-48" />
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  </div>
);

const ProfileSection = ({ user }: { user: AdminUserDetail }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Thông tin tài khoản</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <UserAvatar
          fullName={user.fullName}
          avatarUrl={user.avatarUrl}
          isAdmin={user.roleCode === "ADMIN"}
          size="lg"
        />
        <div className="min-w-0 space-y-1">
          <h2 className="text-2xl font-semibold leading-tight">
            {user.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <RoleBadge roleCode={user.roleCode} />
            {user.status === "Banned" ? (
              <Badge variant="destructive">Đã khóa</Badge>
            ) : (
              <Badge variant="success">Hoạt động</Badge>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-5 md:grid-cols-2">
        <InfoRow
          label="Email"
          icon={<Mail className="size-3.5" />}
          value={user.email}
        />
        <InfoRow
          label="Số điện thoại"
          icon={<Phone className="size-3.5" />}
          value={user.phoneNumber ?? "—"}
        />
        <InfoRow label="Ngày tạo" value={formatDate(user.createdAt)} />
        <InfoRow
          label="Đăng nhập cuối"
          value={
            user.lastLoginAt ? (
              <span title={formatDateTime(user.lastLoginAt)}>
                {formatRelative(user.lastLoginAt)}
              </span>
            ) : (
              "—"
            )
          }
        />
        <InfoRow
          label="Tiền tệ ưu tiên"
          value={user.preferredCurrency || "VND"}
        />
        <InfoRow
          label="Onboarding"
          value={
            user.isOnboardingCompleted ? (
              <span className="inline-flex items-center gap-1 text-success">
                <CheckCircle2 className="size-4" />
                Đã hoàn thành
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-warning">
                <CircleAlert className="size-4" />
                Chưa hoàn thành
              </span>
            )
          }
        />
      </div>
    </CardContent>
  </Card>
);

const OnboardingSection = ({ user }: { user: AdminUserDetail }) => {
  const ob = user.onboarding;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        {!ob ? (
          <p className="text-sm text-muted-foreground">
            Người dùng chưa có dữ liệu onboarding.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <InfoRow
              label="Phương pháp ngân sách"
              value={
                ob.budgetMethodPreference ? (
                  <Badge variant="secondary">{ob.budgetMethodPreference}</Badge>
                ) : (
                  "—"
                )
              }
            />
            <InfoRow
              label="Đề xuất hệ thống"
              value={
                ob.recommendedMethod ? (
                  <Badge variant="outline">{ob.recommendedMethod}</Badge>
                ) : (
                  "—"
                )
              }
            />
            <InfoRow
              label="Thu nhập ước tính"
              value={formatVND(ob.monthlyIncome)}
            />
            <InfoRow label="Nghề nghiệp" value={ob.occupationType ?? "—"} />
            <InfoRow label="Độ tuổi" value={ob.ageRange ?? "—"} />
            <InfoRow
              label="Trạng thái onboarding"
              value={
                ob.isCompleted ? (
                  <Badge variant="success">Đã hoàn thành</Badge>
                ) : (
                  <Badge variant="warning">Chưa hoàn thành</Badge>
                )
              }
            />
            <div className="md:col-span-2">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Mục tiêu tài chính
              </p>
              {ob.financialGoalTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ob.financialGoalTypes.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Thách thức chi tiêu
              </p>
              {ob.spendingChallenges.length === 0 ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ob.spendingChallenges.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatsSection = ({ user }: { user: AdminUserDetail }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <StatCard
      label="Số hũ đang dùng"
      value={user.stats.jarsCount.toString()}
      icon={<Wallet className="size-5" />}
    />
    <StatCard
      label="Số giao dịch"
      value={user.stats.transactionsCount.toString()}
      icon={<Receipt className="size-5" />}
    />
    <StatCard
      label="Tổng số dư"
      value={formatVND(user.stats.totalBalance)}
      icon={<Wallet className="size-5" />}
    />
  </div>
);

const StatusSection = ({
  user,
  onBanClick,
  onUnbanClick,
  isBusy,
}: {
  user: AdminUserDetail;
  onBanClick: () => void;
  onUnbanClick: () => void;
  isBusy: boolean;
}) => {
  const isAdmin = user.roleCode === "ADMIN";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Trạng thái tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Trạng thái hiện tại
            </p>
            {user.status === "Banned" ? (
              <Badge variant="destructive">Đã khóa</Badge>
            ) : (
              <Badge variant="success">Hoạt động</Badge>
            )}
          </div>
          {user.status === "Active" ? (
            <Button
              variant="destructive"
              onClick={onBanClick}
              disabled={isBusy || isAdmin}
              title={isAdmin ? "Không thể khóa tài khoản admin" : undefined}
            >
              <Lock className="size-4" />
              Khóa tài khoản
            </Button>
          ) : (
            <Button onClick={onUnbanClick} disabled={isBusy}>
              <Unlock className="size-4" />
              Mở khóa tài khoản
            </Button>
          )}
        </div>

        {user.status === "Banned" && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">
              Tài khoản đang bị khóa
            </p>
            {user.bannedReason && (
              <p className="mt-2 text-foreground">
                <span className="text-muted-foreground">Lý do: </span>
                {user.bannedReason}
              </p>
            )}
            {user.bannedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Khóa lúc: {formatDateTime(user.bannedAt)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface BanDialogProps {
  open: boolean;
  fullName: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

const BanDialog = ({
  open,
  fullName,
  isPending,
  onCancel,
  onConfirm,
}: BanDialogProps) => {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const trimmed = reason.trim();
  const isValid = trimmed.length >= MIN_REASON_LENGTH;
  const showError = touched && !isValid;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onCancel();
      setReason("");
      setTouched(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận khóa tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Người dùng{" "}
            <span className="font-medium text-foreground">{fullName}</span> sẽ
            không thể đăng nhập. Hành động này được ghi vào audit log.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-2">
          <Label htmlFor="ban-reason">
            Lý do khóa <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ban-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Tối thiểu 10 ký tự..."
            disabled={isPending}
            autoFocus
          />
          <p
            className={cn(
              "text-xs",
              showError ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {showError
              ? `Lý do phải có tối thiểu ${MIN_REASON_LENGTH} ký tự.`
              : `Đã nhập ${trimmed.length}/${MIN_REASON_LENGTH} ký tự tối thiểu.`}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              Huỷ
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={!isValid || isPending}
              onClick={(e) => {
                if (!isValid) {
                  e.preventDefault();
                  setTouched(true);
                  return;
                }
                onConfirm(trimmed);
                setReason("");
                setTouched(false);
              }}
            >
              {isPending ? "Đang xử lý..." : "Xác nhận khóa"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface UnbanDialogProps {
  open: boolean;
  fullName: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const UnbanDialog = ({
  open,
  fullName,
  isPending,
  onCancel,
  onConfirm,
}: UnbanDialogProps) => (
  <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Xác nhận mở khóa</AlertDialogTitle>
        <AlertDialogDescription>
          Người dùng{" "}
          <span className="font-medium text-foreground">{fullName}</span> sẽ có
          thể đăng nhập trở lại.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="outline" disabled={isPending}>
            Huỷ
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Xác nhận mở khóa"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useAdminUserDetail(id);
  const banMutation = useBanUserMutation();
  const unbanMutation = useUnbanUserMutation();

  const [banOpen, setBanOpen] = useState(false);
  const [unbanOpen, setUnbanOpen] = useState(false);

  const handleConfirmBan = (reason: string) => {
    if (!id) return;
    banMutation.mutate(
      { id, reason },
      { onSuccess: () => setBanOpen(false) },
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
              {error instanceof Error && error.message === "USER_NOT_FOUND"
                ? "Không tìm thấy người dùng."
                : "Không tải được dữ liệu người dùng."}
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
          <ProfileSection user={data} />
          <OnboardingSection user={data} />
          <StatsSection user={data} />
          <StatusSection
            user={data}
            onBanClick={() => setBanOpen(true)}
            onUnbanClick={() => setUnbanOpen(true)}
            isBusy={banMutation.isPending || unbanMutation.isPending}
          />

          <BanDialog
            open={banOpen}
            fullName={data.fullName}
            isPending={banMutation.isPending}
            onCancel={() => setBanOpen(false)}
            onConfirm={handleConfirmBan}
          />
          <UnbanDialog
            open={unbanOpen}
            fullName={data.fullName}
            isPending={unbanMutation.isPending}
            onCancel={() => setUnbanOpen(false)}
            onConfirm={handleConfirmUnban}
          />
        </div>
      )}
    </section>
  );
}
