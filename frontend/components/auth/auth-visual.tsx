import Link from "next/link";
import { HeartPulse, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function AuthVisual() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary-50 min-[820px]:flex min-[820px]:flex-col min-[820px]:items-center min-[820px]:justify-center">
      <div
        aria-hidden="true"
        className="absolute size-[560px] rounded-full border border-primary-100"
      />
      <div
        aria-hidden="true"
        className="absolute size-[400px] rounded-full border border-primary-200/70"
      />
      <div
        aria-hidden="true"
        className="absolute size-[240px] rounded-full border border-primary-100"
      />

      <div className="relative z-10 flex size-[152px] items-center justify-center rounded-3xl bg-surface shadow-lg">
        <HeartPulse
          className="size-16 text-primary-500"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </div>

      <div className="absolute top-[18%] left-[10%] rounded-xl border border-line bg-surface px-4 py-3 shadow-md">
        <p className="text-[13px] font-semibold text-ink">Care made clear</p>
        <p className="text-[12px] text-ink-muted">A connected clinic workspace</p>
      </div>

      <div className="absolute right-[8%] bottom-[24%] rounded-xl border border-line bg-surface px-4 py-3 shadow-md">
        <p className="text-[13px] font-semibold text-ink">People first</p>
        <p className="text-[12px] text-ink-muted">One step at a time</p>
      </div>

      <div className="absolute right-[10%] top-[14%] flex size-12 items-center justify-center rounded-xl bg-surface shadow-sm">
        <ShieldCheck className="size-5 text-primary-500" aria-hidden="true" />
      </div>

      <div className="absolute inset-x-0 bottom-10 px-10 text-center">
        <p className="text-[13px] font-semibold text-ink">
          One place for better care.
        </p>
        <p className="mx-auto mt-1 max-w-[320px] text-[12px] text-ink-muted">
          Appointments, people, and clinic workflows in a single workspace.
        </p>
        <p className="mt-5 text-[12px] text-ink-faint">
          Illustrative visual · Not a live clinical system
        </p>
      </div>

      <Link
        href="/"
        className="absolute top-8 left-8 text-[12px] font-medium text-primary-700 hover:text-ink"
      >
        Care teams, connected.
      </Link>
    </aside>
  );
}

export function AuthHeader() {
  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <Logo />
      </Link>
    </div>
  );
}
