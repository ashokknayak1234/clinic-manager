"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas p-4" aria-busy="true">
        <div className="mx-auto flex max-w-[1600px] gap-4">
          <Skeleton className="hidden h-[calc(100vh-32px)] w-[226px] rounded-xl lg:block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-[calc(100vh-184px)] rounded-2xl" />
          </div>
        </div>
        <span className="sr-only">Loading your workspace</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
        Redirecting to sign in…
      </div>
    );
  }

  return <>{children}</>;
}
