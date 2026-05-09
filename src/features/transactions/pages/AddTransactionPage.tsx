import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryService } from "@/features/categories/services";
import { financialAccountService } from "@/features/financial-account/services";
import { jarService } from "@/features/jars/services";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants";
import { useCreateTransaction } from "../hooks/useTransactions";

export function AddTransactionPage() {
  const navigate = useNavigate();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [fromJarId, setFromJarId] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["financialAccounts"],
    queryFn: () => financialAccountService.list(),
  });

  const { data: jars = [] } = useQuery({
    queryKey: ["jars", "list"],
    queryFn: () => jarService.list(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    await createTransaction({
      type,
      amount: amt,
      note,
      categoryId: categoryId || null,
      financialAccountId:
        type === "Income" ? (financialAccountId || accounts[0]?.id || null) : null,
      fromJarId: type === "Expense" ? (fromJarId || jars[0]?.id || null) : null,
      date: new Date().toISOString(),
    });
    navigate(ROUTES.TRANSACTIONS, { replace: true });
  };

  return (
    <section className="mx-auto max-w-xl">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-700">
              Loại giao dịch
            </Label>
            <select
              id="type"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm"
              value={type}
              onChange={(event) => setType(event.target.value as "Income" | "Expense")}
            >
              <option value="Expense">Chi tiêu</option>
              <option value="Income">Thu nhập</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700">
              Số tiền (VND, dương)
            </Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step={1}
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-11 rounded-xl border-slate-200"
            />
          </div>
          {type === "Income" ? (
            <div className="space-y-2">
              <Label htmlFor="acc">Nguồn tiền</Label>
              <select
                id="acc"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={financialAccountId}
                onChange={(e) => setFinancialAccountId(e.target.value)}
              >
                <option value="">— Chọn —</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                    {a.isDefault ? " (mặc định)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="jar">Hũ chi</Label>
              <select
                id="jar"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={fromJarId}
                onChange={(e) => setFromJarId(e.target.value)}
              >
                <option value="">— Chọn —</option>
                {jars.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="cat">Danh mục (tuỳ chọn)</Label>
            <select
              id="cat"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— Không —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.isDefault ? " (mặc định)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note" className="text-slate-700">
              Ghi chú
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="VD: Cà phê, siêu thị…"
              className="h-11 rounded-xl border-slate-200"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full rounded-xl bg-[#FCD34D] font-semibold text-slate-900 hover:bg-[#FBBF24]"
          >
            {isPending ? "Đang lưu…" : "Lưu giao dịch"}
            {!isPending && <ArrowRight className="ml-2 size-4" />}
          </Button>
        </form>
      </div>
    </section>
  );
}
