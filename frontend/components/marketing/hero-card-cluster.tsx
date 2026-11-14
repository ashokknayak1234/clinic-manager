import { Pill } from "lucide-react";
import { Sparkline } from "@/components/marketing/sparkline";
import { StatusBadge } from "@/components/portal/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function CardShell({
  children,
  className,
  float = "animate-float-a",
}: {
  children: React.ReactNode;
  className?: string;
  float?: string;
}) {
  return (
    <div className={cn("p-6", float)}>
      <div
        className={cn(
          "flex h-[204px] w-[264px] flex-col rounded-2xl bg-surface p-5 shadow-lg xl:h-[212px] xl:w-[300px]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function AppointmentCard() {
  return (
    <CardShell float="animate-float-a">
      <div className="flex items-center gap-3">
        <Avatar className="size-9 shrink-0 rounded-full after:hidden">
          <AvatarFallback className="bg-primary-100 text-[12px] font-semibold text-primary-700">
            DP
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[13px] font-semibold text-ink">Demo Patient</p>
          <p className="text-[12px] text-ink-muted">Cardiology</p>
        </div>
      </div>
      <div className="my-4 h-px bg-line" />
      <div className="flex items-center justify-between text-[12px] text-ink-muted">
        <span>Thu 12 Nov</span>
        <span className="text-[13px] font-semibold text-ink">10:30 AM</span>
      </div>
      <div className="mt-auto">
        <StatusBadge status="CONFIRMED" />
      </div>
    </CardShell>
  );
}

function VitalsCard() {
  return (
    <CardShell float="animate-float-b" className="justify-center">
      <p className="text-[12px] text-ink-muted">Heart rate</p>
      <p className="mt-1 font-display text-[28px] leading-none font-bold tabular text-ink">
        72 <span className="text-[13px] font-medium text-ink-muted">bpm</span>
      </p>
      <Sparkline
        variant="area"
        values={[6, 9, 7, 14, 8, 17, 10, 6, 12, 8]}
        width={220}
        height={56}
        className="mt-4 h-14 w-full"
        label="Sample heart-rate trace"
      />
      <p className="mt-2 text-[12px] text-ink-faint">Sample reading · demo</p>
    </CardShell>
  );
}

function PrescriptionCard() {
  const rows = [
    { name: "Atorvastatin 10 mg", dose: "1× daily" },
    { name: "Aspirin 75 mg", dose: "1× daily" },
    { name: "Vitamin D3", dose: "Weekly" },
  ];
  return (
    <CardShell float="animate-float-c">
      <p className="text-[12px] text-ink-muted">Prescription</p>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center gap-2">
            <Pill className="size-3.5 shrink-0 text-primary-500" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-ink">
              {row.name}
            </span>
            <span className="text-[12px] text-ink-muted">{row.dose}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto text-[12px] text-ink-muted">Dr. A. Menon</p>
    </CardShell>
  );
}

export function HeroCardCluster() {
  return (
    <>
      {/* Desktop: three fanned cards */}
      <div className="pointer-events-none absolute top-[-56px] left-[54%] hidden -translate-x-1/2 items-start lg:flex xl:left-[60%]">
        <div
          className="-mr-7 origin-bottom"
          style={{ transform: "rotate(-8deg) translateY(24px)" }}
        >
          <AppointmentCard />
        </div>
        <div className="relative z-10">
          <VitalsCard />
        </div>
        <div
          className="-ml-7 origin-bottom"
          style={{ transform: "rotate(8deg) translateY(24px)" }}
        >
          <PrescriptionCard />
        </div>

        <span className="absolute -top-3 left-2 rounded-full bg-surface/95 px-3 py-1.5 text-[12px] font-medium text-ink shadow-sm">
          + New request
        </span>
        <span className="absolute -bottom-4 right-4 rounded-full bg-surface/95 px-3 py-1.5 text-[12px] font-medium text-ink shadow-sm">
          Seen 2m ago
        </span>
      </div>

      {/* Mobile: centre card only */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 lg:hidden">
        <div className="animate-float-b">
          <div className="flex h-[184px] w-[260px] flex-col justify-center rounded-2xl bg-surface p-5 shadow-lg">
            <p className="text-[12px] text-ink-muted">Heart rate</p>
            <p className="mt-1 font-display text-[28px] leading-none font-bold tabular text-ink">
              72 <span className="text-[13px] font-medium text-ink-muted">bpm</span>
            </p>
            <Sparkline
              variant="area"
              values={[6, 9, 7, 14, 8, 17, 10, 6, 12, 8]}
              width={200}
              height={44}
              className="mt-3 h-11 w-full"
              label="Sample heart-rate trace"
            />
            <p className="mt-2 text-[12px] text-ink-faint">
              Sample reading · demo
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
