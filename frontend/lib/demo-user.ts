import type { Role, User } from "@/shared/apiTypes";

/**
 * Fallback labels for demo accounts that have no patients/doctors profile row.
 * Real registrations and named doctors use the `full_name` returned by
 * `/auth/me`, which is joined from those tables.
 */
export const displayNames: Record<Role, string> = {
  ADMIN: "Demo Admin",
  DOCTOR: "Dr. Demo Doctor",
  RECEPTIONIST: "Demo Reception",
  PATIENT: "Demo Patient",
};

export const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  PATIENT: "Patient",
};

export function displayNameForUser(
  user: Pick<User, "role" | "full_name"> | null | undefined,
  fallbackRole: Role = "PATIENT",
): string {
  const name = user?.full_name?.trim();
  if (name) return name;
  return displayNames[user?.role ?? fallbackRole];
}

export function displayNameFor(role: Role): string {
  return displayNames[role];
}

export function roleLabelFor(role: Role): string {
  return roleLabels[role];
}
