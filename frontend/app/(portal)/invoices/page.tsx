import type { Metadata } from "next";
import { InvoicesView } from "@/components/portal/invoices-view";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Review fictional invoices in the OpenClinic demo workspace.",
};

export default function InvoicesPage() {
  return <InvoicesView />;
}
