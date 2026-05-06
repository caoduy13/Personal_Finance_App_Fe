import { cn } from "@/lib/utils";
import { getInitials } from "../lib/formatters";

interface UserAvatarProps {
  fullName: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  fullName,
  avatarUrl,
  isAdmin = false,
  size = "md",
  className,
}: UserAvatarProps) {
  const sizeClass =
    size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-20 w-20 text-2xl" : "h-10 w-10 text-sm";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={cn("shrink-0 rounded-full object-cover", sizeClass, className)}
      />
    );
  }

  const initials = getInitials(fullName);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeClass,
        isAdmin ? "bg-destructive" : "bg-info",
        className,
      )}
    >
      {initials}
    </span>
  );
}
