"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Search } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { DataTable, type Column } from "@/components/portal/data-table";
import { EmptyState } from "@/components/portal/empty-state";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDoctorByFullName } from "@/features/api/mock";
import { apiClient } from "@/features/api/client";
import { useAppointments } from "@/features/api/use-appointments";
import { DEMO_TODAY } from "@/lib/demo-clock";
import { formatShortDate, formatTime } from "@/lib/format";
import type { Appointment, AppointmentStatus, Role } from "@/shared/apiTypes";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { Check } from "lucide-react";

const statusOptions: Array<{ value: AppointmentStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Awaiting confirmation" },
  { value: "BOOKED", label: "Booked" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No show" },
];

const statusOrder: Record<AppointmentStatus, number> = {
  PENDING: 0,
  BOOKED: 1,
  CONFIRMED: 2,
  COMPLETED: 3,
  NO_SHOW: 4,
  CANCELLED: 5,
};

type SortKey = "date" | "patient" | "status";

/** The API always joins these fields even though the shared type marks them optional. */
type LiveAppointment = Appointment &
  Required<
    Pick<
      Appointment,
      "patient_name" | "doctor_name" | "slot_date" | "start_time" | "end_time"
    >
  >;

export function AppointmentsView() {
  const searchParams = useSearchParams();
  const paramSearch = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status");
  const paramStatus: AppointmentStatus | "all" = statusOptions.some(
    (option) => option.value === statusParam,
  )
    ? (statusParam as AppointmentStatus)
    : "all";
  const { user } = useAuth();
  const role: Role = user?.role ?? "PATIENT";
  const isStaff = role !== "PATIENT";
  const isPatient = role === "PATIENT";
  const {
    appointments: rawAppointments,
    loading,
    error,
    refresh,
    setAppointments,
  } = useAppointments();
  const appointments = rawAppointments as LiveAppointment[];
  // Named doctors are scoped by their joined doctor id; the generic
  // doctor@demo.com account has no profile row and keeps clinic-wide demo access.
  const currentDoctorId =
    role === "DOCTOR"
      ? user?.doctor_id ?? getDoctorByFullName(user?.full_name)?.doctor_id
      : undefined;
  const patientId = user?.patient_id;
  const patientNameKey = (user?.full_name ?? "").trim().toLowerCase();
  const patientEmailKey = (user?.email ?? "").trim().toLowerCase();
  const [search, setSearch] = useState(paramSearch);
  const [syncedParam, setSyncedParam] = useState(paramSearch);
  const [status, setStatus] = useState<AppointmentStatus | "all">(paramStatus);
  const [syncedStatus, setSyncedStatus] = useState(paramStatus);
  const [sort, setSort] = useState<SortKey>("date");
  const [cancelTarget, setCancelTarget] = useState<LiveAppointment | null>(null);
  const cancelTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Re-sync only when the URL parameter itself changes (for example when the
  // dashboard links to /appointments?search=Meera). Typing in the field updates
  // local state without touching the URL, so this never fights the user.
  if (paramSearch !== syncedParam) {
    setSyncedParam(paramSearch);
    setSearch(paramSearch);
  }
  // Same re-sync for the deep-linked status filter (?status=PENDING from the
  // staff queue card): when the URL parameter changes (or disappears),
  // follow it so a plain sidebar click always shows every appointment.
  if (paramStatus !== syncedStatus) {
    setSyncedStatus(paramStatus);
    setStatus(paramStatus);
  }

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = appointments.filter((item) => {
      // The API already scopes by role; keep a defensive client-side filter too.
      if (isPatient) {
        if (patientId && item.patient_id !== patientId) return false;
        if (!patientId && patientNameKey) {
          const emailMatches =
            Boolean(item.patient_email) &&
            item.patient_email!.toLowerCase() === patientEmailKey;
          const nameMatches =
            !item.patient_email &&
            item.patient_name.toLowerCase() === patientNameKey;
          if (!emailMatches && !nameMatches) return false;
        }
      }
      if (currentDoctorId && item.doctor_id !== currentDoctorId) return false;
      const matchesTerm =
        !term ||
        item.patient_name.toLowerCase().includes(term) ||
        (item.patient_email ?? "").toLowerCase().includes(term) ||
        (item.patient_phone ?? "").toLowerCase().includes(term) ||
        item.doctor_name.toLowerCase().includes(term);
      const matchesStatus = status === "all" || item.status === status;
      return matchesTerm && matchesStatus;
    });

    list.sort((a, b) => {
      if (sort === "patient") return a.patient_name.localeCompare(b.patient_name);
      if (sort === "status") return statusOrder[a.status] - statusOrder[b.status];
      return `${a.slot_date}T${a.start_time}`.localeCompare(
        `${b.slot_date}T${b.start_time}`,
      );
    });
    return list;
  }, [
    appointments,
    search,
    status,
    sort,
    isPatient,
    patientId,
    currentDoctorId,
    patientNameKey,
    patientEmailKey,
  ]);

  const cancellable = (row: LiveAppointment) =>
    (row.status === "PENDING" ||
      row.status === "BOOKED" ||
      row.status === "CONFIRMED") &&
    row.slot_date >= DEMO_TODAY;

  const columns: Column<LiveAppointment>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (row) => (
        <div className="min-w-[150px]">
          <span className="font-medium text-ink">{row.patient_name}</span>
          {isStaff && (row.patient_email || row.patient_phone) && (
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {[row.patient_email, row.patient_phone].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      ),
    },
    { key: "doctor", header: "Doctor", render: (row) => row.doctor_name },
    {
      key: "date",
      header: "Date",
      render: (row) => <span className="tabular">{formatShortDate(row.slot_date)}</span>,
    },
    {
      key: "time",
      header: "Time",
      render: (row) => (
        <span className="tabular">
          {formatTime(row.start_time)} – {formatTime(row.end_time)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Action",
      className: "text-right",
      render: (row) => {
        const confirmable =
          isStaff &&
          (row.status === "PENDING" || row.status === "BOOKED") &&
          (!currentDoctorId || row.doctor_id === currentDoctorId);
        if (confirmable) {
          return (
            <Button
              variant="ghost"
              size="xs"
              className="text-status-confirmed hover:bg-success-bg"
              onClick={async () => {
                const response = await apiClient.confirmAppointment(row.appointment_id);
                if (!response.success || !response.data) {
                  toast.error(response.error?.message ?? "Could not confirm the request.");
                  return;
                }
                const confirmed = response.data;
                setAppointments((current) =>
                  current.map((item) =>
                    item.appointment_id === confirmed.appointment_id ? confirmed : item,
                  ),
                );
                toast.success(`Appointment confirmed for ${row.patient_name}.`);
              }}
            >
              <Check className="size-3.5" aria-hidden="true" />
              Confirm
            </Button>
          );
        }
        return cancellable(row) ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-status-cancelled hover:bg-error-bg"
            onClick={(event) => {
              cancelTriggerRef.current = event.currentTarget;
              setCancelTarget(row);
            }}
          >
            Cancel
          </Button>
        ) : (
          <span className="text-[12px] text-ink-faint">—</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Clinic schedule"
        title="Appointments"
        subtitle={
          isPatient
            ? "Request and review your upcoming appointments."
            : currentDoctorId
              ? "Review and confirm appointment requests assigned to you."
              : "Filter, review, and confirm upcoming demo appointments."
        }
        actions={
          isPatient ? (
            <Button asChild variant="secondary">
              <Link href="/doctors">Request appointment</Link>
            </Button>
          ) : undefined
        }
      />
      <DemoBanner />

      {loading && (
        <p className="rounded-lg border border-line bg-surface p-4 text-[13px] text-ink-muted" role="status">
          Loading appointments…
        </p>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-error/20 bg-error-bg p-4 text-[13px] text-status-cancelled" role="alert">
          <span>{error}</span>
          <Button variant="secondary" size="xs" onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      )}
      {!loading && !error && (
      <DataTable
        caption="Appointments"
        rows={rows}
        getKey={(row) => row.appointment_id}
        columns={columns}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-[320px]">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
                aria-hidden="true"
              />
              <Input
                name="appointment-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search appointments…"
                aria-label="Search appointments"
                className="h-10 rounded-md border-line-strong pl-9 text-sm placeholder:text-ink-faint"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:ml-auto">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AppointmentStatus | "all")}
              >
                <SelectTrigger
                  className="h-10 w-full rounded-md border-line-strong px-3 text-[13px] sm:w-[170px]"
                  aria-label="Filter by status"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent data-lenis-prevent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <SelectTrigger
                  className="h-10 w-full rounded-md border-line-strong px-3 text-[13px] sm:w-[150px]"
                  aria-label="Sort appointments"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent data-lenis-prevent>
                  <SelectItem value="date">Sort by date</SelectItem>
                  <SelectItem value="patient">Sort by patient</SelectItem>
                  <SelectItem value="status">Sort by status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        empty={
          <EmptyState
            icon={CalendarDays}
            title={
              isPatient && !search.trim() && status === "all"
                ? "No appointments yet"
                : "No appointments match"
            }
            body={
              isPatient && !search.trim() && status === "all"
                ? "Book a consultation from the doctors page to create a request."
                : "Adjust the search term or status filter to see more rows."
            }
            className="border-0"
          />
        }
      />
      )}

      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            cancelTriggerRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Cancel appointment</DialogTitle>
            <DialogDescription>
              The appointment is marked Cancelled in the clinic database and the
              slot becomes available again.
            </DialogDescription>
          </DialogHeader>
          {cancelTarget && (
            <div className="rounded-lg bg-subtle p-4 text-[13px]">
              <p className="font-semibold text-ink">{cancelTarget.patient_name}</p>
              <p className="mt-1 text-ink-muted">
                {cancelTarget.doctor_name} · {formatShortDate(cancelTarget.slot_date)} ·{" "}
                {formatTime(cancelTarget.start_time)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              Keep appointment
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!cancelTarget) return;
                const response = await apiClient.cancelAppointment(cancelTarget.appointment_id);
                if (!response.success || !response.data) {
                  toast.error(response.error?.message ?? "Could not cancel the appointment.");
                  return;
                }
                const cancelled = response.data;
                setAppointments((current) =>
                  current.map((item) =>
                    item.appointment_id === cancelled.appointment_id ? cancelled : item,
                  ),
                );
                setCancelTarget(null);
                toast.success("Appointment cancelled.");
              }}
            >
              Cancel appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
