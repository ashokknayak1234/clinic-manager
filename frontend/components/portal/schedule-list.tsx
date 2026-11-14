import Link from "next/link";
import { CalendarDays, Clock3, Plus, Stethoscope, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatTime } from "@/lib/format";

const iconTones = [
  "bg-primary-50 text-primary-600",
  "bg-info-bg text-status-completed",
  "bg-success-bg text-status-confirmed",
  "bg-warning-bg text-status-booked",
];

const icons: LucideIcon[] = [UserRound, Stethoscope, CalendarDays, Clock3];

export function ScheduleList({
  rows,
  compact = false,
}: {
  rows: Array<{ id: number; title: string; subtitle: string; time: string }>;
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-4 py-6 text-center">
        <p className="text-sm font-semibold text-ink">No appointments today</p>
        <p className="mt-1 text-[12px] text-ink-muted">
          New requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className={compact ? "space-y-2.5" : "space-y-1"}>
      {rows.map((row, index) => {
        const Icon = icons[index % icons.length]!;
        return (
          <li key={row.id} className="flex items-center gap-3">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-md ${iconTones[index % iconTones.length]}`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-ink">{row.title}</p>
              <p className="truncate text-[12px] text-ink-muted">{row.subtitle}</p>
            </div>
            <span className="text-[12px] text-ink-muted tabular">
              {formatTime(row.time)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ScheduleHeader() {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-h3 text-ink">Today&apos;s schedule</h2>
      <div className="flex items-center gap-2">
        <Link
          href="/appointments"
          className="inline-flex h-7 items-center gap-1 rounded-sm border border-accent-500 bg-surface px-2 text-[12px] font-medium text-accent-600 hover:bg-accent-50"
        >
          <Plus className="size-3" aria-hidden="true" />
          New
        </Link>
        <Link
          href="/appointments"
          className="text-[12px] font-medium text-primary-600 hover:text-primary-700"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
