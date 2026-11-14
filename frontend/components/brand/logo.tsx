"use client";

import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-500">
        <HeartPulse
          className="size-[22px] text-white"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>
      {!compact && (
        <div className="flex flex-col justify-center">
          <span className="font-display text-[18px] leading-none font-bold tracking-[-0.02em] text-ink">
            OpenClinic
          </span>
          <span className="mt-1 text-[11px] leading-none font-bold tracking-[0.12em] text-ink-muted uppercase">
            Care management
          </span>
        </div>
      )}
    </div>
  );
}
