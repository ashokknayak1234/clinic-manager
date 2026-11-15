"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Stethoscope } from "lucide-react";
import { PageHeading } from "@/components/portal/page-heading";
import { DemoBanner } from "@/components/portal/demo-banner";
import { EmptyState } from "@/components/portal/empty-state";
import { DoctorStatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, doctors } from "@/features/api/mock";
import { formatCurrency, initials } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";

export function DoctorsView() {
  const { user } = useAuth();
  const isPatient = (user?.role ?? "PATIENT") === "PATIENT";
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesTerm =
        !term ||
        doctor.full_name.toLowerCase().includes(term) ||
        (doctor.specialty ?? "").toLowerCase().includes(term);
      const matchesDepartment =
        department === "all" || doctor.department_name === department;
      return matchesTerm && matchesDepartment;
    });
  }, [search, department]);

  return (
    <div className="space-y-4">
      <PageHeading
        overline="Care directory"
        title="Doctors"
        subtitle="Browse fictional providers and their next availability."
      />
      <DemoBanner />

      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-[320px]">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
              aria-hidden="true"
            />
            <Input
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctors…"
              aria-label="Search doctors"
              className="h-11 rounded-md border-line-strong pl-9 text-sm placeholder:text-ink-faint"
            />
          </div>
          <div className="sm:ml-auto">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger
                className="h-11 w-full rounded-md border-line-strong px-3 text-sm sm:w-[220px]"
                aria-label="Filter by department"
              >
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent data-lenis-prevent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((item) => (
                  <SelectItem key={item.department_id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors match"
          body="Try a different name or department filter."
          className="py-16"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doctor) => (
            <article
              key={doctor.doctor_id}
              className="flex flex-col rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-700">
                    {initials(doctor.full_name)}
                  </span>
                  <div>
                    <h2 className="text-[15px] font-semibold text-ink">
                      {doctor.full_name}
                    </h2>
                    <p className="text-[12px] text-ink-muted">{doctor.specialty}</p>
                  </div>
                </div>
                <DoctorStatusBadge active={doctor.is_active} />
              </div>

              <p className="mt-4 text-[13px] text-ink-muted">
                {doctor.profile_details}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-subtle p-3">
                <div>
                  <dt className="text-[12px] text-ink-faint">Next available</dt>
                  <dd className="mt-0.5 text-[12px] font-semibold text-ink">
                    {doctor.next_available}
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-faint">Consultation</dt>
                  <dd className="mt-0.5 text-[12px] font-semibold text-ink tabular">
                    {formatCurrency(doctor.consultation_fee)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center gap-2">
                {isPatient ? (
                  doctor.is_active ? (
                    <Button asChild size="sm" className="rounded-full">
                      <Link href={`/doctors/${doctor.doctor_id}/book`}>Book</Link>
                    </Button>
                  ) : (
                    <Button size="sm" disabled className="rounded-full">
                      On leave
                    </Button>
                  )
                ) : (
                  <span className="text-[12px] text-ink-faint">
                    Patients book · staff confirm
                  </span>
                )}
                <Link
                  href="/appointments"
                  className="text-[12px] font-medium text-primary-600 hover:text-primary-700"
                >
                  View appointments
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
