"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Goals", href: "/#goals" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />
      <header
        className={cn(
          "sticky top-0 z-40 bg-marketing/90 backdrop-blur-md transition-colors",
          scrolled ? "border-b border-line/60" : "border-b border-transparent",
        )}
      >
        <div className="container-marketing flex h-24 items-center justify-between gap-6">
          <Link href="/">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 min-[900px]:flex">
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname === "/";
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors",
                    active && link.href === "/"
                      ? "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-500"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 min-[900px]:flex">
            <Button asChild variant="ghost" size="pill" className="text-ink-muted">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="secondary" size="pill" className="gap-1.5 border-line-strong bg-subtle">
              <Link href="/register">
                Get started
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-[900px]:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-surface" data-lenis-prevent>
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-3 text-sm font-medium text-ink-muted hover:bg-subtle hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-line p-4">
                <SheetClose asChild>
                  <Button asChild variant="secondary" size="default">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="default" size="default">
                    <Link href="/register">Get started</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
