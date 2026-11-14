import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  caption,
  gradient = false,
  action,
  className,
}: {
  label: string;
  value: number | string;
  caption: string;
  gradient?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex min-h-[154px] flex-col rounded-xl p-5",
        gradient
          ? "bg-gradient-to-br from-gradient-from to-gradient-to text-white"
          : "border border-line bg-surface",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-sm", gradient ? "text-white/80" : "text-ink-muted")}>
          {label}
        </p>
        {action ?? (
          <span
            className={cn(
              "flex size-[30px] shrink-0 items-center justify-center rounded-full",
              gradient
                ? "bg-white/10 text-white"
                : "border border-line text-ink transition-colors",
            )}
            aria-hidden="true"
          >
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-4 text-kpi tabular">{value}</p>
      <p className={cn("mt-auto pt-2 text-[12px]", gradient ? "text-white/70" : "text-ink-faint")}>
        {caption}
      </p>
    </article>
  );
}
