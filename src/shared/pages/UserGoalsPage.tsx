import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, PiggyBank, Plus, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useJars } from "@/features/jars/hooks/useJars";
import { parseApiError } from "@/lib/apiError";
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
} from "@/features/goals";
import { goalService } from "@/features/goals/services";
import type { GoalListItem } from "@/features/goals";
import { ROUTES } from "@/shared/constants/routes";
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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

function formatDue(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function todayInputMin() {
  return toDatetimeLocalValue(startOfToday());
}

export function UserGoalsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useGoals();
  const { data: jars = [] } = useJars();
  const { mutateAsync: createGoal, isPending: creating } = useCreateGoal();
  const { mutateAsync: updateGoal, isPending: updating } = useUpdateGoal();
  const { mutateAsync: deleteGoal, isPending: deleting } = useDeleteGoal();

  const [createOpen, setCreateOpen] = useState(false);
  const [editListItem, setEditListItem] = useState<GoalListItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Active" | "Completed"
  >("all");

  const [cTitle, setCTitle] = useState("");
  const [cTarget, setCTarget] = useState("");
  const [cDue, setCDue] = useState(() => toDatetimeLocalValue(new Date()));
  const [cJar, setCJar] = useState("__none__");
  const [cNote, setCNote] = useState("");
  const [cDueError, setCDueError] = useState<string | null>(null);

  const [eTitle, setETitle] = useState("");
  const [eTarget, setETarget] = useState("");
  const [eDue, setEDue] = useState("");
  const [eJar, setEJar] = useState("__none__");
  const [eNote, setENote] = useState("");
  const [eDueError, setEDueError] = useState<string | null>(null);
  const visibleGoals =
    statusFilter === "all"
      ? data ?? []
      : (data ?? []).filter((goal) => goal.status === statusFilter);

  const openEdit = async (g: GoalListItem) => {
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: ["goals", "detail", g.id],
        queryFn: () => goalService.getById(g.id),
      });
      setETitle(detail.title);
      setETarget(String(detail.targetAmount));
      const d = detail.dueDate ? new Date(detail.dueDate) : new Date();
      setEDue(toDatetimeLocalValue(Number.isNaN(d.getTime()) ? new Date() : d));
      setEJar(detail.linkedJarId ?? "__none__");
      setENote(detail.note ?? "");
      setEDueError(null);
      setEditListItem(g);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không tải được chi tiết mục tiêu.",
      );
    }
  };

  const openCreate = () => {
    setCTitle("");
    setCTarget("");
    setCDue(toDatetimeLocalValue(new Date()));
    setCJar("__none__");
    setCNote("");
    setCDueError(null);
    setCreateOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(cTarget);
    if (!cTitle.trim()) return;
    if (!Number.isFinite(target) || target <= 0) {
      toast.error("Mục tiêu tiền phải lớn hơn 0.");
      return;
    }
    const parsedDue = new Date(cDue);
    setCDueError(null);
    if (Number.isNaN(parsedDue.getTime())) {
      setCDueError("Hạn không hợp lệ.");
      toast.error("Hạn không hợp lệ.");
      return;
    }
    if (parsedDue < startOfToday()) {
      setCDueError("Hạn mục tiêu không được ở quá khứ.");
      toast.error("Hạn mục tiêu không được ở quá khứ.");
      return;
    }
    try {
      await createGoal({
        title: cTitle.trim(),
        targetAmount: target,
        dueDate: parsedDue.toISOString(),
        linkedJarId: cJar === "__none__" ? null : cJar,
        note: cNote.trim() || null,
      });
      toast.success("Đã tạo mục tiêu");
      setCreateOpen(false);
    } catch (err) {
      const apiError = parseApiError(err, "Không tạo được mục tiêu.");
      if (apiError.field === "dueDate") setCDueError(apiError.message);
      toast.error(apiError.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListItem) return;
    const target = Number(eTarget);
    if (!eTitle.trim()) return;
    if (!Number.isFinite(target) || target <= 0) {
      toast.error("Mục tiêu tiền phải lớn hơn 0.");
      return;
    }
    const parsedDue = new Date(eDue);
    setEDueError(null);
    if (Number.isNaN(parsedDue.getTime())) {
      setEDueError("Hạn không hợp lệ.");
      toast.error("Hạn không hợp lệ.");
      return;
    }
    if (parsedDue < startOfToday()) {
      setEDueError("Hạn mục tiêu không được ở quá khứ.");
      toast.error("Hạn mục tiêu không được ở quá khứ.");
      return;
    }
    try {
      await updateGoal({
        id: editListItem.id,
        payload: {
          title: eTitle.trim(),
          targetAmount: target,
          dueDate: parsedDue.toISOString(),
          linkedJarId: eJar === "__none__" ? null : eJar,
          note: eNote.trim() || null,
        },
      });
      toast.success("Đã cập nhật mục tiêu");
      setEditListItem(null);
    } catch (err) {
      const apiError = parseApiError(err, "Không cập nhật được mục tiêu.");
      if (apiError.field === "dueDate") setEDueError(apiError.message);
      toast.error(apiError.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGoal(deleteId);
      toast.success("Đã hủy mục tiêu");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không hủy được.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-violet-600/80">Đang tải mục tiêu...</p>
    );
  }
  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">Không tải được danh sách mục tiêu.</p>
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
              Tiết kiệm có đích
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">Mục tiêu</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Gắn một{" "}
              <Link
                to={ROUTES.JARS}
                className="font-medium text-[#6366F1] underline-offset-2 hover:underline"
              >
                hũ tiết kiệm
              </Link>{" "}
              với mục tiêu: tiến độ &quot;đã tiết kiệm&quot; lấy theo{" "}
              <strong>số dư hũ đó</strong> (giao dịch vào hũ = tiến gần mục tiêu).
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
              onClick={openCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo mục tiêu
            </Button>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200/80 bg-white/80 text-[#6366F1] shadow-sm shadow-violet-500/10">
              <Target className="h-6 w-6" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["all", "Tất cả"],
          ["Active", "Đang làm"],
          ["Completed", "Đã hoàn thành"],
        ].map(([value, label]) => (
          <Button
            key={value}
            type="button"
            variant={statusFilter === value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              setStatusFilter(value as "all" | "Active" | "Completed")
            }
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleGoals.length === 0 ? (
          <Card className="border-dashed border-violet-200/80 bg-violet-50/30 shadow-none md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-slate-600">
              <Target className="mx-auto mb-3 h-10 w-10 text-violet-300" />
              <p>Chưa có mục tiêu phù hợp.</p>
              <Button
                type="button"
                className="mt-4 cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
                onClick={openCreate}
              >
                Tạo mục tiêu đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          visibleGoals.map((goal) => (
            <Card
              key={goal.id}
              className="border-violet-200/80 bg-white/80 shadow-none backdrop-blur-sm transition hover:border-violet-300 hover:shadow-sm hover:shadow-violet-500/10"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base text-[#0f172a]">
                      {goal.title}
                    </CardTitle>
                    <CardDescription>
                      Gợi ý / tháng:{" "}
                      <span className="font-medium text-[#6366F1]">
                        {formatCurrency(goal.suggestedMonthlyContribution)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 border-violet-200/80 px-2 hover:bg-violet-50 hover:text-[#4F46E5]"
                      onClick={() => void openEdit(goal)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 border-violet-200/80 px-2 text-red-600 hover:border-red-200 hover:bg-red-50"
                      onClick={() => setDeleteId(goal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {goal.linkedJarId && goal.linkedJarName ? (
                  <p className="flex flex-wrap items-center gap-1.5 text-slate-700">
                    <PiggyBank className="h-4 w-4 shrink-0 text-[#6366F1]" />
                    <span>Tiết kiệm qua hũ</span>
                    <Link
                      to={ROUTES.JARS}
                      className="font-semibold text-[#6366F1] underline-offset-2 hover:underline"
                    >
                      {goal.linkedJarName}
                    </Link>
                  </p>
                ) : (
                  <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                    Chưa gắn hũ — &quot;Đã tiết kiệm&quot; đang là 0₫. Chọn hũ khi{" "}
                    <button
                      type="button"
                      className="font-semibold underline-offset-2 hover:underline"
                      onClick={() => void openEdit(goal)}
                    >
                      sửa mục tiêu
                    </button>{" "}
                    để đồng bộ với số dư hũ.
                  </p>
                )}
                <p className="text-slate-600">
                  Đã tiết kiệm:{" "}
                  <span className="font-semibold text-[#6366F1]">
                    {formatCurrency(goal.savedAmount)}
                  </span>{" "}
                  /{" "}
                  <span className="font-medium text-slate-800">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100/80">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all"
                    style={{
                      width: `${Math.min(100, goal.progressPercentage)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-[#6366F1]">
                    {goal.progressPercentage.toFixed(1)}%
                  </span>
                  {" · "}
                  Hạn: {formatDue(goal.dueDate)} · {goal.status}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Tạo mục tiêu</DialogTitle>
              <DialogDescription>
                Hũ tùy chọn: nếu có, tiến độ theo số dư hũ đó.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="g-c-title">Tên mục tiêu</Label>
                <Input
                  id="g-c-title"
                  value={cTitle}
                  onChange={(ev) => setCTitle(ev.target.value)}
                  placeholder="Du lịch Nhật"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="g-c-target">Số tiền mục tiêu (VND)</Label>
                <Input
                  id="g-c-target"
                  inputMode="numeric"
                  value={cTarget}
                  onChange={(ev) => setCTarget(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="g-c-due">Hạn (ngày giờ)</Label>
                <Input
                  id="g-c-due"
                  type="datetime-local"
                  min={todayInputMin()}
                  value={cDue}
                  onChange={(ev) => setCDue(ev.target.value)}
                />
                {cDueError ? (
                  <p className="text-sm text-red-500">{cDueError}</p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label>Hũ tiết kiệm (tùy chọn)</Label>
                <Select value={cJar} onValueChange={setCJar}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Không gắn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Không gắn hũ</SelectItem>
                    {jars.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.name} ({formatCurrency(j.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="g-c-note">Ghi chú</Label>
                <Input
                  id="g-c-note"
                  value={cNote}
                  onChange={(ev) => setCNote(ev.target.value)}
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
                className="cursor-pointer bg-[#6366F1]"
                disabled={creating}
              >
                {creating ? "Đang lưu..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editListItem !== null}
        onOpenChange={(o) => !o && setEditListItem(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Sửa mục tiêu</DialogTitle>
              <DialogDescription>
                Đổi hũ sẽ làm tiến độ bám theo số dư hũ mới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên</Label>
                <Input
                  value={eTitle}
                  onChange={(ev) => setETitle(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Số tiền mục tiêu (VND)</Label>
                <Input
                  inputMode="numeric"
                  value={eTarget}
                  onChange={(ev) => setETarget(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Hạn</Label>
                <Input
                  type="datetime-local"
                  min={todayInputMin()}
                  value={eDue}
                  onChange={(ev) => setEDue(ev.target.value)}
                />
                {eDueError ? (
                  <p className="text-sm text-red-500">{eDueError}</p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label>Hũ tiết kiệm</Label>
                <Select value={eJar} onValueChange={setEJar}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Không gắn hũ</SelectItem>
                    {jars.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.name} ({formatCurrency(j.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Ghi chú</Label>
                <Input
                  value={eNote}
                  onChange={(ev) => setENote(ev.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setEditListItem(null)}
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
            <AlertDialogTitle>Hủy mục tiêu?</AlertDialogTitle>
            <AlertDialogDescription>
              Trạng thái sẽ chuyển sang đã hủy trên server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Không</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-red-600 hover:bg-red-700"
              onClick={() => void confirmDelete()}
              disabled={deleting}
            >
              {deleting ? "..." : "Hủy mục tiêu"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
