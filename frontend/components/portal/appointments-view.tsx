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
import { appointments, confirmAppointment, type DemoAppointment } from "@/features/api/mock";
import { DEMO_TODAY } from "@/lib/demo-clock";
import { formatShortDate, formatTime } from "@/lib/format";
import type { AppointmentStatus } from "@/shared/apiTypes";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { Check } from "lucide-react";

const statusOptions: Array<{ value: AppointmentStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "BOOKED", label: "Booked" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No show" },
];

const statusOrder: Record<AppointmentStatus, number> = {
  BOOKED: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  NO_SHOW: 3,
  CANCELLED: 4,
};

type SortKey = "date" | "patient" | "status";

export function AppointmentsView() {
  const searchParams = useSearchParams();
  const paramSearch = searchParams.get("search") ?? "";
  const paramStatus: AppointmentStatus | "all" =
    searchParams.get("status") === "BOOKED" ? "BOOKED" : "all";
  const { user } = useAuth();
  const isStaff = user ? user.role !== "PATIENT" : false;
  const isPatient = (user?.role ?? "PATIENT") === "PATIENT";
  const [search, setSearch] = useState(paramSearch);
  const [syncedParam, setSyncedParam] = useState(paramSearch);
  const [status, setStatus] = useState<AppointmentStatus | "all">(paramStatus);
  const [syncedStatus, setSyncedStatus] = useState(paramStatus);
  const [sort, setSort] = useState<SortKey>("date");
  const [overrides, setOverrides] = useState<Record<number, AppointmentStatus>>({});
  const [cancelTarget, setCancelTarget] = useState<DemoAppointment | null>(null);
  const cancelTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Re-sync only when the URL parameter itself changes (for example when the
  // dashboard links to /appointments?search=Meera). Typing in the field updates
  // local state without touching the URL, so this never fights the user.
  if (paramSearch !== syncedParam) {
    setSyncedParam(paramSearch);
    setSearch(paramSearch);
  }
  // Same re-sync for the deep-linked status filter (?status=BOOKED from the
  // staff queue card): when the URL parameter changes (or disappears),
  // follow it so a plain sidebar click always shows every appointment.
  if (paramStatus !== syncedStatus) {
    setSyncedStatus(paramStatus);
    setStatus(paramStatus);
  }

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = appointments
      .map((item) => ({
        ...item,
        status: overrides[item.appointment_id] ?? item.status,
      }))
      .filter((item) => {
        const matchesTerm =
          !term ||
          item.patient_name.toLowerCase().includes(term) ||
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
  }, [search, status, sort, overrides]);

  const cancellable = (row: DemoAppointment) =>
    (row.status === "BOOKED" || row.status === "CONFIRMED") &&
    row.slot_date >= DEMO_TODAY;

  const columns: Column<DemoAppointment>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (row) => <span className="font-medium text-ink">{row.patient_name}</span>,
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
        const confirmable = isStaff && row.status === "BOOKED";
        if (confirmable) {
          return (
            <Button
              variant="ghost"
              size="xs"
              className="text-status-confirmed hover:bg-success-bg"
              onClick={() => {
                confirmAppointment(row.appointment_id);
                setOverrides((prev) => ({
                  ...prev,
                  [row.appointment_id]: "CONFIRMED",
                }));
                toast.success(
                  `Appointment confirmed for ${row.patient_name} (demo table).`,
                );
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
        subtitle="Filter, review, and cancel upcoming demo appointments."
        actions={
          isPatient ? (
            <Button asChild variant="secondary">
              <Link href="/doctors">Request appointment</Link>
            </Button>
          ) : undefined
        }
      />
      <DemoBanner />

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
            title="No appointments match"
            body="Adjust the search term or status filter to see more rows."
            className="border-0"
          />
        }
      />

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
              This only changes the demo table. The backend keeps no appointment
              record.
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
              onClick={() => {
                if (cancelTarget) {
                  setOverrides((current) => ({
                    ...current,
                    [cancelTarget.appointment_id]: "CANCELLED",
                  }));
                }
                setCancelTarget(null);
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
