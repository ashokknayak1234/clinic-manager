"use client";

import { useRef, useState } from "react";
import { Pill } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { DataTable, type Column } from "@/components/portal/data-table";
import { EmptyState } from "@/components/portal/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { prescriptions } from "@/features/api/mock";
import { formatDate } from "@/lib/format";
import type { Prescription } from "@/shared/apiTypes";

export function PrescriptionsView() {
  const [selected, setSelected] = useState<Prescription | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const columns: Column<Prescription>[] = [
    {
      key: "id",
      header: "Prescription",
      render: (row) => (
        <span className="font-medium text-ink tabular">
          RX-{String(row.prescription_id).padStart(4, "0")}
        </span>
      ),
    },
    {
      key: "medicine",
      header: "Medication",
      render: (row) => row.items?.[0]?.medicine_name ?? "—",
    },
    {
      key: "dosage",
      header: "Dosage",
      render: (row) => row.items?.[0]?.dosage ?? "—",
    },
    {
      key: "frequency",
      header: "Frequency",
      render: (row) => row.items?.[0]?.frequency ?? "—",
    },
    {
      key: "duration",
      header: "Duration",
      render: (row) => row.items?.[0]?.duration ?? "—",
    },
    { key: "doctor", header: "Doctor", render: (row) => row.doctor_name },
    {
      key: "date",
      header: "Issued",
      render: (row) => (
        <span className="tabular">{formatDate(row.created_at)}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (row) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setSelected(row);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Medication record"
        title="Prescriptions"
        subtitle="Fictional prescriptions issued in the demo clinic."
      />
      <DemoBanner />

      <DataTable
        caption="Prescriptions"
        rows={prescriptions}
        getKey={(row) => row.prescription_id}
        columns={columns}
        empty={
          <EmptyState
            icon={Pill}
            title="No prescriptions"
            body="Prescriptions issued in the demo clinic will appear here."
            className="border-0"
          />
        }
      />

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          className="w-full bg-surface sm:max-w-[440px]"
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <SheetHeader>
            <SheetTitle>
              Prescription RX-{String(selected?.prescription_id ?? 0).padStart(4, "0")}
            </SheetTitle>
            <SheetDescription>
              {selected?.doctor_name} · {selected ? formatDate(selected.created_at) : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
                Patient
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                {selected?.patient_name}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
                Medication
              </p>
              {selected?.items?.map((item) => (
                <div
                  key={item.prescription_item_id}
                  className="rounded-lg border border-line p-3"
                >
                  <p className="text-[13px] font-semibold text-ink">
                    {item.medicine_name} {item.dosage}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-muted">
                    {item.frequency} · {item.duration}
                  </p>
                  {item.instructions && (
                    <p className="mt-1 text-[12px] text-ink-faint">
                      {item.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
                Notes
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {selected?.notes ?? "No notes recorded."}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
