import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { countdownToNextAppointment } from "@/features/api/mock";

export function CountdownCard() {
  const countdown = countdownToNextAppointment();

  return (
    <div className="relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl bg-navy-900 p-5">
      <svg
        viewBox="0 0 320 160"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="countdown-wave" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M-20 130 C 40 60, 96 160, 160 92 S 270 24, 350 86"
          fill="none"
          stroke="url(#countdown-wave)"
          strokeWidth="34"
        />
        <path
          d="M-20 154 C 60 96, 120 176, 190 112 S 300 60, 360 118"
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="12"
          strokeOpacity="0.28"
        />
      </svg>

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[12px] text-dark-muted">Next appointment in</p>
        <Link
          href="/appointments"
          aria-label="View appointments"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform hover:-translate-y-px"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <p className="relative mt-4 font-display text-[34px] leading-none font-semibold tabular text-white">
        {countdown}
      </p>
    </div>
  );
}
