import { MarketingFooter } from "@/components/marketing/footer";
import { Logo } from "@/components/brand/logo";
import { PillNav } from "@/components/marketing/pill-nav";
import Link from "next/link";

/* §7 navigation copy, unchanged. */
const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Goals", href: "/#goals" },
  { label: "Sign in", href: "/login" },
  { label: "Get started", href: "/register" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-marketing">
      <header className="sticky top-0 z-40 border-b border-transparent bg-marketing/90 backdrop-blur-md">
        <div className="container-marketing flex h-24 items-center justify-between gap-6">
          <Link href="/" aria-label="OpenClinic home">
            <Logo />
          </Link>
          {/* Owner-directed React Bits PillNav (2026-11-15); see DEVIATIONS.md. */}
          <PillNav
            items={items}
            activeHref="/"
            theme="light"
            size="md"
            ariaLabel="Main"
          />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
