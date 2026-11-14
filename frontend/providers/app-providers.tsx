"use client";

import { MotionConfig } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/auth-provider";
import { LenisProvider } from "@/providers/lenis-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <LenisProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </LenisProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
