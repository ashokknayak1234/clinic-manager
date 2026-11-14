"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Pill,
  ReceiptText,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PromoCard } from "@/components/portal/promo-card";
import { useAuth } from "@/providers/auth-provider";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Role } from "@/shared/apiTypes";

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard };

const patientNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Prescriptions", href: "/prescriptions", icon: Pill },
  { label: "Invoices", href: "/invoices", icon: ReceiptText },
];

const staffNav: NavItem[] = [
  { label: "Staff panel", href: "/staff", icon: ClipboardList },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
];

function navFor(role: Role): NavItem[] {
  return role === "PATIENT" ? patientNav : staffNav;
}

const displayNames: Partial<Record<Role, string>> = {
  PATIENT: "Demo Patient",
  DOCTOR: "Dr. Demo Doctor",
  ADMIN: "Demo Admin",
  RECEPTIONIST: "Demo Reception",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  PATIENT: "Patient",
};

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-9 items-center gap-2 rounded-[10px] px-3 text-sm transition-colors",
        active
          ? "font-semibold text-ink"
          : "font-medium text-ink-muted hover:bg-subtle hover:text-ink",
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-5 h-[34px] w-[5px] -translate-y-1/2 rounded-r-sm bg-accent-500"
        />
      )}
      <Icon
        className={cn("size-[18px]", active ? "text-accent-500" : "text-ink-faint")}
        strokeWidth={active ? 2.2 : 1.8}
        aria-hidden="true"
      />
      {item.label}
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const role = user?.role ?? "PATIENT";
  const items = navFor(role);
  const nameByRole = displayNames[role] ?? "Demo User";
  const displayName = user?.email
    ? role === "PATIENT"
      ? nameByRole
      : nameByRole
    : "Demo User";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-7">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Workspace">
        <p className="mb-2.5 px-3 text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
          Workspace
        </p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>

        <p className="mt-6 mb-2.5 px-3 text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
          Account
        </p>
        <ul>
          <li>
            <NavLink
              item={{ label: "Profile", href: "/profile", icon: UserRound }}
              onNavigate={onNavigate}
            />
          </li>
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <PromoCard />
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-subtle"
        >
          <span className="flex size-[34px] items-center justify-center rounded-full bg-accent-500 text-[12px] font-semibold text-white">
            {initials(displayName)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              {displayName}
            </span>
            <span className="block text-[11px] text-ink-muted">
              {roleLabels[role]}
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="h-full rounded-xl bg-panel p-5">
      <SidebarContent />
    </div>
  );
}
