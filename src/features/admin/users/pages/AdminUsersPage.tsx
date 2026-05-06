import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Search,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ROUTES } from "@/shared/constants/routes";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type {
  AdminUserRoleCode,
  AdminUserSortDir,
  AdminUserSortField,
  AdminUserStatus,
  AdminUsersListParams,
} from "../types";
import { formatDate } from "../lib/formatters";
import { UserAvatar } from "../components/UserAvatar";

const PAGE_SIZE = 10;
const ROLE_VALUES = ["all", "user", "admin"] as const;
const STATUS_VALUES = ["all", "active", "banned"] as const;
const SORT_FIELDS: AdminUserSortField[] = ["fullName", "email", "createdAt"];

type RoleFilter = (typeof ROLE_VALUES)[number];
type StatusFilter = (typeof STATUS_VALUES)[number];

const isRoleFilter = (value: string | null): value is RoleFilter =>
  value !== null && (ROLE_VALUES as readonly string[]).includes(value);
const isStatusFilter = (value: string | null): value is StatusFilter =>
  value !== null && (STATUS_VALUES as readonly string[]).includes(value);
const isSortField = (value: string | null): value is AdminUserSortField =>
  value !== null && SORT_FIELDS.includes(value as AdminUserSortField);
const isSortDir = (value: string | null): value is AdminUserSortDir =>
  value === "asc" || value === "desc";

const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(1, currentPage - 2);
  let end = start + 4;
  if (end > totalPages) {
    end = totalPages;
    start = end - 4;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

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

const StatusBadge = ({ status }: { status: AdminUserStatus }) => {
  if (status === "Banned") {
    return <Badge variant="destructive">Đã khóa</Badge>;
  }
  return <Badge variant="success">Hoạt động</Badge>;
};

const SortIcon = ({
  active,
  dir,
}: {
  active: boolean;
  dir: AdminUserSortDir;
}) => {
  if (!active) return <ArrowUpDown className="size-3.5 text-muted-foreground" />;
  return dir === "asc" ? (
    <ArrowUp className="size-3.5 text-foreground" />
  ) : (
    <ArrowDown className="size-3.5 text-foreground" />
  );
};

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawSearch = searchParams.get("search") ?? "";
  const role: RoleFilter = isRoleFilter(searchParams.get("role"))
    ? (searchParams.get("role") as RoleFilter)
    : "all";
  const status: StatusFilter = isStatusFilter(searchParams.get("status"))
    ? (searchParams.get("status") as StatusFilter)
    : "all";
  const sortBy: AdminUserSortField = isSortField(searchParams.get("sortBy"))
    ? (searchParams.get("sortBy") as AdminUserSortField)
    : "createdAt";
  const sortDir: AdminUserSortDir = isSortDir(searchParams.get("sortDir"))
    ? (searchParams.get("sortDir") as AdminUserSortDir)
    : "desc";
  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [searchInput, setSearchInput] = useState(rawSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  const updateSearchParams = (
    updater: (next: URLSearchParams) => void,
    options?: { resetPage?: boolean },
  ) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    if (options?.resetPage) {
      next.delete("page");
    }
    setSearchParams(next, { replace: false });
  };

  useEffect(() => {
    if (debouncedSearch === rawSearch) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      next.set("search", debouncedSearch);
    } else {
      next.delete("search");
    }
    next.delete("page");
    setSearchParams(next, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const queryParams: AdminUsersListParams = {
    search: debouncedSearch || undefined,
    role,
    status,
    sortBy,
    sortDir,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useAdminUsers(queryParams);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);
  const startIdx = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, total);

  const onToggleSort = (field: AdminUserSortField) => {
    updateSearchParams(
      (next) => {
        if (sortBy === field) {
          next.set("sortDir", sortDir === "asc" ? "desc" : "asc");
        } else {
          next.set("sortBy", field);
          next.set("sortDir", field === "createdAt" ? "desc" : "asc");
        }
      },
      { resetPage: true },
    );
  };

  const onChangeRole = (value: RoleFilter) =>
    updateSearchParams(
      (next) => {
        if (value === "all") next.delete("role");
        else next.set("role", value);
      },
      { resetPage: true },
    );

  const onChangeStatus = (value: StatusFilter) =>
    updateSearchParams(
      (next) => {
        if (value === "all") next.delete("status");
        else next.set("status", value);
      },
      { resetPage: true },
    );

  const onGoToPage = (target: number) =>
    updateSearchParams((next) => {
      if (target <= 1) next.delete("page");
      else next.set("page", String(target));
    });

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-muted-foreground">
            Tìm kiếm, lọc và quản lý tài khoản người dùng trên hệ thống.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcw className={cn("size-4", isFetching && "animate-spin")} />
          Làm mới
        </Button>
      </header>

      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm theo tên, email, username..."
                className="pl-9"
                aria-label="Tìm kiếm người dùng"
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => onChangeRole(v as RoleFilter)}
            >
              <SelectTrigger aria-label="Lọc theo vai trò">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => onChangeStatus(v as StatusFilter)}
            >
              <SelectTrigger aria-label="Lọc theo trạng thái">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="banned">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">
                    <button
                      type="button"
                      onClick={() => onToggleSort("fullName")}
                      className="inline-flex items-center gap-1.5 font-medium hover:text-foreground"
                    >
                      Người dùng
                      <SortIcon active={sortBy === "fullName"} dir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => onToggleSort("email")}
                      className="inline-flex items-center gap-1.5 font-medium hover:text-foreground"
                    >
                      Email
                      <SortIcon active={sortBy === "email"} dir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => onToggleSort("createdAt")}
                      className="inline-flex items-center gap-1.5 font-medium hover:text-foreground"
                    >
                      Ngày tạo
                      <SortIcon active={sortBy === "createdAt"} dir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-9 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : isError
                    ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="py-10 text-center text-sm text-destructive"
                          >
                            Không tải được danh sách người dùng.
                            <Button
                              variant="link"
                              className="ml-2 h-auto p-0"
                              onClick={() => refetch()}
                            >
                              Thử lại
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    : data && data.items.length > 0
                      ? data.items.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  fullName={user.fullName}
                                  avatarUrl={user.avatarUrl}
                                  isAdmin={user.roleCode === "ADMIN"}
                                />
                                <div className="min-w-0">
                                  <p className="truncate font-medium leading-tight">
                                    {user.fullName}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              @{user.username}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <RoleBadge roleCode={user.roleCode} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={user.status} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="outline" size="sm">
                                <Link to={ROUTES.ADMIN_USER_DETAIL(user.id)}>
                                  Xem chi tiết
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="py-10 text-center text-sm text-muted-foreground"
                            >
                              Không tìm thấy người dùng phù hợp.
                            </TableCell>
                          </TableRow>
                        )}
              </TableBody>
            </Table>
          </div>

          <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "Không có người dùng."
                : `Hiển thị ${startIdx}–${endIdx} trong ${total} người dùng`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onGoToPage(page - 1)}
                  disabled={page <= 1}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {pageNumbers.map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onGoToPage(p)}
                    aria-current={p === page ? "page" : undefined}
                    className="min-w-9"
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onGoToPage(page + 1)}
                  disabled={page >= totalPages}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </footer>
        </CardContent>
      </Card>
    </section>
  );
}
