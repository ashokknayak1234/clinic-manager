import type { Metadata } from "next";
import { PrescriptionsView } from "@/components/portal/prescriptions-view";

export const metadata: Metadata = {
  title: "Prescriptions",
  description: "Review fictional prescriptions in the OpenClinic demo workspace.",
};

export default function PrescriptionsPage() {
  return <PrescriptionsView />;
}
