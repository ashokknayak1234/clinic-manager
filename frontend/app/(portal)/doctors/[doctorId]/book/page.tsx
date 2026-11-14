import type { Metadata } from "next";
import { BookingView } from "@/components/portal/booking-view";

export const metadata: Metadata = {
  title: "Book appointment",
  description: "Choose a demo slot with a fictional OpenClinic provider.",
};

export default function BookAppointmentPage() {
  return <BookingView />;
}
