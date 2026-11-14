import { Sparkline } from "@/components/marketing/sparkline";
import { cn } from "@/lib/utils";

export function TelemetryCard({
  label,
  value,
  variant,
  values,
  className,
}: {
  label: string;
  value: string;
  variant: "line" | "area" | "bars";
  values: number[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[184px] rounded-xl border border-line bg-surface p-4 shadow-md",
        className,
      )}
    >
      <p className="text-[12px] text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-[24px] leading-none font-bold tabular text-ink">
        {value}
      </p>
      <Sparkline
        variant={variant}
        values={values}
        width={152}
        height={40}
        className="mt-3 h-10 w-full"
      />
    </div>
  );
}
