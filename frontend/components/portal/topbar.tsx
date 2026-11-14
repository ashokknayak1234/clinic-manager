"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Mail, Menu, Search, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export function Topbar({
  onMenu,
}: {
  onMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const role = user?.role ?? "PATIENT";
  const name = displayNames[role];

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/appointments?search=${encodeURIComponent(value)}` : "/appointments");
  }

  function onLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex h-20 items-center gap-3 rounded-xl bg-panel px-4 lg:px-5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenu}
        aria-label="Open workspace navigation"
        className="xl:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>

      <form
        onSubmit={onSearch}
        role="search"
        className={`${searchOpen ? "flex flex-1" : "hidden sm:flex"} items-center`}
      >
        <div className="relative h-11 w-full max-w-[332px]">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <Input
            name="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search appointments…"
            aria-label="Search appointments"
            className="h-11 rounded-md border-line bg-surface pr-10 pl-10 text-sm placeholder:text-ink-faint sm:w-[332px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-ink-muted hover:bg-subtle hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setSearchOpen((open) => !open)}
        aria-label={searchOpen ? "Close search" : "Open search"}
      >
        {searchOpen ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Search className="size-5" aria-hidden="true" />
        )}
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button
                variant="ghost"
                size="icon"
                disabled
                aria-label="Notifications are not connected in demo mode"
              >
                <Mail className="size-5" aria-hidden="true" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Notifications are not connected in demo mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button
                variant="ghost"
                size="icon"
                disabled
                aria-label="Notifications are not connected in demo mode"
                className="relative bg-surface"
              >
                <Bell className="size-5" aria-hidden="true" />
                <span
                  className="absolute top-2.5 right-2.5 size-2 rounded-full bg-warning"
                  aria-hidden="true"
                />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Notifications are not connected in demo mode</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex items-center gap-2.5 rounded-md p-1 transition-colors hover:bg-subtle"
            >
              <Avatar className="size-11 shrink-0 rounded-md after:hidden">
                <AvatarFallback className="rounded-md bg-accent-500 text-[13px] font-semibold text-white">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 lg:block text-left">
                <span className="block truncate text-[13px] font-semibold text-ink">
                  {name}
                </span>
                <span className="block text-[11px] text-ink-muted">{roleLabels[role]}</span>
              </span>
              <ChevronDown className="hidden size-4 text-ink-faint lg:block" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound className="size-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          aria-label="Sign out"
          className="bg-surface"
        >
          <LogOut className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
