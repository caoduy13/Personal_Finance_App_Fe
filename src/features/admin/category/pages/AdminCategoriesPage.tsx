import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAdminCategory } from "../hooks/useAdminCategory";

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={
        isActive
          ? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
          : "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function IconToken({ icon }: { icon: string }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border bg-white px-1 text-xs font-medium uppercase text-slate-600">
      {icon.slice(0, 2)}
    </span>
  );
}

export default function AdminCategoriesPage() {
  const { data, isLoading, isError } = useAdminCategory();

  if (isLoading) return <p className="text-sm text-muted-foreground">Đang tải danh mục...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Không thể tải danh mục mặc định.</p>;

  const categories = data.data;
  const activeCount = categories.filter((item) => item.isActive).length;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Admin Categories</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý danh mục mặc định cho người dùng mới.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Tổng danh mục</p>
            <p className="mt-1 text-2xl font-semibold">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Tạm ẩn</p>
            <p className="mt-1 text-2xl font-semibold text-slate-500">
              {categories.length - activeCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-md border bg-white p-3 text-sm md:grid-cols-[56px_1fr_120px_120px_100px]"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">#{item.order}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">{item.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full border border-slate-200"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.color}</span>
              </div>
              <div className="flex items-center">
                <IconToken icon={item.icon} />
              </div>
              <div className="flex items-center md:justify-end">
                <StatusBadge isActive={item.isActive} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
