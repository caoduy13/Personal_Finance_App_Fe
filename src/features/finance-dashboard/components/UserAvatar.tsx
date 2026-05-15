import { cn } from "@/lib/utils";
import { AnimatedAvatar2D } from "./AnimatedAvatar2D";

type UserAvatarProps = {
  size?: "sm" | "md" | "lg";
  imageUrl: string | null;
  className?: string;
};

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 96,
} as const;

/** Ảnh tải lên hoặc avatar 2D mặc định + hiệu ứng nhẹ */
export function UserAvatar({ size = "md", imageUrl, className }: UserAvatarProps) {
  if (!imageUrl) {
    return <AnimatedAvatar2D size={size} className={className} />;
  }

  const px = sizeMap[size];

  return (
    <div
      className={cn(
        "avatar-upload relative shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-neutral-700",
        size === "lg" && "border-4 border-neutral-100 dark:border-neutral-800",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <img
        src={imageUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}
