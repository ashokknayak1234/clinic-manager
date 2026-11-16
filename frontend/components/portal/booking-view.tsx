"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { apiClient } from "@/features/api/client";
import { getDoctor } from "@/features/api/mock";
import type { TimeSlot } from "@/shared/apiTypes";
import { formatCurrency, formatShortDate, formatTime, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BookingView() {
  const params = useParams<{ doctorId: string }>();
  const doctorId = Number(params.doctorId);
  const doctor = getDoctor(doctorId);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const slotsLoading = loadedFor !== doctorId;
  const [slotId, setSlotId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const confirmTriggerRef = useRef<HTMLButtonElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  // Slot ids already requested in this session: keep them visible but disabled
  // so the same slot cannot be booked twice.
  const [requestedIds, setRequestedIds] = useState<number[]>([]);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void apiClient.getDoctorSlots(doctorId).then((response) => {
      if (!active) return;
      if (response.success && response.data) {
        setSlots(response.data);
        setSlotsError(null);
      } else {
        setSlots([]);
        setSlotsError(response.error?.message ?? "Could not load available slots.");
      }
      setLoadedFor(doctorId);
    });
    return () => {
      active = false;
    };
  }, [doctorId]);

  const dates = useMemo(
    () => Array.from(new Set(slots.map((slot) => slot.slot_date))),
    [slots],
  );
  const activeDate = date && dates.includes(date) ? date : (dates[0] ?? "");

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

  const daySlots = slots.filter((slot) => slot.slot_date === activeDate);
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
                    setConfirmed(false);
                  }}
                  aria-pressed={activeDate === value}
                  className={cn(
                    "flex h-[64px] flex-col items-center justify-center rounded-lg border text-[12px] transition-colors",
                    activeDate === value
                      ? "border-primary-500 bg-primary-50 text-ink"
                      : "border-line text-ink-muted hover:border-line-strong hover:bg-subtle",
                  )}
                >
                  <span className="font-semibold">{formatShortDate(value)}</span>
                  <span className="mt-0.5 text-ink-faint">
                    {activeDate === value ? "Selected" : "Select"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-h3 text-ink">Available slots</h2>
              <span className="text-[12px] text-ink-muted">
                {activeDate ? formatShortDate(activeDate) : "—"}
              </span>
            </div>
            {slotsLoading ? (
              <p className="mt-3 text-[13px] text-ink-muted">Loading available slots…</p>
            ) : slotsError ? (
              <p className="mt-3 rounded-md bg-error-bg px-3 py-2 text-[13px] text-status-cancelled" role="alert">
                {slotsError}
              </p>
            ) : daySlots.length === 0 ? (
              <p className="mt-3 text-[13px] text-ink-muted">
                No slots are available for this date.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {daySlots.map((slot) => {
                  const requested = requestedIds.includes(slot.slot_id);
                  return (
                    <button
                      key={slot.slot_id}
                      type="button"
                      disabled={!slot.is_available || requested}
                      onClick={() => {
                        setSlotId(slot.slot_id);
                        setRequestError(null);
                        setConfirmed(false);
                      }}
                      aria-pressed={slotId === slot.slot_id}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-1.5 rounded-md border text-[13px] transition-colors",
                        !slot.is_available
                          ? "cursor-not-allowed border-line bg-subtle text-ink-faint line-through"
                          : requested
                            ? "cursor-default border-success bg-success-bg font-medium text-status-confirmed"
                            : slotId === slot.slot_id
                              ? "border-accent-500 bg-accent-50 font-semibold text-accent-700"
                              : "border-line text-ink hover:border-line-strong hover:bg-subtle",
                      )}
                    >
                      {requested ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Clock3 className="size-3.5" aria-hidden="true" />
                      )}
                      {formatTime(slot.start_time)}
                      {requested && <span className="sr-only"> (requested)</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {confirmed && (
              <p
                ref={statusRef}
                tabIndex={-1}
                role="status"
                className="mt-4 flex items-start gap-2 rounded-md bg-warning-bg px-3 py-2 text-[12px] text-status-booked focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Request saved. It is <strong>awaiting staff confirmation</strong> —
                  the slot is not booked until a doctor or receptionist approves it.
                </span>
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
                setRequestError(null);
                setOpen(true);
              }}
            >
              Request appointment
            </Button>
            <p className="mt-3 text-center text-[12px] text-ink-faint">
              Demo clinic database · no reminders are sent
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            // The confirm button is disabled once no slot is selected, so move
            // focus to the status banner that explains what happened.
            if (statusRef.current) statusRef.current.focus();
            else confirmTriggerRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Confirm appointment</DialogTitle>
            <DialogDescription>
              This saves a pending request in the clinic database. The slot is
              only booked after staff confirms it.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-subtle p-4 text-[13px]">
            <p className="font-semibold text-ink">{doctor.full_name}</p>
            <p className="mt-1 text-ink-muted">
              {selected ? `${formatShortDate(selected.slot_date)} · ${formatTime(selected.start_time)}` : ""}
            </p>
          </div>
          {requestError && (
            <p className="mt-3 rounded-md bg-error-bg px-3 py-2 text-[13px] text-status-cancelled" role="alert">
              {requestError}
            </p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="accent"
              disabled={!selected || submitting}
              onClick={async () => {
                if (!selected) return;
                setSubmitting(true);
                setRequestError(null);
                const response = await apiClient.createAppointment({
                  doctor_id: doctorId,
                  slot_id: selected.slot_id,
                  reason: "New appointment request",
                });
                setSubmitting(false);
                if (!response.success) {
                  setRequestError(response.error?.message ?? "Could not send the request.");
                  return;
                }
                setRequestedIds((current) => [...current, selected.slot_id]);
                setOpen(false);
                setConfirmed(true);
                setSlotId(null);
                toast.success("Request saved — waiting for staff confirmation.");
              }}
            >
              {submitting ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
