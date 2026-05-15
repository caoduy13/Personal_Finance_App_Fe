import { useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileImage,
  ReceiptText,
  Save,
  Tags,
  Upload,
  WalletCards,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";
import { Button } from "@/shared/components/ui/button";
import { ScheduleDateTimePicker } from "@/shared/components/ScheduleDateTimePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useFinancialAccounts } from "@/features/financial-accounts";
import { useUserCategories } from "@/features/categories";
import { importService, type ImportImageResult } from "../services";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatMoney(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return "Chưa xác định";
  }
  return moneyFormatter.format(value);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Chưa xác định";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoFromLocalValue(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function resolveImageUrl(url?: string | null) {
  if (!url) {
    return null;
  }
  if (/^(https?:|blob:|data:)/i.test(url)) {
    return url;
  }
  if (url.startsWith("/")) {
    try {
      return new URL(url, apiClient.defaults.baseURL).toString();
    } catch {
      return url;
    }
  }
  return url;
}

function statusLabel(status?: string | null) {
  if (status === "AwaitingReview") return "Chờ rà soát";
  if (status === "Completed") return "Đã xác nhận";
  if (status === "Pending") return "Đã tải lên";
  if (status === "Failed") return "Lỗi OCR";
  if (status === "success") return "OCR xong";
  if (status === "uploaded") return "Đã tải lên";
  return status || "Chưa có kết quả";
}

function statusClassName(status?: string | null) {
  if (status === "Failed") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (status === "Pending" || status === "uploaded") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getDraftFormValues(result: ImportImageResult) {
  const transaction = result.preview?.transaction;
  const receipt = result.receipt;
  const amount =
    transaction?.amount ?? result.preview?.summary?.total ?? receipt?.totalAmount;

  return {
    amount: amount == null ? "" : String(amount),
    type: transaction?.type === "Income" ? "Income" : "Expense",
    dateLocal: toDateTimeLocalValue(
      transaction?.date ?? receipt?.transactionDate,
    ),
    categoryId:
      transaction?.suggestedCategoryId ?? receipt?.suggestedCategoryId ?? "",
    note: transaction?.note ?? "",
  } satisfies {
    amount: string;
    type: "Expense" | "Income";
    dateLocal: string;
    categoryId: string;
    note: string;
  };
}

export function OcrImportPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [pending, setPending] = useState(false);
  const [draftPending, setDraftPending] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [result, setResult] = useState<ImportImageResult | null>(null);
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null);
  const [draftAmount, setDraftAmount] = useState("");
  const [draftType, setDraftType] = useState<"Expense" | "Income">("Expense");
  const [draftDateLocal, setDraftDateLocal] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState("");
  const [draftNote, setDraftNote] = useState("");

  const { data: financialAccounts = [], isLoading: accountsLoading } =
    useFinancialAccounts();
  const { data: categories = [], isLoading: categoriesLoading } =
    useUserCategories();

  const activeAccounts = useMemo(
    () => financialAccounts.filter((account) => account.isActive),
    [financialAccounts],
  );

  const defaultFinancialAccountId =
    activeAccounts.find((account) => account.isDefault)?.id ??
    activeAccounts[0]?.id ??
    "";

  const selectedFinancialAccountId = activeAccounts.some(
    (account) => account.id === financialAccountId,
  )
    ? financialAccountId
    : defaultFinancialAccountId;

  const selectedAccount = useMemo(
    () =>
      activeAccounts.find(
        (account) => account.id === selectedFinancialAccountId,
      ),
    [activeAccounts, selectedFinancialAccountId],
  );

  const preview = result?.preview;
  const transaction = preview?.transaction;
  const receipt = result?.receipt;
  const warnings = preview?.warnings ?? receipt?.warnings ?? [];
  const items = preview?.items ?? [];
  const summary = preview?.summary;
  const imageUrl = resolveImageUrl(preview?.imageUrl);
  const merchantName =
    transaction?.merchantName || receipt?.merchantName || "Chưa nhận diện";
  const amount =
    transaction?.amount ?? summary?.total ?? receipt?.totalAmount ?? null;
  const transactionDate =
    transaction?.date ?? receipt?.transactionDate ?? null;
  const suggestedCategory =
    transaction?.suggestedCategoryName ?? receipt?.suggestedCategoryName;
  const matchedBy = transaction?.matchedBy ?? receipt?.categoryMatchedBy;
  const isCompleted = result?.status === "Completed" || Boolean(confirmedMessage);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Chọn ảnh hoặc PDF hóa đơn.");
      return;
    }
    if (!selectedFinancialAccountId) {
      toast.error("Chọn tài khoản nhận giao dịch.");
      return;
    }
    setPending(true);
    setResult(null);
    setConfirmedMessage(null);
    try {
      const res = await importService.uploadReceiptImage(file, {
        financialAccountId: selectedFinancialAccountId,
        bankCode: "",
        layout: "invoice",
        runOcr: true,
        includeDebug: false,
      });
      const draftValues = getDraftFormValues(res);
      setDraftAmount(draftValues.amount);
      setDraftType(draftValues.type);
      setDraftDateLocal(draftValues.dateLocal);
      setDraftCategoryId(draftValues.categoryId);
      setDraftNote(draftValues.note);
      setResult(res);
      toast.success(res.message || "Đã tải hóa đơn lên");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại.");
    } finally {
      setPending(false);
    }
  };

  const buildDraftPayload = () => {
    if (!result?.id) {
      toast.error("Không tìm thấy mã import job.");
      return null;
    }
    const amountValue = Number(draftAmount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      toast.error("Số tiền phải lớn hơn 0.");
      return null;
    }
    const transactionDate = toIsoFromLocalValue(draftDateLocal);
    if (!transactionDate) {
      toast.error("Chọn ngày giao dịch hợp lệ.");
      return null;
    }
    return {
      transactionDate,
      amount: amountValue,
      type: draftType,
      editedNote: draftNote.trim(),
      editedCategoryId: draftCategoryId || null,
      isValid: true,
      validationError: null,
    };
  };

  const handleUpdateDraft = async () => {
    const payload = buildDraftPayload();
    if (!payload || !result?.id) {
      return null;
    }
    setDraftPending(true);
    try {
      const draft = await importService.updateFirstDraft(result.id, payload);
      toast.success("Đã cập nhật bản nháp");
      return draft;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Cập nhật bản nháp thất bại.",
      );
      return null;
    } finally {
      setDraftPending(false);
    }
  };

  const handleConfirm = async (event: FormEvent) => {
    event.preventDefault();
    if (!result?.id) {
      toast.error("Không tìm thấy mã import job.");
      return;
    }
    if (!selectedFinancialAccountId) {
      toast.error("Chọn tài khoản để xác nhận giao dịch.");
      return;
    }
    setConfirmPending(true);
    try {
      const draft = await handleUpdateDraft();
      if (!draft) {
        return;
      }
      const confirmed = await importService.confirmImport(result.id, {
        financialAccountId: selectedFinancialAccountId,
      });
      setResult((current) =>
        current
          ? {
            ...current,
            status: confirmed.status,
            message: confirmed.message || "Import confirmed",
          }
          : current,
      );
      setConfirmedMessage(
        `${confirmed.message || "Import confirmed"} · ${confirmed.createdCount} giao dịch`,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["financial-accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      toast.success("Đã xác nhận và tạo giao dịch");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xác nhận thất bại.");
    } finally {
      setConfirmPending(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">OCR hóa đơn</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tải hóa đơn lên để tạo bản nháp giao dịch trước khi xác nhận.
        </p>
      </div>

      <Card className="border-[#d7def5] shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Tải hóa đơn</CardTitle>
          <CardDescription>
            Hỗ trợ ảnh và PDF, dùng layout invoice cho kết quả OCR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="ocr-file">File</Label>
              <Input
                id="ocr-file"
                type="file"
                accept="image/*,.pdf"
                className="cursor-pointer"
                onChange={(ev) => {
                  const nextFile = ev.target.files?.[0];
                  setFile(nextFile ?? null);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="financial-account">Tài khoản</Label>
              <Select
                value={selectedFinancialAccountId}
                onValueChange={setFinancialAccountId}
                disabled={accountsLoading || activeAccounts.length === 0}
              >
                <SelectTrigger id="financial-account">
                  <SelectValue
                    placeholder={
                      accountsLoading
                        ? "Đang tải tài khoản..."
                        : "Chọn FinancialAccount"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                      {account.isDefault ? " · Mặc định" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="h-10 cursor-pointer bg-[#6366F1] md:min-w-36"
              disabled={pending || accountsLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {pending ? "Đang gửi..." : "Gửi hóa đơn"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result ? (
        <Card className="border-[#d7def5] shadow-none">
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">Kết quả OCR</CardTitle>
              <CardDescription>
                {result.message || "Bản nháp giao dịch từ hóa đơn vừa tải lên."}
              </CardDescription>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${statusClassName(
                result.status ?? preview?.status,
              )}`}
            >
              {statusLabel(result.status ?? preview?.status)}
            </span>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-[minmax(260px,360px)_1fr]">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Hóa đơn đã tải lên"
                    className="max-h-[520px] w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 text-slate-400">
                    <FileImage className="h-10 w-10" />
                    <span className="text-sm">Không có ảnh xem trước</span>
                  </div>
                )}
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
                <div className="font-medium text-slate-900">
                  {result.originalFileName || file?.name || "Hóa đơn"}
                </div>
                <div>
                  {selectedAccount?.name || "Tài khoản đã chọn"}
                  {result.sizeInBytes
                    ? ` · ${(result.sizeInBytes / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <ReceiptText className="h-4 w-4" />
                    Đơn vị bán
                  </div>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {merchantName}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <WalletCards className="h-4 w-4" />
                    Tổng tiền
                  </div>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {formatMoney(amount)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Ngày giao dịch
                  </div>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {formatDate(transactionDate)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <Tags className="h-4 w-4" />
                    Danh mục
                  </div>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {suggestedCategory || "Chưa gợi ý"}
                  </p>
                  {matchedBy ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Khớp bởi {matchedBy}
                    </p>
                  ) : null}
                </div>
              </div>

              {items.length > 0 ? (
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                    Chi tiết hóa đơn
                  </div>
                  <div className="divide-y divide-slate-100">
                    {items.map((item, index) => (
                      <div
                        key={`${item.name ?? "item"}-${index}`}
                        className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm"
                      >
                        <span className="text-slate-700">
                          {item.name || `Mục ${index + 1}`}
                        </span>
                        <span className="font-medium text-slate-950">
                          {formatMoney(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {summary ? (
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tạm tính</span>
                      <span className="font-medium text-slate-900">
                        {formatMoney(summary.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Giảm giá</span>
                      <span className="font-medium text-slate-900">
                        {formatMoney(summary.discount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
                      <span className="font-medium text-slate-900">Tổng</span>
                      <span className="font-semibold text-slate-950">
                        {formatMoney(summary.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {transaction?.note ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {transaction.note}
                </div>
              ) : null}

              {warnings.length > 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    Cần kiểm tra
                  </div>
                  <ul className="space-y-1 text-sm text-amber-800">
                    {warnings.map((warning, index) => (
                      <li key={`${warning}-${index}`}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <form
                onSubmit={handleConfirm}
                className="rounded-md border border-slate-200 p-4"
              >
                <div className="mb-4 flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-slate-950">
                    Rà soát trước khi xác nhận
                  </h3>
                  <p className="text-sm text-slate-500">
                    Dữ liệu này sẽ được patch vào draft rồi mới tạo giao dịch.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="draft-amount">Số tiền</Label>
                    <Input
                      id="draft-amount"
                      type="number"
                      min="1"
                      step="1"
                      value={draftAmount}
                      disabled={isCompleted}
                      onChange={(event) => setDraftAmount(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-type">Loại giao dịch</Label>
                    <select
                      id="draft-type"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-[#6366F1]/50 focus-visible:ring-2 focus-visible:ring-[#6366F1]/25 disabled:cursor-not-allowed disabled:opacity-50"
                      value={draftType}
                      disabled={isCompleted}
                      onChange={(event) =>
                        setDraftType(event.target.value as "Expense" | "Income")
                      }
                    >
                      <option value="Expense">Chi tiêu</option>
                      <option value="Income">Thu nhập</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-date">Ngày giao dịch</Label>
                    <ScheduleDateTimePicker
                      id="draft-date"
                      value={draftDateLocal}
                      onChange={setDraftDateLocal}
                      disablePast={false}
                      allowClear={false}
                      className="max-w-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-category">Danh mục</Label>
                    <select
                      id="draft-category"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-[#6366F1]/50 focus-visible:ring-2 focus-visible:ring-[#6366F1]/25 disabled:cursor-not-allowed disabled:opacity-50"
                      value={draftCategoryId}
                      disabled={isCompleted || categoriesLoading}
                      onChange={(event) =>
                        setDraftCategoryId(event.target.value)
                      }
                    >
                      <option value="">Không chọn</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.kind === "default" ? "[Mặc định] " : ""}
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="draft-note">Ghi chú</Label>
                  <Input
                    id="draft-note"
                    value={draftNote}
                    disabled={isCompleted}
                    onChange={(event) => setDraftNote(event.target.value)}
                  />
                </div>

                {confirmedMessage ? (
                  <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {confirmedMessage}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isCompleted || draftPending || confirmPending}
                    onClick={() => void handleUpdateDraft()}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {draftPending ? "Đang cập nhật..." : "Cập nhật nháp"}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#6366F1] hover:bg-[#4F46E5]"
                    disabled={
                      isCompleted ||
                      draftPending ||
                      confirmPending ||
                      categoriesLoading
                    }
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {confirmPending ? "Đang xác nhận..." : "Xác nhận giao dịch"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
