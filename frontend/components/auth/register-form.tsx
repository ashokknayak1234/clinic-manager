"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_TODAY } from "@/lib/demo-clock";
import type { RegisterRequest } from "@/shared/apiTypes";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputClass =
  "h-[46px] rounded-md border-line-strong px-3 text-sm placeholder:text-ink-faint";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    phone: "",
    blood_group: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!values.full_name.trim()) next.full_name = "Enter your full name.";
    if (values.full_name.trim().length > 120)
      next.full_name = "Use 120 characters or fewer.";
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Choose a password.";
    else if (values.password.length < 8)
      next.password = "Use at least 8 characters.";
    if (values.confirm_password !== values.password)
      next.confirm_password = "Passwords do not match.";
    if (values.phone.trim().length > 30) next.phone = "Use 30 characters or fewer.";
    if (values.address.trim().length > 255)
      next.address = "Use 255 characters or fewer.";
    if (values.emergency_contact_name.trim().length > 120)
      next.emergency_contact_name = "Use 120 characters or fewer.";
    if (values.emergency_contact_phone.trim().length > 30)
      next.emergency_contact_phone = "Use 30 characters or fewer.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!validate()) return;

    const payload: RegisterRequest = {
      email: values.email.trim(),
      password: values.password,
      full_name: values.full_name.trim(),
    };

    // Optional keys are omitted entirely when blank. An empty blood_group
    // would fail the backend regex, so it is never sent as "".
    const optional: Array<[keyof RegisterRequest, string]> = [
      ["date_of_birth", values.date_of_birth],
      ["phone", values.phone.trim()],
      ["blood_group", values.blood_group],
      ["address", values.address.trim()],
      ["emergency_contact_name", values.emergency_contact_name.trim()],
      ["emergency_contact_phone", values.emergency_contact_phone.trim()],
    ];
    const optionalPayload: Partial<Record<keyof RegisterRequest, string>> = {};
    for (const [key, value] of optional) {
      if (value) {
        optionalPayload[key] = value;
      }
    }

    setLoading(true);
    const result = await register({ ...payload, ...optionalPayload });
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Registration failed");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.06em] text-primary-600 uppercase">
        Patient access
      </p>
      <h1 className="mt-3 text-h1 text-ink">Create your account</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Register as a patient to book appointments and view your records.
      </p>

      <div className="mt-5 flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50 p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
        <p className="text-[12px] leading-relaxed text-ink-muted">
          Demo only — do not enter real patient information.
        </p>
      </div>

      {error && (
        <Alert className="mt-5 border-error/20 bg-error-bg text-status-cancelled" role="alert">
          <AlertDescription className="text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-[13px] text-ink">
            Full name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            autoComplete="name"
            value={values.full_name}
            onChange={(event) => update("full_name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.full_name)}
            aria-describedby={fieldErrors.full_name ? "full_name-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.full_name && (
            <p id="full_name-error" role="alert" className="text-[12px] text-error">
              {fieldErrors.full_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] text-ink">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="text-[12px] text-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] text-ink">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-ink-muted hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" role="alert" className="text-[12px] text-error">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-[13px] text-ink">
            Confirm password
          </Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            value={values.confirm_password}
            onChange={(event) => update("confirm_password", event.target.value)}
            aria-invalid={Boolean(fieldErrors.confirm_password)}
            aria-describedby={
              fieldErrors.confirm_password ? "confirm_password-error" : undefined
            }
            className={inputClass}
          />
          {fieldErrors.confirm_password && (
            <p id="confirm_password-error" role="alert" className="text-[12px] text-error">
              {fieldErrors.confirm_password}
            </p>
          )}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
              Optional details
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth" className="text-[13px] text-ink">
              Date of birth
            </Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              autoComplete="bday"
              max={DEMO_TODAY}
              value={values.date_of_birth}
              onChange={(event) => update("date_of_birth", event.target.value)}
              className={inputClass}
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
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_group" className="text-[13px] text-ink">
              Blood group
            </Label>
            <Select
              name="blood_group"
              value={values.blood_group}
              onValueChange={(value) => update("blood_group", value)}
            >
              <SelectTrigger id="blood_group" className="h-[46px] w-full rounded-md border-line-strong px-3 text-sm">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent data-lenis-prevent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-[13px] text-ink">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              autoComplete="street-address"
              value={values.address}
              onChange={(event) => update("address", event.target.value)}
              aria-invalid={Boolean(fieldErrors.address)}
              className={inputClass}
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
              value={values.emergency_contact_name}
              onChange={(event) => update("emergency_contact_name", event.target.value)}
              aria-invalid={Boolean(fieldErrors.emergency_contact_name)}
              className={inputClass}
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
              value={values.emergency_contact_phone}
              onChange={(event) => update("emergency_contact_phone", event.target.value)}
              aria-invalid={Boolean(fieldErrors.emergency_contact_phone)}
              className={inputClass}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span
                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
