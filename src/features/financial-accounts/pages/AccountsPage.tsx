import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ExternalLink,
  Landmark,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import { useFinancialAccounts } from "../hooks/useFinancialAccounts";
import {
  useConnectCassoFinancialAccount,
  useCreateManualFinancialAccount,
  useDeactivateFinancialAccount,
  useSyncCassoFinancialAccount,
  useUpdateFinancialAccount,
} from "../hooks/useFinancialAccountMutations";
import type { FinancialAccountItem } from "../types";

const ACCOUNT_TYPES = ["Cash", "Bank", "EWallet", "Other"] as const;

const formatCurrency = (amount: number, currency = "VND") =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

function connectionLabel(mode: string) {
  if (mode === "LinkedApi") return "Liên kết API (Casso)";
  if (mode === "Manual") return "Thủ công";
  return mode;
}

function buildCassoReturnUrl() {
  return new URL(ROUTES.ACCOUNTS, window.location.origin).toString();
}

export function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data = [], isLoading, isError, refetch } = useFinancialAccounts();
  const { mutateAsync: createManual, isPending: creatingManual } =
    useCreateManualFinancialAccount();
  const { mutateAsync: connectCasso, isPending: connectingCasso } =
    useConnectCassoFinancialAccount();
  const { mutateAsync: syncCasso } = useSyncCassoFinancialAccount();
  const { mutateAsync: updateAcc, isPending: updating } =
    useUpdateFinancialAccount();
  const { mutateAsync: deactivate, isPending: deactivating } =
    useDeactivateFinancialAccount();

  const [manualOpen, setManualOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [editItem, setEditItem] = useState<FinancialAccountItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [mName, setMName] = useState("");
  const [mType, setMType] = useState<string>(ACCOUNT_TYPES[0]);
  const [mBalance, setMBalance] = useState("0");
  const [mCurrency, setMCurrency] = useState("VND");
  const [mDefault, setMDefault] = useState(false);

  const [cassoDefault, setCassoDefault] = useState(false);
  const [cassoAutoSync, setCassoAutoSync] = useState(true);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);

  const [eName, setEName] = useState("");
  const [eBalance, setEBalance] = useState("");
  const [eDefault, setEDefault] = useState(false);

  const openManual = () => {
    setMName("");
    setMType(ACCOUNT_TYPES[0]);
    setMBalance("0");
    setMCurrency("VND");
    setMDefault(false);
    setManualOpen(true);
  };

  const openLink = () => {
    setCassoDefault(false);
    setCassoAutoSync(true);
    setLinkOpen(true);
  };

  const openEdit = (a: FinancialAccountItem) => {
    setEditItem(a);
    setEName(a.name);
    setEBalance(String(a.currentBalance));
    setEDefault(a.isDefault);
  };

  useEffect(() => {
    const cassoStatus = searchParams.get("cassoStatus");
    if (!cassoStatus) return;

    const callbackMessage =
      searchParams.get("message") ??
      searchParams.get("error") ??
      searchParams.get("cassoMessage");

    if (cassoStatus === "success") {
      toast.success("Đã liên kết ngân hàng qua Casso", {
        description: callbackMessage ?? "Danh sách tài khoản đang được làm mới.",
      });
      void refetch();
    } else {
      toast.error("Liên kết Casso thất bại", {
        description: callbackMessage ?? "Bạn có thể thử lại sau.",
      });
    }

    const next = new URLSearchParams(searchParams);
    [
      "cassoStatus",
      "message",
      "error",
      "cassoMessage",
      "financialAccountId",
      "sessionId",
    ].forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  }, [refetch, searchParams, setSearchParams]);

  const submitManual = async () => {
    try {
      await createManual({
        name: mName.trim(),
        accountType: mType,
        currentBalance: Number(mBalance) || 0,
        currency: mCurrency.trim().toUpperCase() || "VND",
        isDefault: mDefault,
      });
      toast.success("Đã tạo tài khoản thủ công");
      setManualOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tạo được");
    }
  };

  const submitCassoConnect = async () => {
    try {
      const session = await connectCasso({
        returnUrl: buildCassoReturnUrl(),
        isDefault: cassoDefault,
        autoSync: cassoAutoSync,
      });
      toast.message("Đang chuyển sang Casso", {
        description: "Hoàn tất cấp quyền ở Casso để quay lại FinJar.",
      });
      window.location.assign(session.authorizationUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tạo được phiên Casso");
    }
  };

  const submitEdit = async () => {
    if (!editItem) return;
    const isLinked = editItem.connectionMode === "LinkedApi";
    try {
      await updateAcc({
        id: editItem.id,
        payload: {
          name: eName.trim(),
          currentBalance: isLinked ? undefined : Number(eBalance) || 0,
          isDefault: eDefault,
        },
      });
      toast.success("Đã cập nhật");
      setEditItem(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không cập nhật được");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deactivate(deleteId);
      toast.success("Đã ngừng theo dõi tài khoản");
      setDeleteId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không xóa được");
    }
  };

  const onSyncCasso = async (account: FinancialAccountItem) => {
    setSyncingAccountId(account.id);
    try {
      const result = await syncCasso({
        id: account.id,
        payload: {
          page: 1,
          pageSize: 100,
          sort: "DESC",
          triggerProviderSync: true,
        },
      });
      toast.success(result.message || "Đã đồng bộ Casso", {
        description: `${result.createdCount} giao dịch mới, ${result.skippedCount} giao dịch bỏ qua.`,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không đồng bộ được Casso");
    } finally {
      setSyncingAccountId(null);
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-violet-600/80">Đang tải nguồn tiền...</p>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">Không tải được danh sách.</p>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-violet-200 bg-white hover:bg-violet-50"
          onClick={() => void refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-indigo-50/90 px-5 py-6 shadow-sm sm:px-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
              Tài khoản
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">
              Nguồn tiền
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Tài khoản thủ công và liên kết ngân hàng (Casso).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="cursor-pointer gap-2 bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
              onClick={openManual}
            >
              <Plus className="h-4 w-4" />
              Thêm thủ công
            </Button>
            <Button
              type="button"
              variant="outline"
              className="hidden cursor-pointer gap-2 border-violet-200/80 bg-white/80 hover:bg-violet-50"
              onClick={openLink}
            >
              <Landmark className="h-4 w-4" />
              Liên kết ngân hàng
            </Button>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <Card className="border-dashed border-violet-200/80 bg-violet-50/30 shadow-none">
          <CardContent className="py-12 text-center text-sm text-slate-600">
            <Landmark className="mx-auto mb-3 h-10 w-10 text-violet-300" />
            <p>Chưa có nguồn tiền nào.</p>
            <p className="mt-1">
              Tạo tài khoản Cash thủ công hoặc liên kết ngân hàng qua Casso.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                type="button"
                className="bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
                onClick={openManual}
              >
                Thêm thủ công
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hidden border-violet-200/80 hover:bg-violet-50"
                onClick={openLink}
              >
                Liên kết ngân hàng
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((a) => (
            <Card
              key={a.id}
              className="border-violet-200/80 bg-white/80 shadow-none backdrop-blur-sm transition hover:border-violet-300 hover:shadow-sm hover:shadow-violet-500/10"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{a.name}</CardTitle>
                    <CardDescription>
                      {a.accountType} · {connectionLabel(a.connectionMode)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.isDefault ? (
                      <Badge variant="default">Mặc định</Badge>
                    ) : null}
                    <Badge variant={a.isActive ? "success" : "secondary"}>
                      {a.isActive ? "Đang dùng" : "Ngừng theo dõi"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-2xl font-semibold text-[#6366F1]">
                  {formatCurrency(a.currentBalance, a.currency)}
                </p>
                <dl className="grid gap-1 text-slate-600">
                  <div className="flex justify-between">
                    <dt>Đồng bộ</dt>
                    <dd>{a.syncStatus}</dd>
                  </div>
                  {a.providerName ? (
                    <div className="flex justify-between">
                      <dt>Nhà cung cấp</dt>
                      <dd>{a.providerName}</dd>
                    </div>
                  ) : null}
                  {a.maskedAccountNumber ? (
                    <div className="flex justify-between">
                      <dt>STK</dt>
                      <dd className="font-mono">{a.maskedAccountNumber}</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="flex flex-wrap gap-2 border-t border-violet-100 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer gap-1.5 border-violet-200/80 hover:bg-violet-50 hover:text-[#4F46E5]"
                    onClick={() => openEdit(a)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Sửa
                  </Button>
                  {a.connectionMode === "LinkedApi" && a.isActive ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer gap-1.5 border-violet-200/80 hover:bg-violet-50"
                      disabled={syncingAccountId === a.id}
                      onClick={() => void onSyncCasso(a)}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {syncingAccountId === a.id ? "Đang sync..." : "Sync Casso"}
                    </Button>
                  ) : null}
                  {a.isActive ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer gap-1.5 border-violet-200/80 text-red-600 hover:border-red-200 hover:bg-red-50"
                      onClick={() => setDeleteId(a.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Ngừng theo dõi
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="rounded-xl border border-violet-100 bg-violet-50/40 py-3 text-center text-sm text-slate-600">
        <Link
          to={ROUTES.TRANSACTIONS_ADD}
          className="font-medium text-[#6366F1] underline-offset-2 hover:underline"
        >
          Thêm giao dịch
        </Link>{" "}
        — chọn tài khoản nguồn khi ghi nhận thu chi.
      </p>

      {/* Thêm thủ công */}
      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tài khoản thủ công</DialogTitle>
            <DialogDescription>
              Loại: Cash, Bank, EWallet, Other — khớp validation BE.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="acc-m-name">Tên hiển thị</Label>
              <Input
                id="acc-m-name"
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                placeholder="Ví dụ: Tiền mặt chính"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-m-type">Loại</Label>
              <select
                id="acc-m-type"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                value={mType}
                onChange={(e) => setMType(e.target.value)}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="acc-m-bal">Số dư hiện tại</Label>
                <Input
                  id="acc-m-bal"
                  type="number"
                  value={mBalance}
                  onChange={(e) => setMBalance(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-m-ccy">Tiền tệ (3 ký tự)</Label>
                <Input
                  id="acc-m-ccy"
                  value={mCurrency}
                  onChange={(e) => setMCurrency(e.target.value.toUpperCase())}
                  maxLength={3}
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={mDefault}
                onChange={(e) => setMDefault(e.target.checked)}
                className="h-4 w-4 accent-[#6366F1]"
              />
              Đặt làm tài khoản mặc định
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setManualOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#6366F1] text-white"
              disabled={creatingManual || !mName.trim()}
              onClick={() => void submitManual()}
            >
              {creatingManual ? "Đang lưu…" : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Liên kết Casso */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Liên kết ngân hàng qua Casso</DialogTitle>
            <DialogDescription>
              Bạn sẽ được chuyển sang Casso để cấp quyền truy cập tài khoản.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#6366F1]" />
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">OAuth Casso</p>
                  <p>
                    FinJar không yêu cầu nhập số tài khoản thủ công. Backend sẽ
                    nhận callback từ Casso và tạo tài khoản liên kết sau khi cấp
                    quyền thành công.
                  </p>
                </div>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cassoDefault}
                onChange={(e) => setCassoDefault(e.target.checked)}
                className="h-4 w-4 accent-[#6366F1]"
              />
              Đặt làm tài khoản mặc định
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cassoAutoSync}
                onChange={(e) => setCassoAutoSync(e.target.checked)}
                className="h-4 w-4 accent-[#6366F1]"
              />
              Tự đồng bộ giao dịch ban đầu sau khi liên kết
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="gap-2 bg-[#6366F1] text-white"
              disabled={connectingCasso}
              onClick={() => void submitCassoConnect()}
            >
              <ExternalLink className="h-4 w-4" />
              {connectingCasso ? "Đang tạo phiên..." : "Tiếp tục với Casso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sửa */}
      <Dialog
        open={editItem !== null}
        onOpenChange={(o) => !o && setEditItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa tài khoản</DialogTitle>
            <DialogDescription>
              Tài khoản liên kết: không đổi số dư thủ công (theo BE).
            </DialogDescription>
          </DialogHeader>
          {editItem ? (
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="acc-e-name">Tên</Label>
                <Input
                  id="acc-e-name"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-e-bal">Số dư</Label>
                <Input
                  id="acc-e-bal"
                  type="number"
                  value={eBalance}
                  onChange={(e) => setEBalance(e.target.value)}
                  disabled={editItem.connectionMode === "LinkedApi"}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={eDefault}
                  onChange={(e) => setEDefault(e.target.checked)}
                  className="h-4 w-4 accent-[#6366F1]"
                />
                Mặc định
              </label>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#6366F1] text-white"
              disabled={updating || !editItem}
              onClick={() => void submitEdit()}
            >
              {updating ? "Đang lưu…" : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ngừng theo dõi tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              BE sẽ đánh dấu không còn hoạt động (soft). Bạn có thể xem lại trong
              lịch sử nếu cần.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={deactivating}
                onClick={() => void confirmDelete()}
              >
                {deactivating ? "Đang xử lý…" : "Xác nhận"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

