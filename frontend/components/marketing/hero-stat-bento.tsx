import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function HeroHeading() {
  return (
    <div className="max-w-[700px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-600">
        Clinic care, connected
      </p>
      <h1 className="mt-5 text-display text-ink">
        A calmer clinic,
        <br />
        from booking to billing.
      </h1>
    </div>
  );
}

export function HeroStatBento() {
  return (
    <div className="grid w-full grid-cols-2 gap-5">
      <div className="flex flex-col gap-5">
        <article className="relative flex flex-col rounded-2xl bg-surface p-6 shadow-sm">
          <p className="text-sm text-ink-muted">Relational schema</p>
          <p className="mt-6 text-kpi tabular text-ink">15</p>
          <p className="mt-1 text-xs text-ink-faint">tables</p>
          <Link
            href="/health"
            aria-label="View API health"
            className="absolute top-6 right-6 flex size-[30px] items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-strong hover:bg-subtle"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </article>

        <article className="flex flex-1 flex-col rounded-2xl bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Patient portal</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            Register, browse doctors, book appointments, view prescriptions and
            invoices.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>
      </div>

      <article className="relative flex h-[274px] flex-col justify-between self-end overflow-hidden rounded-2xl bg-primary-500 p-6 text-white shadow-sm">
        <div>
          <p className="text-sm text-white">Workspaces</p>
          <p className="mt-2 text-kpi tabular">4</p>
          <p className="mt-1 text-xs text-white">
            Patient · Doctor · Admin · Reception
          </p>
        </div>
        <div className="relative flex h-[132px] items-end gap-3">
          <div
            className="h-[88px] w-12 rounded-3xl border border-white/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.28) 0 2px, transparent 2px 8px)",
            }}
            aria-hidden="true"
          />
          <div
            className="h-[118px] w-12 rounded-3xl border border-white/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.28) 0 2px, transparent 2px 8px)",
            }}
            aria-hidden="true"
          />
          <div className="relative h-[132px] w-12 rounded-3xl bg-white" aria-hidden="true">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-1 text-xs font-semibold whitespace-nowrap text-primary-600 shadow-sm">
              4 roles
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
