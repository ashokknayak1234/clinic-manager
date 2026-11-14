import type { Metadata } from "next";
import { Suspense } from "react";
import { AppointmentsView } from "@/components/portal/appointments-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Review and manage demo clinic appointments.",
};

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-16 w-64 rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-[520px] w-full rounded-xl" />
        </div>
      }
    >
      <AppointmentsView />
    </Suspense>
  );
}
