import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1fb] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border-2 border-[#6366F1] bg-[#e9edfa] p-3">
        <Card className="border border-[#d7def5] bg-[#f3f6ff] text-slate-900 shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0f172a] text-[#6366F1]">
              <span className="text-lg font-bold">F</span>
            </div>
            <CardTitle className="text-2xl font-semibold text-[#0f172a]">Đăng nhập</CardTitle>
            <CardDescription className="text-slate-500">
              Nhập thông tin đăng nhập để truy cập ví của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="pt-4 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.REGISTER} className="font-semibold text-[#6366F1] hover:underline">
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
}
