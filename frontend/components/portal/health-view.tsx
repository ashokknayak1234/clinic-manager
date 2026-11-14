"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Database, RefreshCw, Server } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/features/api/client";
import { cn } from "@/lib/utils";

type Check = {
  state: "loading" | "ok" | "error";
  message: string;
  latency?: number;
  meta?: string;
};

const initial: Check = { state: "loading", message: "Checking…" };

export function HealthView() {
  const [api, setApi] = useState<Check>(initial);
  const [database, setDatabase] = useState<Check>(initial);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  async function check() {
    const apiStart = performance.now();
    const apiResult = await apiClient.health();
    const apiLatency = Math.round(performance.now() - apiStart);
    setApi(
      apiResult.success && apiResult.data
        ? {
            state: "ok",
            message: apiResult.data.status,
            latency: apiLatency,
          }
        : {
            state: "error",
            message:
              apiResult.error?.message ??
              "The API is unreachable. Start FastAPI on port 8000.",
            latency: apiLatency,
          },
    );

    const dbStart = performance.now();
    const dbResult = await apiClient.healthDatabase();
    const dbLatency = Math.round(performance.now() - dbStart);
    setDatabase(
      dbResult.success && dbResult.data
        ? {
            state: "ok",
            message: dbResult.data.status,
            latency: dbLatency,
            meta: `${dbResult.data.database_name} · ${dbResult.data.version}`,
          }
        : {
            state: "error",
            message:
              dbResult.error?.message ??
              "Database unreachable. Check that MySQL is running.",
            latency: dbLatency,
          },
    );

    setCheckedAt(new Date().toLocaleTimeString("en-IN", { hour12: false }));
  }

  useEffect(() => {
    // Fetch-on-mount: every state update inside check() happens after the
    // network response, so this cannot cascade synchronous renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void check();
    const interval = window.setInterval(() => {
      void check();
    }, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  const cards = [
    {
      key: "api",
      icon: Server,
      title: "FastAPI service",
      check: api,
      detail: "GET /api/v1/health",
    },
    {
      key: "db",
      icon: Database,
      title: "MySQL database",
      check: database,
      detail: "GET /api/v1/health/database",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-20 max-w-[1100px] items-center justify-between px-5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-5 px-5 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-primary-600 uppercase">
              System status
            </p>
            <h1 className="mt-2 text-h1 text-ink">API health</h1>
            <p className="mt-1 text-[13px] text-ink-muted">
              Live checks against the local FastAPI backend. Refreshes every 15
              seconds.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => void check()}>
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Refresh now
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map(({ key, icon: Icon, title, check: result, detail }) => (
            <section key={key} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary-50">
                    <Icon className="size-4 text-primary-600" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
                    <p className="text-[12px] text-ink-faint">{detail}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex h-6 items-center gap-1.5 rounded-sm px-2 text-[12px] font-medium",
                    result.state === "ok" && "bg-success-bg text-status-confirmed",
                    result.state === "error" && "bg-error-bg text-status-cancelled",
                    result.state === "loading" && "bg-subtle text-status-noshow",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      result.state === "ok" && "bg-success",
                      result.state === "error" && "bg-error",
                      result.state === "loading" && "bg-status-noshow-dot animate-pulse",
                    )}
                    aria-hidden="true"
                  />
                  {result.state === "ok"
                    ? "Operational"
                    : result.state === "error"
                      ? "Unreachable"
                      : "Checking"}
                </span>
              </div>

              <p className="mt-4 text-[13px] text-ink-muted">{result.message}</p>
              {result.meta && (
                <p className="mt-1 text-[12px] text-ink-faint">{result.meta}</p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-subtle px-3 text-[12px] text-ink-muted tabular">
                  <Activity className="size-3.5" aria-hidden="true" />
                  {result.latency !== undefined ? `${result.latency} ms` : "—"}
                </span>
                {checkedAt && (
                  <span className="text-[12px] text-ink-faint">
                    Last checked {checkedAt}
                  </span>
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-[12px] text-ink-muted">
          The database check needs MySQL running. If it is unavailable, this page
          reports an unreachable state rather than waiting indefinitely.
        </p>
      </main>
    </div>
  );
}
