import { Star } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  count,
  size = 12,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40",
            )}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">
        {value.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </div>
  );
}

export function SectionHeading({
  title,
  index,
  action,
  actionTo,
  className,
}: {
  title: string;
  index?: string;
  action?: string;
  actionTo?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6 border-b border-border pb-5", className)}>
      <div className="flex items-baseline gap-4">
        <h2 className="display text-3xl sm:text-5xl lg:text-6xl">{title}</h2>
        {index && <span className="label-xs text-primary">{index}</span>}
      </div>
      {action && actionTo && (
        <Link
          to={actionTo}
          className="label-xs hidden shrink-0 border-b border-foreground/40 pb-1 transition-colors hover:border-primary hover:text-primary sm:inline-block"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  actionLabel,
  actionTo,
  icon,
}: {
  title: string;
  body?: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-border px-6 py-24 text-center">
      {icon && <div className="mb-6 text-muted-foreground">{icon}</div>}
      <h3 className="display text-3xl sm:text-4xl">{title}</h3>
      {body && <p className="mt-3 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="label-xs mt-8 bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-secondary", className)} />;
}

export const COLOR_HEX: Record<string, string> = {
  Black: "#111111",
  White: "#f4f2ee",
  Gray: "#8a8a8a",
  Green: "#c6f24e",
  Blue: "#3b4c66",
  Brown: "#6b5847",
};

export function ColorDots({ colors, className }: { colors: string[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {colors.map((c) => (
        <span
          key={c}
          title={c}
          className="h-2.5 w-2.5 rounded-full border border-border"
          style={{ backgroundColor: COLOR_HEX[c] ?? "#555" }}
        />
      ))}
    </div>
  );
}