"use client";

import { useRef, useState } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageTransition } from "@/components/motion/page-transition";
import { Sidebar, SidebarContent } from "@/components/portal/sidebar";
import { Topbar } from "@/components/portal/topbar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="min-h-screen bg-canvas p-3 lg:p-4">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <RequireAuth>
        <div className="mx-auto flex max-w-[1600px] gap-4">
          <aside className="hidden w-[226px] shrink-0 xl:block">
            <div className="sticky top-4 h-[calc(100vh-32px)]">
              <Sidebar />
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Topbar
              onMenu={(event) => {
                menuButtonRef.current = event.currentTarget;
                setNavOpen(true);
              }}
            />

            <main
              id="content"
              className="min-h-[calc(100vh-176px)] flex-1 rounded-2xl bg-panel p-4 lg:p-6"
            >
              <PageTransition>{children}</PageTransition>
            </main>

            <p className="pb-1 text-center text-[12px] text-ink-faint">
              OpenClinic demo workspace · Sample data only — connect a backend for
              live clinic workflows.
            </p>
          </div>
        </div>
      </RequireAuth>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="left"
          className="w-[280px] bg-panel p-5"
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            menuButtonRef.current?.focus();
          }}
        >
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <SidebarContent onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
