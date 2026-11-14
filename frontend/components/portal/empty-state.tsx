import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary-50">
        <Icon className="size-5 text-primary-600" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-[320px] text-[12px] text-ink-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
