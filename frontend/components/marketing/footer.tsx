import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Marquee } from "@/components/marketing/marquee";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Patient portal", href: "/dashboard" },
      { label: "Staff panel", href: "/staff" },
      { label: "API health", href: "/health" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Documentation", href: "/#about" },
      { label: "Database design", href: "/#about" },
    ],
  },
  {
    title: "Access",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];

export function MarketingFooter() {
  const year = new Date("2026-11-14").getFullYear();

  return (
    <footer className="bg-surface">
      <Marquee />
      <div className="container-marketing py-16">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-[360px]">
            <Logo />
            <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
              Educational prototype using fictional data only. Not for real
              patient care or clinical use.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} OpenClinic</p>
          <p>Educational prototype · Fictional data only</p>
        </div>
      </div>
    </footer>
  );
}
