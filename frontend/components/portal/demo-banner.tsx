import { Activity } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3">
      <Activity className="size-4 shrink-0 text-primary-600" aria-hidden="true" />
      <p className="text-[12px] leading-relaxed text-ink-muted">
        <span className="font-semibold text-ink">Demonstration workspace</span> —
        All people, appointments, and clinical information shown are fictional
        sample data.
      </p>
    </div>
  );
}
