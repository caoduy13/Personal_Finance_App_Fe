import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eeeff8] px-4 py-10">
      <div className="relative w-full max-w-md space-y-6">
        <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-black">
              <span className="text-lg font-bold">$</span>
            </div>
            <CardTitle className="text-2xl font-semibold">Đăng nhập</CardTitle>
            <CardDescription className="text-slate-500">
              Nhập thông tin đăng nhập để truy cập ví của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.REGISTER} className="font-semibold text-violet-600 hover:underline">
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
}
