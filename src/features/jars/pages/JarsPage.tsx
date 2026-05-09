import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCreateJar, useJars } from "../hooks/useJars";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function JarsPage() {
  const { data, isLoading, isError } = useJars();
  const { mutateAsync: createJar, isPending, isError: isCreateError, error: createError } = useCreateJar();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366F1");
  const [icon, setIcon] = useState("wallet");

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await createJar({
      name: name.trim(),
      color,
      icon: icon.trim() || "wallet",
    });
    setName("");
    setColor("#6366F1");
    setIcon("wallet");
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading jars...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load jars.</p>;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Jars</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Tạo hũ mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jar-name">Tên hũ</Label>
              <Input
                id="jar-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Du lịch"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jar-color">Màu</Label>
                <div className="flex gap-2">
                  <Input
                    id="jar-color"
                    type="color"
                    className="h-10 w-14 cursor-pointer p-1"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jar-icon">Icon (tên gợi ý)</Label>
                <Input
                  id="jar-icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="wallet, plane, home…"
                />
              </div>
            </div>
            {isCreateError ? (
              <p className="text-sm text-red-500">
                {(createError as Error)?.message ?? "Không tạo được hũ."}
              </p>
            ) : null}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang tạo…" : "Tạo hũ"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((jar) => (
          <Card key={jar.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full border border-slate-200"
                  style={{ backgroundColor: jar.color }}
                />
                {jar.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">Balance: {formatCurrency(jar.balance)}</p>
              <p className="text-sm text-muted-foreground">
                Allocation: {jar.percentage != null ? `${jar.percentage}%` : "—"}
              </p>
              <p className="text-sm text-muted-foreground">Status: {jar.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
