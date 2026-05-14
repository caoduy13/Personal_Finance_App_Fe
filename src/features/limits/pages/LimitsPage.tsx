import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUserCategories } from "@/features/categories";
import { useJars } from "@/features/jars/hooks/useJars";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import {
  useCreateLimit,
  useDeleteLimit,
  useUpdateLimit,
} from "../hooks/useLimitsMutations";
import { useLimits } from "../hooks/useLimits";
import type { SpendingLimit } from "../types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function LimitsPage() {
  const { data, isLoading, isError, refetch } = useLimits();
  const { data: jars = [] } = useJars();
  const { data: categories = [] } = useUserCategories();
  const { mutateAsync: createLimitMutation, isPending: creating } =
    useCreateLimit();
  const { mutateAsync: updateLimitMutation, isPending: updating } =
    useUpdateLimit();
  const { mutateAsync: deleteLimitMutation, isPending: deleting } =
    useDeleteLimit();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<SpendingLimit | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [cTargetType, setCTargetType] = useState<"Jar" | "Category">("Jar");
  const [cTargetId, setCTargetId] = useState("");
  const [cLimit, setCLimit] = useState("");
  const [cPeriod, setCPeriod] = useState<"Daily" | "Monthly">("Monthly");
  const [cAlert, setCAlert] = useState("80");

  const [eLimit, setELimit] = useState("");
  const [eAlert, setEAlert] = useState("");

  const targetOptions = useMemo(() => {
    if (cTargetType === "Jar") {
      return jars.map((j) => ({ id: j.id, label: j.name }));
    }
    return categories.map((c) => ({ id: c.id, label: c.name }));
  }, [cTargetType, jars, categories]);

  const openCreate = () => {
    setCTargetType("Jar");
    setCTargetId("");
    setCLimit("");
    setCPeriod("Monthly");
    setCAlert("80");
    setCreateOpen(true);
  };

  const openEdit = (item: SpendingLimit) => {
    setEditItem(item);
    setELimit(String(item.limitAmount));
    setEAlert(String(item.alertAtPercentage));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(cLimit);
    const alertPct = Number(cAlert);
    if (!cTargetId) {
      toast.error("Chọn đối tượng áp dụng giới hạn.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Số tiền giới hạn phải lớn hơn 0.");
      return;
    }
    if (!Number.isFinite(alertPct) || alertPct <= 0 || alertPct > 100) {
      toast.error("Ngưỡng cảnh báo phải từ 1–100%.");
      return;
    }
    try {
      await createLimitMutation({
        targetType: cTargetType,
        targetId: cTargetId,
        limitAmount: amount,
        period: cPeriod,
        alertAtPercentage: alertPct,
      });
      toast.success("Đã tạo giới hạn");
      setCreateOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tạo được giới hạn.");
    }
  };

  const handleUpdate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editItem) return;
    const amount = eLimit.trim() === "" ? undefined : Number(eLimit);
    const alertPct = eAlert.trim() === "" ? undefined : Number(eAlert);
    if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) {
      toast.error("Số tiền giới hạn không hợp lệ.");
      return;
    }
    if (
      alertPct !== undefined &&
      (!Number.isFinite(alertPct) || alertPct <= 0 || alertPct > 100)
    ) {
      toast.error("Ngưỡng cảnh báo phải từ 1–100%.");
      return;
    }
    try {
      await updateLimitMutation({
        id: editItem.id,
        payload: {
          ...(amount !== undefined ? { limitAmount: amount } : {}),
          ...(alertPct !== undefined ? { alertAtPercentage: alertPct } : {}),
        },
      });
      toast.success("Đã cập nhật giới hạn");
      setEditItem(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không cập nhật được.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLimitMutation(deleteId);
      toast.success("Đã xóa giới hạn");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không xóa được.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-violet-600/80">Đang tải giới hạn...</p>
    );
  }
  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">Không tải được danh sách giới hạn.</p>
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
              Giới hạn chi tiêu
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">Giới hạn</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Hạn mức theo hũ hoặc danh mục, kỳ ngày/tháng và ngưỡng cảnh báo.
            </p>
          </div>
          <Button
            type="button"
            className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
            onClick={openCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm giới hạn
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.length === 0 ? (
          <p className="text-sm text-slate-500 md:col-span-2">
            Chưa có giới hạn nào. Nhấn &quot;Thêm giới hạn&quot; để tạo.
          </p>
        ) : (
          data.map((item) => (
            <Card
              key={item.id}
              className="border-violet-200/80 bg-white/80 shadow-none backdrop-blur-sm transition hover:border-violet-300 hover:shadow-sm hover:shadow-violet-500/10"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0f172a]">
                  {item.targetName}
                </CardTitle>
                <CardDescription>
                  {item.targetType === "Jar" ? "Hũ" : "Danh mục"} · Kỳ{" "}
                  {item.period === "Daily" ? "ngày" : "tháng"} · Cảnh báo khi đạt{" "}
                  {item.alertAtPercentage}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                  <span>
                    Giới hạn:{" "}
                    <span className="font-semibold text-[#6366F1]">
                      {formatCurrency(item.limitAmount)}
                    </span>
                  </span>
                  <span>Đã chi: {formatCurrency(item.currentSpent)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-violet-100/80">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, item.currentPercentage))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {item.currentPercentage.toFixed(1)}% giới hạn · Trạng thái:{" "}
                  {item.status}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-violet-200/80 hover:bg-violet-50 hover:text-[#4F46E5]"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-violet-200/80 text-red-600 hover:border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Tạo giới hạn</DialogTitle>
              <DialogDescription>
                Chọn hũ hoặc danh mục, nhập số tiền tối đa trong kỳ.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Loại đối tượng</Label>
                <Select
                  value={cTargetType}
                  onValueChange={(v) => {
                    setCTargetType(v as "Jar" | "Category");
                    setCTargetId("");
                  }}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jar">Hũ</SelectItem>
                    <SelectItem value="Category">Danh mục</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Đối tượng</Label>
                <Select value={cTargetId} onValueChange={setCTargetId}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Chọn..." />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-limit">Số tiền giới hạn (VND)</Label>
                <Input
                  id="c-limit"
                  inputMode="numeric"
                  value={cLimit}
                  onChange={(ev) => setCLimit(ev.target.value)}
                  placeholder="5000000"
                />
              </div>
              <div className="grid gap-2">
                <Label>Kỳ</Label>
                <Select
                  value={cPeriod}
                  onValueChange={(v) => setCPeriod(v as "Daily" | "Monthly")}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Theo ngày</SelectItem>
                    <SelectItem value="Monthly">Theo tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-alert">Cảnh báo khi đạt (%)</Label>
                <Input
                  id="c-alert"
                  inputMode="numeric"
                  value={cAlert}
                  onChange={(ev) => setCAlert(ev.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setCreateOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
                disabled={creating}
              >
                {creating ? "Đang lưu..." : "Tạo giới hạn"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Sửa giới hạn</DialogTitle>
              <DialogDescription>
                {editItem?.targetName} — chỉ đổi được số tiền và ngưỡng cảnh báo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="e-limit">Số tiền giới hạn (VND)</Label>
                <Input
                  id="e-limit"
                  inputMode="numeric"
                  value={eLimit}
                  onChange={(ev) => setELimit(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-alert">Cảnh báo khi đạt (%)</Label>
                <Input
                  id="e-alert"
                  inputMode="numeric"
                  value={eAlert}
                  onChange={(ev) => setEAlert(ev.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setEditItem(null)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
                disabled={updating}
              >
                {updating ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giới hạn?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không hoàn tác. Bạn có chắc muốn xóa giới hạn này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-red-600 hover:bg-red-700"
              onClick={() => void confirmDelete()}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
