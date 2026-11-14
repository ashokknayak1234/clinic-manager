import type { Metadata } from "next";
import { DoctorsView } from "@/components/portal/doctors-view";

export const metadata: Metadata = {
  title: "Doctors",
  description: "Browse fictional providers in the OpenClinic demo workspace.",
};

export default function DoctorsPage() {
  return <DoctorsView />;
}
