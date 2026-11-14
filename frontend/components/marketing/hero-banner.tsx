import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMedia } from "@/components/marketing/hero-media";
import { RotatingBadge } from "@/components/marketing/rotating-badge";

export function HeroBanner() {
  return (
    <section className="container-marketing pb-14 md:pb-20">
      <div className="relative">
        <div className="relative h-[380px] overflow-hidden rounded-2xl bg-navy-800 sm:h-[420px] md:h-[460px] lg:h-[480px] xl:h-[508px] xl:rounded-3xl">
          <div
            aria-hidden="true"
            className="absolute -right-24 -bottom-40 size-[520px] rounded-full border-[40px] border-primary-500/[0.08]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-2 -bottom-24 size-[340px] rounded-full border-[40px] border-primary-500/[0.08]"
          />
          <HeartPulse
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 text-primary-500 opacity-[0.06]"
            strokeWidth={1}
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 md:p-12">
            <div className="flex gap-10">
              <div>
                <p className="font-display text-[36px] leading-none font-bold text-white tabular md:text-[44px]">
                  1
                </p>
                <p className="mt-2 text-[13px] text-dark-muted">workspace</p>
              </div>
              <div>
                <p className="font-display text-[36px] leading-none font-bold text-white tabular md:text-[44px]">
                  4
                </p>
                <p className="mt-2 text-[13px] text-dark-muted">clinic roles</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild size="pill-lg" className="px-6">
                <Link href="/register">Create free account</Link>
              </Button>
              <Button
                asChild
                size="icon-lg"
                aria-label="Create a free account"
                className="bg-surface text-ink hover:bg-primary-50"
              >
                <Link href="/register">
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute right-8 bottom-16 hidden scale-75 lg:block xl:right-12 xl:bottom-24 xl:scale-100">
            <RotatingBadge />
          </div>
          <div className="absolute top-5 right-5 scale-75 lg:hidden">
            <RotatingBadge size={112} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <HeroMedia />
        </div>
      </div>
    </section>
  );
}
