"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const demoAccounts = [
  { role: "Patient", email: "patient@demo.com", password: "patient123" },
  { role: "Doctor", email: "doctor@demo.com", password: "doctor123" },
  { role: "Admin", email: "admin@demo.com", password: "admin123" },
];

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setForgot(false);
    setLoading(true);
    const result = await login(
      { email: email.trim(), password: password.trim() },
      remember,
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Sign in failed");
      return;
    }
    router.replace(result.role === "PATIENT" ? "/dashboard" : "/staff");
  }

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.06em] text-primary-600 uppercase">
        Welcome back
      </p>
      <h1 className="mt-3 text-h1 text-ink">Sign in to OpenClinic</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Access your clinic workspace with your account.
      </p>

      <div className="mt-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary-600" aria-hidden="true" />
          <p className="text-[13px] font-semibold text-ink">Demo mode</p>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
          Use one of the accounts below. Do not enter real patient information.
        </p>
        <ul className="mt-3 space-y-1.5">
          {demoAccounts.map((account) => (
            <li key={account.email} className="text-[12px] text-ink-muted">
              <span className="font-medium text-ink">{account.role}:</span>{" "}
              {account.email} / {account.password}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <Alert
          className="mt-5 border-error/20 bg-error-bg text-status-cancelled"
          role="alert"
        >
          <AlertDescription className="text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] text-ink">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-[46px] rounded-md border-line-strong px-3 text-sm placeholder:text-ink-faint"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] text-ink">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-[46px] rounded-md border-line-strong px-3 pr-11 text-sm placeholder:text-ink-faint"
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
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(value) => setRemember(value === true)}
              className="size-4 rounded-sm border-line-strong data-[state=checked]:bg-primary-500"
            />
            <Label htmlFor="remember" className="text-[13px] font-normal text-ink-muted">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={() => setForgot(true)}
            className="text-[13px] font-medium text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </button>
        </div>

        {forgot && (
          <p className="rounded-md bg-subtle px-3 py-2 text-[12px] text-ink-muted">
            Password reset is not available in this prototype.
          </p>
        )}

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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        New patient?{" "}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Register as a patient
        </Link>
      </p>

      <p className="mt-6 flex items-start justify-center gap-2 text-center text-[12px] text-ink-faint">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Demo only · Do not enter real credentials or patient information.
      </p>
    </div>
  );
}
