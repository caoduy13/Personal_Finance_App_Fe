import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
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
import { importService } from "../services";

export function OcrImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [layout, setLayout] = useState("");
  const [runOcr, setRunOcr] = useState(true);
  const [pending, setPending] = useState(false);
  const [resultJson, setResultJson] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Chọn ảnh hóa đơn.");
      return;
    }
    setPending(true);
    setResultJson(null);
    try {
      const res = await importService.uploadReceiptImage(file, {
        layout: layout.trim() || undefined,
        runOcr,
      });
      setResultJson(JSON.stringify(res, null, 2));
      toast.success("Đã tải lên");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải lên thất bại.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">OCR hóa đơn</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tải ảnh để BE chạy OCR (tùy cấu hình server). Kết quả hiển thị bên dưới.
        </p>
      </div>

      <Card className="border-[#d7def5] shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Tải ảnh</CardTitle>
          <CardDescription>
            Định dạng thường dùng: JPG, PNG. Kích thước tối đa tùy server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="ocr-file">File</Label>
              <Input
                id="ocr-file"
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={(ev) => {
                  const f = ev.target.files?.[0];
                  setFile(f ?? null);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ocr-layout">Layout (tùy chọn)</Label>
              <Input
                id="ocr-layout"
                value={layout}
                onChange={(ev) => setLayout(ev.target.value)}
                placeholder="Để trống nếu không cần"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={runOcr}
                onChange={(ev) => setRunOcr(ev.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Chạy OCR
            </label>
            <Button
              type="submit"
              className="cursor-pointer bg-[#6366F1]"
              disabled={pending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {pending ? "Đang gửi..." : "Gửi ảnh"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {resultJson ? (
        <Card className="border-[#d7def5] shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Phản hồi API</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
              {resultJson}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
