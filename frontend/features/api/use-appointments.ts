"use client";

import { useSyncExternalStore } from "react";
import { apiClient } from "./client";
import type { Appointment } from "@/shared/apiTypes";

/**
 * Small external store for the role-scoped appointment list. Using
 * useSyncExternalStore keeps the initial fetch out of render-time effects while
 * still letting every screen share one snapshot and refresh after mutations.
 */
type State = {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
};

let state: State = { appointments: [], loading: true, error: null };
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function publish(next: Partial<State>): void {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Every screen that mounts gets a fresh snapshot; mutations may have happened
  // while no appointments screen was open.
  void refreshAppointments();
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

export function refreshAppointments(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    publish({ loading: true });
    const response = await apiClient.getAppointments();
    if (response.success && response.data) {
      publish({ appointments: response.data, error: null, loading: false });
    } else {
      publish({
        appointments: [],
        error: response.error?.message ?? "Could not load appointments.",
        loading: false,
      });
    }
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

function setAppointments(
  updater: Appointment[] | ((current: Appointment[]) => Appointment[]),
): void {
  const next = typeof updater === "function" ? updater(state.appointments) : updater;
  publish({ appointments: next });
}

export function useAppointments() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...snapshot,
    refresh: refreshAppointments,
    setAppointments,
  };
}
