import type { Metadata } from "next";
import { HealthView } from "@/components/portal/health-view";

export const metadata: Metadata = {
  title: "API health",
  description: "Live status of the OpenClinic API and database.",
};

export default function HealthPage() {
  return <HealthView />;
}
