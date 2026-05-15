import { cn } from "@/lib/utils";
type AnimatedAvatar2DProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 96,
} as const;

export function AnimatedAvatar2D({
  size = "md",
  className,
}: AnimatedAvatar2DProps) {
  const px = sizeMap[size];
  const isHappy = false;
  const isPro = false;

  return (
    <div
      className={cn(
        "avatar-2d relative shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700",
        isPro ? "bg-[#e8eef5]" : "bg-[#f5e6d3]",
        size === "lg" && "border-4 border-neutral-100 dark:border-neutral-800",
        className,
      )}
      style={{ width: px, height: px }}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPro ? (
          <path
            className="avatar-2d-hoodie"
            d="M10 70 L50 55 L90 70 L95 100 L5 100 Z"
            fill="#1e3a5f"
          />
        ) : (
          <path
            className="avatar-2d-hoodie"
            d="M12 72 Q50 58 88 72 L92 100 L8 100 Z"
            fill="#1a1a1a"
          />
        )}
        {!isPro && (
          <path
            d="M38 62 L50 70 L62 62"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        )}
        {isPro && (
          <path
            d="M42 68 L50 74 L58 68"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        )}

        <g className="avatar-2d-head">
          <ellipse
            cx="50"
            cy="38"
            rx="32"
            ry="28"
            fill={isPro ? "#4a3728" : "#c45c26"}
          />
          <path
            d="M22 42 Q18 28 32 22 Q50 16 68 22 Q82 28 78 42"
            fill={isPro ? "#3d2e21" : "#b84e1f"}
          />
          <ellipse cx="50" cy="48" rx="26" ry="24" fill="#f4d4b8" />

          {!isPro && (
            <path
              className="avatar-2d-beard"
              d="M28 52 Q50 78 72 52 Q68 62 50 68 Q32 62 28 52"
              fill="#c45c26"
            />
          )}

          {isPro && (
            <>
              <rect x="32" y="44" width="36" height="8" rx="2" fill="#334155" opacity="0.9" />
              <line x1="38" y1="48" x2="44" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="56" y1="48" x2="62" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
            </>
          )}

          {!isHappy && !isPro && (
            <>
              <path
                d="M34 42 Q38 38 44 40"
                stroke="#6b3a1f"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 40 Q62 38 66 42"
                stroke="#6b3a1f"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {isHappy && (
            <>
              <path
                d="M35 41 Q40 39 45 41"
                stroke="#6b3a1f"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M55 41 Q60 39 65 41"
                stroke="#6b3a1f"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          <g className="avatar-2d-eyes">
            <ellipse cx="40" cy="48" rx="4" ry={isHappy ? 5 : 5} fill="#2d2d2d" />
            <ellipse cx="60" cy="48" rx="4" ry="5" fill="#2d2d2d" />
            <circle cx="41" cy="47" r="1.2" fill="#fff" />
            <circle cx="61" cy="47" r="1.2" fill="#fff" />
            <rect
              className="avatar-2d-lid-left"
              x="34"
              y="42"
              width="12"
              height="8"
              rx="2"
              fill="#f4d4b8"
            />
            <rect
              className="avatar-2d-lid-right"
              x="54"
              y="42"
              width="12"
              height="8"
              rx="2"
              fill="#f4d4b8"
            />
          </g>

          {isHappy ? (
            <path
              d="M42 58 Q50 64 58 58"
              stroke="#8b5a3c"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M44 58 Q50 56 56 58"
              stroke="#8b5a3c"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          <ellipse
            className="avatar-2d-tear"
            cx="64"
            cy="54"
            rx="2.5"
            ry="4"
            fill="#60a5fa"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}
