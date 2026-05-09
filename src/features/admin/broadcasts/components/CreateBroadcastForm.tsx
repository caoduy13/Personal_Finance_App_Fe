import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateBroadcast } from "../hooks/useAdminBroadcasts";

const schema = z.object({
  title: z.string().min(1, "Nhập tiêu đề"),
  body: z.string().min(1, "Nhập nội dung"),
  targetAudience: z.string().min(1, "Nhập đối tượng"),
  scheduledAtLocal: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateBroadcastForm() {
  const createMutation = useCreateBroadcast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      body: "",
      targetAudience: "All",
      scheduledAtLocal: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const scheduledAt =
      values.scheduledAtLocal && values.scheduledAtLocal.trim() !== ""
        ? new Date(values.scheduledAtLocal).toISOString()
        : null;

    try {
      await createMutation.mutateAsync({
        title: values.title.trim(),
        body: values.body.trim(),
        targetAudience: values.targetAudience.trim(),
        scheduledAt,
      });
      toast.success(
        scheduledAt
          ? "Đã lên lịch broadcast."
          : "Đã gửi broadcast tới người dùng.",
      );
      reset({
        title: "",
        body: "",
        targetAudience: "All",
        scheduledAtLocal: "",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không tạo được broadcast.";
      toast.error(message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="broadcast-title">Tiêu đề</Label>
        <Input
          id="broadcast-title"
          placeholder="Ví dụ: Bảo trì hệ thống đêm mai"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="broadcast-body">Nội dung</Label>
        <textarea
          id="broadcast-body"
          rows={4}
          className={cn(
            "flex min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
          )}
          placeholder="Nội dung thông báo gửi tới người dùng"
          aria-invalid={!!errors.body}
          {...register("body")}
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="broadcast-audience">Đối tượng</Label>
        <Input
          id="broadcast-audience"
          placeholder="All"
          aria-invalid={!!errors.targetAudience}
          {...register("targetAudience")}
        />
        {errors.targetAudience && (
          <p className="text-sm text-red-500">
            {errors.targetAudience.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Nhãn mô tả đối tượng; backend MVP thường dùng All.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="broadcast-schedule">Lên lịch (tùy chọn)</Label>
        <Input
          id="broadcast-schedule"
          type="datetime-local"
          {...register("scheduledAtLocal")}
        />
        <p className="text-xs text-muted-foreground">
          Để trống để gửi ngay (theo logic backend).
        </p>
      </div>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Đang gửi…" : "Tạo broadcast"}
      </Button>
    </form>
  );
}
