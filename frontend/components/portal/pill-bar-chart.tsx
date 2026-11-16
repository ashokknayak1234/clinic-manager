"use client";

import { motion, useReducedMotion } from "motion/react";
import { weekLabels, weeklyAppointments } from "@/features/api/mock";

export function PillBarChart({
  values = [...weeklyAppointments],
  labels = [...weekLabels],
}: {
  values?: number[];
  labels?: string[];
}) {
  const reduced = useReducedMotion();
  const max = Math.max(...values);

  return (
    <div className="flex h-[150px] min-w-0 items-end justify-between gap-2">
      {values.map((value, index) => {
        const height = Math.round(Math.max(16, (value / max) * 118));
        return (
          <div
            key={`${labels[index]}-${index}`}
            className="group relative flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div className="relative flex h-[118px] w-full items-end justify-center">
              <div className="relative flex h-full w-full max-w-[42px] items-end justify-center rounded-full bg-track-indigo">
                <motion.div
                  className="relative w-full origin-bottom rounded-full bg-accent-500"
                  style={{ height }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <span
                    className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-surface ring-2 ring-surface"
                    aria-hidden="true"
                  />
                </motion.div>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 rounded-sm bg-navy-900 px-2 py-1 text-[12px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block"
              >
                {value} appointments
              </span>
            </div>
            <span className="text-[12px] text-ink-faint" aria-hidden="true">
              {labels[index]}
            </span>
            <span className="sr-only">
              {labels[index]}: {value} appointments
            </span>
          </div>
        );
      })}
    </div>
  );
}
