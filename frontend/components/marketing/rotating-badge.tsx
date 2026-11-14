import { ArrowUpRight } from "lucide-react";

const text = "Appointments · Patients · Prescriptions · Billing · ";

export function RotatingBadge({ size = 148 }: { size?: number }) {
  const radius = size / 2 - 18;

  return (
    <div
      aria-hidden="true"
      className="relative"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 animate-rotate-slow">
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full">
          <defs>
            <path
              id="badge-circle"
              d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <text className="fill-ink text-[12px] font-semibold tracking-[0.08em] uppercase">
            <textPath
              href="#badge-circle"
              startOffset="0"
              textLength={2 * Math.PI * radius - 6}
              lengthAdjust="spacingAndGlyphs"
            >
              {text}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-[22px] flex items-center justify-center rounded-full bg-surface shadow-sm">
        <ArrowUpRight className="size-6 text-ink" />
      </div>
    </div>
  );
}
