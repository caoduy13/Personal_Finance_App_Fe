import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  useCreateUserCategory,
  useDeleteUserCategory,
  useUpdateUserCategory,
} from "../hooks/useCategoryMutations";
import { useUserCategoriesGrouped } from "../hooks/useUserCategoriesGrouped";
import type { UserCategoryOption } from "../types";

export function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useUserCategoriesGrouped();
  const { mutateAsync: createCat, isPending: creating } = useCreateUserCategory();
  const { mutateAsync: updateCat, isPending: updating } = useUpdateUserCategory();
  const { mutateAsync: deleteCat, isPending: deleting } = useDeleteUserCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<UserCategoryOption | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [cName, setCName] = useState("");
  const [cIcon, setCIcon] = useState("");
  const [cColor, setCColor] = useState("");

  const [eName, setEName] = useState("");
  const [eIcon, setEIcon] = useState("");
  const [eColor, setEColor] = useState("");

  const openCreate = () => {
    setCName("");
    setCIcon("");
    setCColor("");
    setCreateOpen(true);
  };

  const openEdit = (c: UserCategoryOption) => {
    setEditItem(c);
    setEName(c.name);
    setEIcon(c.icon ?? "");
    setEColor(c.color ?? "");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;
    try {
      await createCat({
        name: cName.trim(),
        icon: cIcon.trim() || null,
        color: cColor.trim() || null,
      });
      toast.success("Đã tạo danh mục");
      setCreateOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tạo được.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !eName.trim()) return;
    try {
      await updateCat({
        id: editItem.id,
        payload: {
          name: eName.trim(),
          icon: eIcon.trim() || null,
          color: eColor.trim() || null,
        },
      });
      toast.success("Đã cập nhật danh mục");
      setEditItem(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không cập nhật được.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCat(deleteId);
      toast.success("Đã xóa danh mục");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không xóa được.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-violet-600/80">Đang tải danh mục...</p>
    );
  }
  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">Không tải được danh mục.</p>
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
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-indigo-50/90 px-5 py-6 shadow-sm sm:px-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
              Phân loại
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">
              Danh mục
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Danh mục hệ thống (chỉ xem) và danh mục của bạn (tạo / sửa / xóa).
            </p>
          </div>
          <Button
            type="button"
            className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
            onClick={openCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo danh mục
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#6366F1]">
          Danh mục mặc định
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.defaultCategories.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có danh mục mặc định.</p>
          ) : (
            data.defaultCategories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-full border border-violet-200/90 bg-white/90 px-3 py-1 text-sm text-slate-700 shadow-sm shadow-violet-500/5"
              >
                {c.name}
              </span>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#6366F1]">
          Danh mục của bạn
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.customCategories.length === 0 ? (
            <p className="text-sm text-slate-500 sm:col-span-2">
              Chưa có danh mục tùy chỉnh.
            </p>
          ) : (
            data.customCategories.map((c) => (
              <Card
                key={c.id}
                className="border-violet-200/80 bg-white/80 shadow-none backdrop-blur-sm transition hover:border-violet-300 hover:shadow-sm hover:shadow-violet-500/10"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[#0f172a]">{c.name}</CardTitle>
                  <CardDescription>
                    {[c.icon && `Icon: ${c.icon}`, c.color && `Màu: ${c.color}`]
                      .filter(Boolean)
                      .join(" · ") || "Không mô tả thêm"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-violet-200/80 hover:bg-violet-50 hover:text-[#4F46E5]"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-violet-200/80 text-red-600 hover:border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Xóa
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Tạo danh mục</DialogTitle>
              <DialogDescription>Tên bắt buộc; icon và màu tùy chọn.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cc-name">Tên</Label>
                <Input
                  id="cc-name"
                  value={cName}
                  onChange={(ev) => setCName(ev.target.value)}
                  placeholder="Ví dụ: Ăn ngoài"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cc-icon">Icon (tùy chọn)</Label>
                <Input
                  id="cc-icon"
                  value={cIcon}
                  onChange={(ev) => setCIcon(ev.target.value)}
                  placeholder="shopping"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cc-color">Màu (tùy chọn)</Label>
                <Input
                  id="cc-color"
                  value={cColor}
                  onChange={(ev) => setCColor(ev.target.value)}
                  placeholder="#6366F1"
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
                {creating ? "Đang lưu..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Sửa danh mục</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ee-name">Tên</Label>
                <Input
                  id="ee-name"
                  value={eName}
                  onChange={(ev) => setEName(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ee-icon">Icon</Label>
                <Input
                  id="ee-icon"
                  value={eIcon}
                  onChange={(ev) => setEIcon(ev.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ee-color">Màu</Label>
                <Input
                  id="ee-color"
                  value={eColor}
                  onChange={(ev) => setEColor(ev.target.value)}
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
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Các giao dịch đang dùng danh mục này có thể bị ảnh hưởng. Tiếp tục?
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
