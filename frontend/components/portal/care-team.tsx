import { careTeam } from "@/features/api/mock";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CareTeam({
  rows = careTeam,
  className,
}: {
  rows?: typeof careTeam;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {rows.map((doctor) => {
        const active = doctor.is_active;
        return (
          <li key={doctor.doctor_id} className="flex items-center gap-3">
            <Avatar className="size-[34px] shrink-0 rounded-full after:hidden">
              <AvatarFallback className="bg-primary-50 text-[12px] font-semibold text-primary-700">
                {initials(doctor.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">
                {doctor.full_name}
              </p>
              <p className="truncate text-[12px] text-ink-muted">
                {doctor.specialty}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex h-[22px] w-[68px] shrink-0 items-center justify-center gap-1.5 rounded-sm border text-[12px] font-medium",
                active
                  ? "border-success/20 bg-success-bg text-status-confirmed"
                  : "border-error/20 bg-error-bg text-status-cancelled",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-success" : "bg-error",
                )}
                aria-hidden="true"
              />
              {active ? "Active" : "On leave"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
