import type { Metadata } from "next";
import { RoleGate } from "@/components/auth/role-gate";
import { StaffView } from "@/components/portal/staff-view";

export const metadata: Metadata = {
  title: "Staff panel",
  description: "Clinic queues and operations for staff accounts.",
};

export default function StaffPage() {
  return (
    <RoleGate roles={["DOCTOR", "ADMIN", "RECEPTIONIST"]}>
      <StaffView />
    </RoleGate>
  );
}
