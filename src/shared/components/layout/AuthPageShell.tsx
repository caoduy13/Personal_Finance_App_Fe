import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/shared/constants/routes";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  illustration?: ReactNode;
};

export function AuthPageShell({
  title,
  description,
  children,
  footer,
  illustration,
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        "brutal-auth flex min-h-screen items-center justify-center px-4",
        illustration ? "py-3 sm:py-4" : "py-10",
      )}
    >
      <div className="w-full max-w-md">
        <div
          className={cn(
            "brutal-card border-0",
            illustration ? "p-4 sm:p-5" : "p-6 sm:p-8",
          )}
        >
          {illustration ?? (
            <Link
              to={ROUTES.ROOT}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#0a0a0a] bg-[#a8e087] text-lg font-extrabold shadow-[3px_3px_0_0_#0a0a0a]"
            >
              F
            </Link>
          )}
          <h1
            className={cn(
              "text-center font-extrabold tracking-tight",
              illustration ? "text-xl" : "text-2xl",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "text-center font-medium text-neutral-600",
              illustration
                ? "mt-0.5 text-xs leading-snug"
                : "mt-2 text-sm",
            )}
          >
            {description}
          </p>
          <div className={illustration ? "mt-3" : "mt-6"}>{children}</div>
        </div>
        <div
          className={cn(
            "text-center font-medium text-neutral-600",
            illustration ? "pt-2 text-xs" : "pt-4 text-sm",
          )}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
