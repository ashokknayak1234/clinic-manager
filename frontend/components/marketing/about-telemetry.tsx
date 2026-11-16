import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartIllustration } from "@/components/marketing/heart-illustration";
import { TelemetryCard } from "@/components/marketing/telemetry-card";
import { Reveal } from "@/components/motion/reveal";
import {
  getAppointmentsToday,
  getNextAppointment,
  getPendingRequests,
} from "@/features/api/mock";
import { formatTime } from "@/lib/format";

export function AboutTelemetry() {
  const appointmentsToday = getAppointmentsToday();
  const nextAppointment = getNextAppointment();
  const pendingRequests = getPendingRequests();

  return (
    <section id="about" className="scroll-mt-24 bg-surface">
      <div className="container-marketing grid items-center gap-14 py-14 md:py-[72px] lg:grid-cols-[42fr_58fr] lg:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-600">
            About us
          </p>
          <h2 className="mt-4 text-h2 text-ink">
            Through thoughtful design
            <br />
            and dependable data
          </h2>
          <p className="mt-5 max-w-[500px] text-sm leading-relaxed text-ink-muted">
            OpenClinic is a locally hosted clinic management and patient
            appointment application built as an educational DBMS project. It
            demonstrates relational database concepts through realistic clinic
            workflows.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="pill">
              <Link href="/health">Discover more</Link>
            </Button>
            <Button asChild variant="outline" size="pill">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mx-auto h-[330px] w-full max-w-[620px] sm:h-[380px]">
            <HeartIllustration className="absolute top-1/2 left-1/2 h-[230px] w-[180px] -translate-x-1/2 -translate-y-1/2 md:h-[350px] md:w-[270px]" />

            <div className="absolute top-0 left-0 hidden lg:block">
              <TelemetryCard
                label="Appointments today"
                value={String(appointmentsToday)}
                variant="area"
                values={[3, 6, 5, 9, 7, 11, 8, 12]}
              />
              <span className="absolute top-1/2 -right-8 h-px w-8 bg-primary-300" aria-hidden="true" />
              <span className="absolute top-1/2 -right-[38px] size-[18px] -translate-y-1/2 rounded-full bg-primary-500 ring-4 ring-primary-50" aria-hidden="true" />
            </div>

            <div className="absolute bottom-0 left-6 hidden lg:block">
              <TelemetryCard
                label="Next visit"
                value={formatTime(nextAppointment?.start_time ?? "10:30")}
                variant="line"
                values={[4, 10, 6, 12, 8, 14, 10, 13]}
              />
              <span className="absolute top-1/2 -right-6 h-px w-6 bg-primary-300" aria-hidden="true" />
              <span className="absolute top-1/2 -right-[30px] size-[18px] -translate-y-1/2 rounded-full bg-primary-500 ring-4 ring-primary-50" aria-hidden="true" />
            </div>

            <div className="absolute top-10 right-0 hidden lg:block">
              <TelemetryCard
                label="Pending requests"
                value={String(pendingRequests)}
                variant="bars"
                values={[3, 6, 4, 8, 5, 7, 9]}
              />
              <span className="absolute top-1/2 -left-8 h-px w-8 bg-primary-300" aria-hidden="true" />
              <span className="absolute top-1/2 -left-[38px] size-[18px] -translate-y-1/2 rounded-full bg-primary-500 ring-4 ring-primary-50" aria-hidden="true" />
            </div>

            <div className="mt-4 grid gap-3 lg:hidden">
              <TelemetryCard
                label="Appointments today"
                value={String(appointmentsToday)}
                variant="area"
                values={[3, 6, 5, 9, 7, 11, 8, 12]}
                className="w-full"
              />
              <TelemetryCard
                label="Next visit"
                value={formatTime(nextAppointment?.start_time ?? "10:30")}
                variant="line"
                values={[4, 10, 6, 12, 8, 14, 10, 13]}
                className="w-full"
              />
              <TelemetryCard
                label="Pending requests"
                value={String(pendingRequests)}
                variant="bars"
                values={[3, 6, 4, 8, 5, 7, 9]}
                className="w-full"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
