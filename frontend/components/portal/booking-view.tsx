"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CalendarCheck2, Check, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { EmptyState } from "@/components/portal/empty-state";
import { DoctorStatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDoctor, getSlots } from "@/features/api/mock";
import { formatCurrency, formatShortDate, formatTime, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BookingView() {
  const params = useParams<{ doctorId: string }>();
  const doctorId = Number(params.doctorId);
  const doctor = getDoctor(doctorId);
  const slots = useMemo(() => getSlots(doctorId), [doctorId]);
  const dates = useMemo(
    () => Array.from(new Set(slots.map((slot) => slot.slot_date))),
    [slots],
  );
  const [date, setDate] = useState(dates[0] ?? "");
  const [slotId, setSlotId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const confirmTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!doctor) {
    return (
      <EmptyState
        icon={CalendarCheck2}
        title="Doctor not found"
        body="This provider is not part of the demo directory."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/doctors">Back to doctors</Link>
          </Button>
        }
      />
    );
  }

  const daySlots = slots.filter((slot) => slot.slot_date === date);
  const selected = slots.find((slot) => slot.slot_id === slotId);

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to doctors
        </Link>
      </div>

      <PageHeading
        overline="Book an appointment"
        title={doctor.full_name}
        subtitle={`${doctor.specialty} · ${doctor.department_name}`}
        actions={<DoctorStatusBadge active={doctor.is_active} />}
      />
      <DemoBanner />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-h3 text-ink">Choose a date</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {dates.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDate(value);
                    setSlotId(null);
                  }}
                  aria-pressed={date === value}
                  className={cn(
                    "flex h-[64px] flex-col items-center justify-center rounded-lg border text-[12px] transition-colors",
                    date === value
                      ? "border-primary-500 bg-primary-50 text-ink"
                      : "border-line text-ink-muted hover:border-line-strong hover:bg-subtle",
                  )}
                >
                  <span className="font-semibold">{formatShortDate(value)}</span>
                  <span className="mt-0.5 text-ink-faint">Select</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-h3 text-ink">Available slots</h2>
              <span className="text-[12px] text-ink-muted">
                {formatShortDate(date)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {daySlots.map((slot) => (
                <button
                  key={slot.slot_id}
                  type="button"
                  disabled={!slot.is_available}
                  onClick={() => setSlotId(slot.slot_id)}
                  aria-pressed={slotId === slot.slot_id}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-1.5 rounded-md border text-[13px] transition-colors",
                    !slot.is_available
                      ? "cursor-not-allowed border-line bg-subtle text-ink-faint line-through"
                      : slotId === slot.slot_id
                        ? "border-accent-500 bg-accent-50 font-semibold text-accent-700"
                        : "border-line text-ink hover:border-line-strong hover:bg-subtle",
                  )}
                >
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {formatTime(slot.start_time)}
                </button>
              ))}
            </div>

            {confirmed && (
              <p
                role="status"
                className="mt-4 flex items-center gap-2 rounded-md bg-success-bg px-3 py-2 text-[12px] text-status-confirmed"
              >
                <Check className="size-4" aria-hidden="true" />
                Appointment request recorded for the demo workspace.
              </p>
            )}
          </section>
        </div>

        <aside className="xl:sticky xl:top-4 xl:self-start">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-h3 text-ink">Summary</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-700">
                {initials(doctor.full_name)}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">
                  {doctor.full_name}
                </p>
                <p className="text-[12px] text-ink-muted">{doctor.specialty}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="text-ink-muted">Date</dt>
                <dd className="font-medium text-ink">
                  {selected ? formatShortDate(selected.slot_date) : "Not selected"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-muted">Time</dt>
                <dd className="font-medium text-ink">
                  {selected ? formatTime(selected.start_time) : "Not selected"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-muted">Consultation</dt>
                <dd className="font-medium text-ink tabular">
                  {formatCurrency(doctor.consultation_fee)}
                </dd>
              </div>
            </dl>

            <Button
              variant="accent"
              className="mt-5 w-full rounded-full"
              disabled={!selected}
              onClick={(event) => {
                confirmTriggerRef.current = event.currentTarget;
                setOpen(true);
              }}
            >
              Confirm appointment
            </Button>
            <p className="mt-3 text-center text-[12px] text-ink-faint">
              Fictional provider and slots · demo only
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            confirmTriggerRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Confirm appointment</DialogTitle>
            <DialogDescription>
              This records a request in the demo workspace only. No reminder will
              be sent.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-subtle p-4 text-[13px]">
            <p className="font-semibold text-ink">{doctor.full_name}</p>
            <p className="mt-1 text-ink-muted">
              {selected ? `${formatShortDate(selected.slot_date)} · ${formatTime(selected.start_time)}` : ""}
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={() => {
                setOpen(false);
                setConfirmed(true);
                toast.success("Appointment request recorded for the demo workspace.");
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
