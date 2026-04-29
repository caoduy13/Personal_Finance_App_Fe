import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { loginSchema, type LoginFormData } from "../schema";
import { useLoginMutation } from "../hooks/useAuth";

export function LoginForm() {
  const { mutate: login, isPending, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "anh@finjar.app",
      password: "123456",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="mb-1.5 inline-block text-xs uppercase tracking-wider text-slate-600">
          Địa chỉ email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-300"
          placeholder="ten@email.com"
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-red-400">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="mb-1.5 inline-block text-xs uppercase tracking-wider text-slate-600">
          Mật khẩu
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-300"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-red-400">{errors.password.message}</p> : null}
      </div>

      {error ? <p className="text-sm text-red-400">{error.message}</p> : null}

      <Button
        type="submit"
        className="h-11 w-full bg-black text-white hover:bg-slate-900"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span>{isPending ? "Đang đăng nhập..." : "Đăng nhập"}</span>
      </Button>
    </form>
  );
}
