"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardList, Users } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { StatCard } from "@/components/portal/stat-card";
import { ScheduleHeader, ScheduleList } from "@/components/portal/schedule-list";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import {
  activeDoctors,
  appointmentsToday,
  pendingRequests,
  registeredPatients,
  staffQueue,
  todayAppointments,
} from "@/features/api/mock";
import type { Role } from "@/shared/apiTypes";

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  PATIENT: "Patient",
};

const tones = {
  warning: "border-warning/20 bg-warning-bg text-status-booked",
  error: "border-error/20 bg-error-bg text-status-cancelled",
  info: "border-info/20 bg-info-bg text-status-completed",
} as const;

export function StaffView() {
  const { user } = useAuth();
  const role = user?.role ?? "RECEPTIONIST";
  const scheduleRows = todayAppointments.slice(0, 4).map((item) => ({
    id: item.appointment_id,
    title: item.patient_name,
    subtitle: item.doctor_name,
    time: item.start_time,
  }));

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Staff workspace"
        title="Staff panel"
        subtitle="Clinic queues and day-to-day operations."
        actions={
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent-50 px-3 text-[12px] font-semibold text-accent-700">
            <Users className="size-3.5" aria-hidden="true" />
            {roleLabels[role]}
          </span>
        }
      />
      <DemoBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Appointments today"
          value={appointmentsToday}
          caption="Across all providers · sample data"
        />
        <StatCard
          label="Pending requests"
          value={pendingRequests}
          caption="Review in appointments"
        />
        <StatCard
          label="Active doctors"
          value={activeDoctors}
          caption="1 provider on leave · demo"
        />
        <StatCard
          label="Registered patients"
          value={registeredPatients}
          caption="Demo directory"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {staffQueue.map((queue) => (
          <Link
            key={queue.id}
            href={
              queue.id === 1
                ? "/appointments?status=BOOKED"
                : queue.id === 2
                  ? "/invoices"
                  : "/prescriptions"
            }
            className="group rounded-xl border border-line bg-surface p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={`inline-flex h-6 items-center rounded-sm border px-2 text-[12px] font-semibold ${tones[queue.tone]}`}>
                {queue.count}
              </span>
              <ArrowUpRight
                className="size-4 text-ink-faint transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-4 text-[15px] font-semibold text-ink">{queue.title}</h2>
            <p className="mt-1 text-[12px] text-ink-muted">{queue.detail}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <ScheduleHeader />
        <div className="mt-4">
          <ScheduleList rows={scheduleRows} />
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
          <Button asChild variant="secondary" size="sm">
            <Link href="/appointments">
              <ClipboardList className="size-3.5" aria-hidden="true" />
              Open appointments
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/doctors">Staff directory</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
