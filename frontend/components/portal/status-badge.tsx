import type { AppointmentStatus } from "@/shared/apiTypes";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  AppointmentStatus,
  { label: string; className: string; dot: string }
> = {
  BOOKED: {
    label: "Booked",
    className: "bg-warning-bg text-status-booked",
    dot: "bg-warning",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-success-bg text-status-confirmed",
    dot: "bg-success",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-info-bg text-status-completed",
    dot: "bg-info",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-error-bg text-status-cancelled",
    dot: "bg-error",
  },
  NO_SHOW: {
    label: "No show",
    className: "bg-subtle text-status-noshow",
    dot: "bg-status-noshow-dot",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-sm px-2.5 text-[12px] font-medium whitespace-nowrap",
        style.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden="true" />
      {style.label}
    </span>
  );
}

export function DoctorStatusBadge({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] w-fit items-center gap-1.5 rounded-sm border px-2.5 text-[12px] font-medium whitespace-nowrap",
        active
          ? "border-success/20 bg-success-bg text-status-confirmed"
          : "border-error/20 bg-error-bg text-status-cancelled",
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", active ? "bg-success" : "bg-error")}
        aria-hidden="true"
      />
      {active ? "Active" : "On leave"}
    </span>
  );
}

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: "UNPAID" | "PARTIAL" | "PAID" | "VOID";
  className?: string;
}) {
  const map = {
    UNPAID: { label: "Unpaid", className: "bg-warning-bg text-status-booked", dot: "bg-warning" },
    PARTIAL: { label: "Partial", className: "bg-info-bg text-status-completed", dot: "bg-info" },
    PAID: { label: "Paid", className: "bg-success-bg text-status-confirmed", dot: "bg-success" },
    VOID: { label: "Void", className: "bg-subtle text-status-noshow", dot: "bg-status-noshow-dot" },
  } as const;
  const style = map[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-sm px-2.5 text-[12px] font-medium whitespace-nowrap",
        style.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden="true" />
      {style.label}
    </span>
  );
}
