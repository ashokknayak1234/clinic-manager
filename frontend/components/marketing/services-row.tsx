import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const tags = [
  ["Booking", "Records", "Prescriptions"],
  ["Billing", "Reports"],
];

function DarkPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center rounded-full bg-navy-800 px-5 text-[13px] font-medium text-white">
      {children}
    </span>
  );
}

export function ServicesRow() {
  return (
    <section id="services" className="scroll-mt-24 bg-marketing">
      <div className="container-marketing grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3 lg:py-[72px]">
        <div>
          <h2 className="text-h2 text-ink">Services</h2>
          <div className="mt-7 flex flex-col gap-3">
            {tags.map((row, index) => (
              <div key={index} className="flex flex-wrap gap-3">
                {row.map((tag) => (
                  <DarkPill key={tag}>{tag}</DarkPill>
                ))}
              </div>
            ))}
          </div>
        </div>

        <article className="rounded-2xl border border-line bg-surface p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-md">
          <h3 className="text-lg font-semibold text-ink">Patient Portal</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            Register, browse doctors, book appointments, view prescriptions and
            invoices.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <DarkPill>Appointments</DarkPill>
            <DarkPill>Invoices</DarkPill>
          </div>
        </article>

        <article className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-md md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-ink">Staff Panel</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            Manage appointments, patients, prescriptions, billing, and reports.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DarkPill>Directory</DarkPill>
            <Link
              href="/staff"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-primary-600 hover:text-primary-700"
            >
              Staff panel
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
