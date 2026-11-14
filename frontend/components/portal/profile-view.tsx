"use client";

import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { initials } from "@/lib/format";
import type { Role } from "@/shared/apiTypes";

const displayNames: Record<Role, string> = {
  ADMIN: "Demo Admin",
  DOCTOR: "Dr. Demo Doctor",
  RECEPTIONIST: "Demo Reception",
  PATIENT: "Demo Patient",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  PATIENT: "Patient",
};

export function ProfileView() {
  const { user } = useAuth();
  const role = user?.role ?? "PATIENT";
  const name = displayNames[role];
  const [form, setForm] = useState({
    full_name: name,
    phone: "",
    date_of_birth: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });
  const [notice, setNotice] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice(false);
  }

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Account"
        title="Profile"
        subtitle="Your identity in the demo workspace."
      />
      <DemoBanner />

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-xl bg-accent-500 font-display text-[18px] font-bold text-white">
              {initials(name)}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">{name}</p>
              <p className="text-[12px] text-ink-muted">{roleLabels[role]}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-line pt-4 text-[13px]">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-ink-faint" aria-hidden="true" />
              <div>
                <p className="text-[12px] text-ink-faint">Email</p>
                <p className="font-medium text-ink">{user?.email ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-ink-faint" aria-hidden="true" />
              <div>
                <p className="text-[12px] text-ink-faint">Role</p>
                <p className="font-medium text-ink">{roleLabels[role]}</p>
              </div>
            </div>
          </div>

          <p className="mt-5 rounded-md bg-subtle p-3 text-[12px] text-ink-muted">
            Profile details are read from <code className="text-ink">/auth/me</code>.
            Edits below stay on this page only.
          </p>
        </aside>

        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="text-h3 text-ink">Profile details</h2>
          <p className="mt-1 text-[12px] text-ink-muted">
            Sample values only. Do not enter real patient information.
          </p>

          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(true);
            }}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="full_name" className="text-[13px] text-ink">
                Full name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                autoComplete="name"
                value={form.full_name}
                onChange={(event) => update("full_name", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] text-ink">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={user?.email ?? ""}
                readOnly
                className="h-11 rounded-md border-line bg-subtle px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[13px] text-ink">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-[13px] text-ink">
                Date of birth
              </Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                autoComplete="bday"
                value={form.date_of_birth}
                onChange={(event) => update("date_of_birth", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[13px] text-ink">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name" className="text-[13px] text-ink">
                Emergency contact name
              </Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                autoComplete="off"
                value={form.emergency_contact_name}
                onChange={(event) => update("emergency_contact_name", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone" className="text-[13px] text-ink">
                Emergency contact phone
              </Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="tel"
                autoComplete="off"
                inputMode="tel"
                value={form.emergency_contact_phone}
                onChange={(event) => update("emergency_contact_phone", event.target.value)}
                className="h-11 rounded-md border-line-strong px-3 text-sm"
              />
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
              <Button type="submit" variant="accent" className="md:w-fit">
                Save changes
              </Button>
              <p className="text-[12px] text-ink-faint">
                Saving is disabled in this prototype; the API has no profile update
                route.
              </p>
            </div>

            {notice && (
              <p
                role="status"
                className="rounded-md bg-primary-50 px-3 py-2 text-[12px] text-ink-muted md:col-span-2"
              >
                Profile changes are not saved in this prototype.
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
