import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-navy-900 p-4">
      <svg
        viewBox="0 0 186 150"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-20"
        preserveAspectRatio="none"
      >
        <path
          d="M-20 118 C 30 60, 58 138, 104 74 S 168 28, 214 72"
          fill="none"
          stroke="var(--color-primary-400)"
          strokeWidth="22"
        />
        <path
          d="M-10 150 C 40 96, 82 158, 132 96 S 186 60, 226 104"
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="14"
        />
      </svg>
      <div className="relative">
        <p className="text-sm font-semibold text-white">Demo workspace</p>
        <p className="mt-0.5 text-[12px] text-dark-muted">Sample data only.</p>
        <Link
          href="/health"
          className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-primary-300 hover:text-primary-200"
        >
          API health
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
