import type { Metadata } from "next";
import { DashboardView } from "@/components/portal/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your clinic care at a glance in the OpenClinic demo workspace.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
