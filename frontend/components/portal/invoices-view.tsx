"use client";

import { ReceiptText } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { DataTable, type Column } from "@/components/portal/data-table";
import { EmptyState } from "@/components/portal/empty-state";
import { InvoiceStatusBadge } from "@/components/portal/status-badge";
import { invoices, invoiceSummary } from "@/features/api/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice } from "@/shared/apiTypes";

export function InvoicesView() {
  const summaryCards = [
    { label: "Billed", value: invoiceSummary.billed, caption: "Across demo invoices" },
    { label: "Paid", value: invoiceSummary.paid, caption: "Recorded payments" },
    {
      label: "Outstanding",
      value: invoiceSummary.outstanding,
      caption: "Balance to collect",
    },
  ];

  const columns: Column<Invoice>[] = [
    {
      key: "id",
      header: "Invoice",
      render: (row) => (
        <span className="font-medium text-ink tabular">
          INV-{String(row.invoice_id).padStart(4, "0")}
        </span>
      ),
    },
    { key: "patient", header: "Patient", render: (row) => row.patient_name },
    { key: "service", header: "Service", render: (row) => row.service_name },
    {
      key: "total",
      header: "Total",
      className: "text-right",
      render: (row) => (
        <span className="tabular">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      key: "paid",
      header: "Paid",
      className: "text-right",
      render: (row) => (
        <span className="tabular">{formatCurrency(row.paid_amount)}</span>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      className: "text-right",
      render: (row) => (
        <span className="tabular">{formatCurrency(row.balance_amount)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <InvoiceStatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Issued",
      render: (row) => <span className="tabular">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Billing"
        title="Invoices"
        subtitle="Fictional billing records for the demonstration workspace."
      />
      <DemoBanner />

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-3 font-display text-[30px] leading-none font-bold tabular text-ink">
              {formatCurrency(card.value)}
            </p>
            <p className="mt-2 text-[12px] text-ink-faint">{card.caption}</p>
          </article>
        ))}
      </div>

      <DataTable
        caption="Invoices"
        rows={invoices}
        getKey={(row) => row.invoice_id}
        columns={columns}
        empty={
          <EmptyState
            icon={ReceiptText}
            title="No invoices"
            body="Demo invoices will appear here."
            className="border-0"
          />
        }
      />
    </div>
  );
}
