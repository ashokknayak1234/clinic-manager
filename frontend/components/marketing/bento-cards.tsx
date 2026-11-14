import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CareTeam } from "@/components/portal/care-team";
import { SchemaBars } from "@/components/marketing/schema-bars";
import { Reveal } from "@/components/motion/reveal";

const accounts = [
  { initial: "P", size: "size-[68px]", name: "Patient" },
  { initial: "D", size: "size-[78px]", name: "Doctor" },
  { initial: "A", size: "size-[68px]", name: "Admin" },
];

export function BentoCards() {
  return (
    <section id="goals" className="scroll-mt-24 bg-marketing">
      <div className="container-marketing py-14 md:py-[72px] lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-600">
              About us
            </p>
            <h2 className="mt-4 text-h2 text-ink">
              Get to know more
              <br />
              about OpenClinic
            </h2>
          </div>
          <p className="max-w-[420px] text-[13px] leading-relaxed text-ink-muted lg:text-right">
            Discover how the patient portal, staff panel, and MySQL schema work
            together across real clinic workflows.
          </p>
        </div>

        <Reveal className="mt-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article className="flex min-h-[456px] flex-col rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">
                  Relational schema
                </h3>
                <span className="text-[13px] font-medium text-ink-muted tabular">
                  15 tables
                </span>
              </div>
              <SchemaBars />
              <p className="mt-auto pt-4 text-[12px] text-ink-faint">
                Measured from the project database, not live data.
              </p>
            </article>

            <article className="flex min-h-[456px] flex-col rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold text-ink">Demo accounts</h3>
              <div className="mt-8 flex items-center">
                {accounts.map((account, index) => (
                  <span
                    key={account.name}
                    className={`${account.size} flex items-center justify-center rounded-full border-[3px] border-primary-500 bg-primary-100 font-display text-[22px] font-bold text-primary-700 ${
                      index > 0 ? "-ml-3" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {account.initial}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[13px] text-ink-muted">
                Patient · Doctor · Admin
              </p>
              <p className="mt-2 text-[12px] text-ink-faint">
                Seeded accounts for the demonstration workspace.
              </p>
              <Button
                asChild
                className="mt-auto w-fit bg-navy-800 text-white hover:bg-navy-700"
                size="pill"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </article>

            <article className="relative flex min-h-[456px] flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 md:col-span-2 lg:col-span-1">
              <h3 className="relative z-10 text-lg font-semibold text-ink">
                Care team
              </h3>
              <svg
                viewBox="0 0 380 300"
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-14 h-[300px] w-[calc(100%-32px)]"
                preserveAspectRatio="none"
              >
                <path
                  d="M18 66 L342 24 L364 254 L44 284 Z"
                  fill="none"
                  stroke="var(--color-primary-500)"
                  strokeWidth="2"
                  opacity="0.55"
                />
                <path
                  d="M30 84 L330 46 L348 236 L58 262 Z"
                  fill="none"
                  stroke="var(--color-primary-200)"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="relative z-10 mt-6 rounded-lg bg-surface/80 p-4 backdrop-blur-sm">
                <CareTeam />
              </div>
              <Button
                asChild
                variant="outline"
                size="pill"
                className="relative z-10 mt-auto w-fit"
              >
                <Link href="/doctors">View doctors</Link>
              </Button>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
