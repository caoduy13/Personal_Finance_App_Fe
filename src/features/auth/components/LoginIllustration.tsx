export type LoginIllustrationState = "normal" | "password-hidden" | "password-visible";

const IMAGES: Record<LoginIllustrationState, string> = {
  normal: "/login/normal.png",
  "password-hidden": "/login/password-hidden.png",
  "password-visible": "/login/password-visible.png",
};

const ALT: Record<LoginIllustrationState, string> = {
  normal: "Chào mừng đăng nhập",
  "password-hidden": "Đang nhập mật khẩu",
  "password-visible": "Đang hiển thị mật khẩu",
};

type LoginIllustrationProps = {
  state: LoginIllustrationState;
};

export function LoginIllustration({ state }: LoginIllustrationProps) {
  return (
    <div className="mb-2 overflow-hidden rounded-xl border-2 border-[#0a0a0a] bg-[#f5f0e8] shadow-[3px_3px_0_0_#0a0a0a]">
      <img
        key={state}
        src={IMAGES[state]}
        alt={ALT[state]}
        className="block h-auto w-full object-contain transition-opacity duration-200"
        draggable={false}
      />
    </div>
  );
}
