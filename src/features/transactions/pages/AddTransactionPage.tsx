import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ScheduleDateTimePicker } from "@/shared/components/ScheduleDateTimePicker";
import { ROUTES } from "@/shared/constants";
import { useFinancialAccounts } from "@/features/financial-accounts";
import { useUserCategories } from "@/features/categories";
import { useJars } from "@/features/jars/hooks/useJars";
import { useCreateTransaction } from "../hooks/useTransactions";
import type { TransactionType } from "../types";

type TransferMode = "jarToJar" | "accountToJar" | "jarToAccount";

export function AddTransactionPage() {
  const navigate = useNavigate();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const { data: accounts = [], isLoading: loadingAccounts } =
    useFinancialAccounts();
  const { data: categories = [], isLoading: loadingCategories } =
    useUserCategories();
  const { data: jars = [], isLoading: loadingJars } = useJars();

  const manualAccounts = useMemo(
    () => accounts.filter((a) => a.connectionMode === "Manual" && a.isActive),
    [accounts],
  );

  const [type, setType] = useState<TransactionType>("Expense");
  const [transferMode, setTransferMode] = useState<TransferMode>("jarToJar");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [fromJarId, setFromJarId] = useState("");
  const [toJarId, setToJarId] = useState("");
  /** Chuỗi local `yyyy-MM-ddTHH:mm` — khớp `ScheduleDateTimePicker`. */
  const [dateLocal, setDateLocal] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [formError, setFormError] = useState<string | null>(null);

  const loadingDeps = loadingAccounts || loadingCategories || loadingJars;

  const validateAndBuild = (): {
    type: TransactionType;
    amount: number;
    note?: string;
    categoryId?: string | null;
    financialAccountId?: string | null;
    fromJarId?: string | null;
    toJarId?: string | null;
    date: string;
  } | null => {
    setFormError(null);
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      setFormError("Số tiền phải lớn hơn 0.");
      return null;
    }

    if (!dateLocal?.trim()) {
      setFormError("Chọn thời gian giao dịch.");
      return null;
    }
    const parsedAt = new Date(dateLocal);
    if (Number.isNaN(parsedAt.getTime())) {
      setFormError("Thời gian giao dịch không hợp lệ.");
      return null;
    }
    const dateIso = parsedAt.toISOString();
    const cat = categoryId || null;
    const noteTrim = note.trim() || undefined;

    if (type === "Expense") {
      if (!fromJarId) {
        setFormError("Chi tiêu: chọn hũ nguồn (fromJarId).");
        return null;
      }
      return {
        type: "Expense",
        amount: num,
        note: noteTrim,
        categoryId: cat,
        fromJarId,
        toJarId: null,
        financialAccountId: null,
        date: dateIso,
      };
    }

    if (type === "Income") {
      if (!financialAccountId) {
        setFormError("Thu nhập: chọn tài khoản tiền (chỉ tài khoản thủ công).");
        return null;
      }
      return {
        type: "Income",
        amount: num,
        note: noteTrim,
        categoryId: cat,
        financialAccountId,
        fromJarId: null,
        toJarId: null,
        date: dateIso,
      };
    }

    if (type === "Transfer") {
      if (transferMode === "jarToJar") {
        if (!fromJarId || !toJarId) {
          setFormError("Chuyển hũ → hũ: chọn cả hũ nguồn và hũ đích.");
          return null;
        }
        if (fromJarId === toJarId) {
          setFormError("Hũ nguồn và đích phải khác nhau.");
          return null;
        }
        return {
          type: "Transfer",
          amount: num,
          note: noteTrim,
          categoryId: cat,
          fromJarId,
          toJarId,
          financialAccountId: null,
          date: dateIso,
        };
      }
      if (transferMode === "accountToJar") {
        if (!financialAccountId || !toJarId) {
          setFormError("Chuyển tài khoản → hũ: chọn tài khoản và hũ đích.");
          return null;
        }
        return {
          type: "Transfer",
          amount: num,
          note: noteTrim,
          categoryId: cat,
          financialAccountId,
          toJarId,
          fromJarId: null,
          date: dateIso,
        };
      }
      if (!fromJarId || !financialAccountId) {
        setFormError("Chuyển hũ → tài khoản: chọn hũ nguồn và tài khoản đích.");
        return null;
      }
      return {
        type: "Transfer",
        amount: num,
        note: noteTrim,
        categoryId: cat,
        fromJarId,
        financialAccountId,
        toJarId: null,
        date: dateIso,
      };
    }

    setFormError("Loại giao dịch không hợp lệ.");
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = validateAndBuild();
    if (!payload) return;
    try {
      await createTransaction(payload);
      navigate(ROUTES.TRANSACTIONS, { replace: true });
    } catch (e) {
      setFormError((e as Error)?.message ?? "Không tạo được giao dịch.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">Thêm giao dịch</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ghi nhận thu nhập, chi tiêu từ hũ hoặc chuyển khoản giữa hũ và tài khoản.
        </p>
      </div>

      <Card className="w-full border-[#d7def5] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0f172a]">
            Tạo giao dịch thủ công
          </CardTitle>
          <CardDescription>
            Điền thông tin giao dịch và lưu lại. Giao dịch sẽ được ghi nhận ngay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <select
                id="type"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as TransactionType)
                }
              >
                <option value="Expense">Chi tiêu (Expense)</option>
                <option value="Income">Thu nhập (Income)</option>
                <option value="Transfer">Chuyển (Transfer)</option>
              </select>
            </div>

            {type === "Transfer" ? (
              <div className="space-y-2">
                <Label htmlFor="transferMode">Kiểu chuyển</Label>
                <select
                  id="transferMode"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={transferMode}
                  onChange={(event) =>
                    setTransferMode(event.target.value as TransferMode)
                  }
                >
                  <option value="jarToJar">Hũ → Hũ</option>
                  <option value="accountToJar">Tài khoản → Hũ</option>
                  <option value="jarToAccount">Hũ → Tài khoản</option>
                </select>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (transactionsAmount)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Thời gian giao dịch</Label>
                <ScheduleDateTimePicker
                  id="date"
                  value={dateLocal}
                  onChange={setDateLocal}
                  disablePast={false}
                  allowClear={false}
                  className="max-w-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục (categoryId — tuỳ chọn)</Label>
              <select
                id="category"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={loadingDeps}
              >
                <option value="">— Không chọn —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.kind === "default" ? `[Mặc định] ` : ""}
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {type === "Expense" ? (
              <div className="space-y-2">
                <Label htmlFor="fromJar">Hũ nguồn (fromJarId)</Label>
                <select
                  id="fromJar"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={fromJarId}
                  onChange={(event) => setFromJarId(event.target.value)}
                  required
                  disabled={loadingDeps}
                >
                  <option value="">— Chọn hũ —</option>
                  {jars.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.status})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {type === "Income" ? (
              <div className="space-y-2">
                <Label htmlFor="account">
                  Tài khoản tiền (financialAccountId)
                </Label>
                <select
                  id="account"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  value={financialAccountId}
                  onChange={(event) =>
                    setFinancialAccountId(event.target.value)
                  }
                  required
                  disabled={loadingDeps}
                >
                  <option value="">— Chọn tài khoản (Manual) —</option>
                  {manualAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.accountType}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Backend từ chối tài khoản liên kết ngân hàng (LinkedApi) cho
                  giao dịch tay.
                </p>
              </div>
            ) : null}

            {type === "Transfer" && transferMode === "jarToJar" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromJarT">Hũ nguồn (fromJarId)</Label>
                  <select
                    id="fromJarT"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={fromJarId}
                    onChange={(event) => setFromJarId(event.target.value)}
                    disabled={loadingDeps}
                  >
                    <option value="">— Chọn —</option>
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toJarT">Hũ đích (toJarId)</Label>
                  <select
                    id="toJarT"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={toJarId}
                    onChange={(event) => setToJarId(event.target.value)}
                    disabled={loadingDeps}
                  >
                    <option value="">— Chọn —</option>
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {type === "Transfer" && transferMode === "accountToJar" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="faAj">Tài khoản (financialAccountId)</Label>
                  <select
                    id="faAj"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={financialAccountId}
                    onChange={(event) =>
                      setFinancialAccountId(event.target.value)
                    }
                    disabled={loadingDeps}
                  >
                    <option value="">— Manual —</option>
                    {manualAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toJarAj">Hũ đích (toJarId)</Label>
                  <select
                    id="toJarAj"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={toJarId}
                    onChange={(event) => setToJarId(event.target.value)}
                    disabled={loadingDeps}
                  >
                    <option value="">— Chọn hũ —</option>
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {type === "Transfer" && transferMode === "jarToAccount" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromJarJa">Hũ nguồn (fromJarId)</Label>
                  <select
                    id="fromJarJa"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={fromJarId}
                    onChange={(event) => setFromJarId(event.target.value)}
                    disabled={loadingDeps}
                  >
                    <option value="">— Chọn hũ —</option>
                    {jars.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faJa">
                    Tài khoản đích (financialAccountId)
                  </Label>
                  <select
                    id="faJa"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={financialAccountId}
                    onChange={(event) =>
                      setFinancialAccountId(event.target.value)
                    }
                    disabled={loadingDeps}
                  >
                    <option value="">— Manual —</option>
                    {manualAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (note)</Label>
              <Input
                id="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            {formError ? (
              <p className="text-sm text-red-500">{formError}</p>
            ) : null}

            <Button
              type="submit"
              className="bg-[#6366F1] text-white hover:bg-[#4F46E5]"
              disabled={isPending || loadingDeps}
            >
              {isPending
                ? "Đang lưu…"
                : loadingDeps
                  ? "Đang tải danh sách…"
                  : "Lưu giao dịch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
