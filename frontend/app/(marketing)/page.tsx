import { HeroHeading, HeroStatBento } from "@/components/marketing/hero-stat-bento";
import { HeroBanner } from "@/components/marketing/hero-banner";
import { ServicesRow } from "@/components/marketing/services-row";
import { AboutTelemetry } from "@/components/marketing/about-telemetry";
import { BentoCards } from "@/components/marketing/bento-cards";

export default function LandingPage() {
  return (
    <>
      <section className="container-marketing pt-10 pb-16 lg:pt-16">
        <div className="grid items-start gap-16 lg:grid-cols-[60fr_40fr] lg:gap-10">
          <HeroHeading />
          <HeroStatBento />
        </div>
      </section>

      <HeroBanner />
      <ServicesRow />
      <AboutTelemetry />
      <BentoCards />
    </>
  );
}
