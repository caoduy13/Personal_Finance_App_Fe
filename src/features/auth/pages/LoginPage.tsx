import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { AuthPageShell } from "@/shared/components/layout/AuthPageShell";
import { LoginForm } from "../components/LoginForm";
import {
  LoginIllustration,
  type LoginIllustrationState,
} from "../components/LoginIllustration";

export function LoginPage() {
  const [illustrationState, setIllustrationState] =
    useState<LoginIllustrationState>("normal");

  return (
    <AuthPageShell
      title="Đăng nhập"
      description="Đăng nhập để truy cập ví của bạn."
      illustration={<LoginIllustration state={illustrationState} />}
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-extrabold text-[#0a0a0a] underline"
          >
            Tạo tài khoản
          </Link>
        </>
      }
    >
      <LoginForm onIllustrationStateChange={setIllustrationState} />
    </AuthPageShell>
  );
}
