import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { registerSchema, type RegisterFormData } from "../schema";
import { useRegisterMutation } from "../hooks/useAuth";

export function RegisterForm() {
  const { mutate: registerUser, isPending, error } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="mb-1.5 inline-block text-sm font-medium text-slate-700"
        >
          Tên đăng nhập
        </Label>
        <Input
          id="username"
          type="text"
          className="h-11 rounded-md border-[#cdd5ee] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#6366F1]/40"
          placeholder="tên_đăng_nhập"
          {...register("username")}
        />
        {errors.username ? (
          <p className="text-sm text-red-400">{errors.username.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="fullName"
          className="mb-1.5 inline-block text-sm font-medium text-slate-700"
        >
          Họ và tên
        </Label>
        <Input
          id="fullName"
          type="text"
          className="h-11 rounded-md border-[#cdd5ee] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#6366F1]/40"
          placeholder="Nguyen Van A"
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="text-sm text-red-400">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="registerEmail"
          className="mb-1.5 inline-block text-sm font-medium text-slate-700"
        >
          Địa chỉ email
        </Label>
        <Input
          id="registerEmail"
          type="email"
          autoComplete="email"
          className="h-11 rounded-md border-[#cdd5ee] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#6366F1]/40"
          placeholder="ten@email.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="registerPassword"
          className="mb-1.5 inline-block text-sm font-medium text-slate-700"
        >
          Mật khẩu
        </Label>
        <Input
          id="registerPassword"
          type="password"
          autoComplete="new-password"
          className="h-11 rounded-md border-[#cdd5ee] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#6366F1]/40"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="mb-1.5 inline-block text-sm font-medium text-slate-700"
        >
          Xác nhận mật khẩu
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-11 rounded-md border-[#cdd5ee] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#6366F1]/40"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-red-400">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-400">{error.message}</p> : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-md bg-[#0f172a] text-white hover:bg-[#111827]"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span>{isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}</span>
      </Button>
    </form>
  );
}
