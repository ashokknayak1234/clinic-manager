"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { StatCard } from "@/components/portal/stat-card";
import { PillBarChart } from "@/components/portal/pill-bar-chart";
import { ScheduleHeader, ScheduleList } from "@/components/portal/schedule-list";
import { CareTeam } from "@/components/portal/care-team";
import { Gauge } from "@/components/portal/gauge";
import { CountdownCard } from "@/components/portal/countdown-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/portal/empty-state";
import { CalendarX } from "lucide-react";
import {
  activeDoctors,
  appointmentsToday,
  nextAppointment,
  pendingRequests,
  registeredPatients,
  todayAppointments,
} from "@/features/api/mock";
import { DEMO_NOW } from "@/lib/demo-clock";
import { formatWeekday } from "@/lib/format";

function overlineDate(): string {
  const day = DEMO_NOW.getUTCDate();
  const month = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    timeZone: "UTC",
  }).format(DEMO_NOW);
  return `${formatWeekday(DEMO_NOW)}, ${day} ${month}`;
}

export function DashboardView() {
  const { user } = useAuth();
  const isPatient = (user?.role ?? "PATIENT") === "PATIENT";
  const title = isPatient ? "Welcome back, Demo" : "Clinic overview";
  const subtitle = isPatient
    ? "Here is your care at a glance."
    : "Monitor clinic activity and manage day-to-day operations.";

  const scheduleRows = todayAppointments.slice(0, 4).map((item) => ({
    id: item.appointment_id,
    title: item.patient_name,
    subtitle: item.doctor_name,
    time: item.start_time,
  }));

  return (
    <div className="space-y-4">
      <PageHeading
        overline={overlineDate()}
        title={title}
        subtitle={subtitle}
        actions={
          isPatient ? (
            <Button asChild variant="accent">
              <Link href="/doctors">
                <Plus className="size-4" aria-hidden="true" />
                Request appointment
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline-dark">
              <Link href="/appointments">View schedule</Link>
            </Button>
          )
        }
      />

      <DemoBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          gradient
          label="Appointments today"
          value={appointmentsToday}
          caption="Across all providers · sample data"
        />
        <StatCard
          label="Registered patients"
          value={registeredPatients}
          caption="Demo directory"
        />
        <StatCard
          label="Active doctors"
          value={activeDoctors}
          caption="1 provider on leave · demo"
        />
        <StatCard
          label="Pending requests"
          value={pendingRequests}
          caption="Review in appointments"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-line bg-surface p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h3 text-ink">Appointments this week</h2>
            <span className="text-[12px] text-ink-faint">Sample week</span>
          </div>
          <div className="mt-4">
            <PillBarChart />
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-line bg-surface p-5 lg:col-span-3">
          <h2 className="text-h3 text-ink">Next appointment</h2>
          {nextAppointment ? (
            <>
              <p className="mt-4 text-lg font-semibold text-ink">
                {nextAppointment.specialty} consultation
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {nextAppointment.doctor_name}
              </p>
              <p className="text-[13px] text-ink-muted">
                Thu 12 Nov · {nextAppointment.start_time}
              </p>
              <Button asChild variant="accent" className="mt-auto w-full">
                <Link href="/appointments">View details</Link>
              </Button>
            </>
          ) : (
            <EmptyState
              icon={CalendarX}
              title="No upcoming visit"
              body="Book an appointment to see it here."
              className="mt-4 border-0 px-2 py-6"
            />
          )}
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 lg:col-span-3">
          <ScheduleHeader />
          <div className="mt-4">
            <ScheduleList rows={scheduleRows} />
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-line bg-surface p-5 lg:col-span-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h3 text-ink">Care team</h2>
            <Link
              href="/doctors"
              className="text-[12px] font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="mt-4">
            <CareTeam />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 lg:col-span-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h3 text-ink">Today&apos;s completion</h2>
            <Link
              href="/appointments"
              aria-label="Open appointments"
              className="flex size-7 items-center justify-center rounded-sm border border-line text-ink-muted hover:bg-subtle"
            >
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-2">
            <Gauge />
          </div>
        </section>

        <div className="lg:col-span-3">
          <CountdownCard />
        </div>
      </div>
    </div>
  );
}
