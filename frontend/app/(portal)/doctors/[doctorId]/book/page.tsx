import type { Metadata } from "next";
import { BookingView } from "@/components/portal/booking-view";
import { RoleGate } from "@/components/auth/role-gate";

export const metadata: Metadata = {
  title: "Book appointment",
  description: "Choose a demo slot with a fictional OpenClinic provider.",
};

export default function BookAppointmentPage() {
  return (
    <RoleGate
      roles={["PATIENT"]}
      title="Patients only"
      body="Only patient accounts can request appointments. Staff can review and confirm requests from the appointments list."
    >
      <BookingView />
    </RoleGate>
  );
}
