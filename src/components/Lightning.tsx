import { cn } from "@/lib/utils";

/**
 * Decorative SVG lightning bolt that sits behind icons.
 * Animated flicker via .animate-lightning class.
 */
export function Lightning({
  className,
  color = "primary",
}: {
  className?: string;
  color?: "primary" | "destructive" | "gold";
}) {
  const stroke =
    color === "destructive"
      ? "hsl(var(--destructive))"
      : color === "gold"
      ? "hsl(var(--gold))"
      : "hsl(var(--primary))";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full animate-lightning", className)}
    >
      <defs>
        <filter id={`glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${color})`}
        opacity="0.9"
      >
        <path d="M55 8 L30 48 L48 48 L40 92 L72 44 L52 44 Z" fill={stroke} fillOpacity="0.15" />
        <path d="M20 18 L28 30 L22 32 L34 50" />
        <path d="M82 60 L74 72 L80 74 L70 88" />
      </g>
    </svg>
  );
}
