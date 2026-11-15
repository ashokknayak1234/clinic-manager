"use client";

import { useAuth } from "@/providers/auth-provider";
import type { Role } from "@/shared/apiTypes";
import { EmptyState } from "@/components/portal/empty-state";
import { Lock } from "lucide-react";

export function RoleGate({
  roles,
  children,
  title = "Staff access only",
  body = "This area is available to clinic staff accounts. Sign in with a staff role to continue.",
}: {
  roles: Role[];
  children: React.ReactNode;
  title?: string;
  body?: string;
}) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return (
      <EmptyState icon={Lock} title={title} body={body} />
    );
  }

  return <>{children}</>;
}
