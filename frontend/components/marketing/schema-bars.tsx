"use client";

import { motion, useReducedMotion } from "motion/react";

const bars = [
  { label: "Tables", value: 15 },
  { label: "Views", value: 2 },
  { label: "FKs", value: 18 },
  { label: "Triggers", value: 2 },
  { label: "Checks", value: 10 },
];

const max = Math.max(...bars.map((bar) => bar.value));

export function SchemaBars() {
  const reduced = useReducedMotion();

  return (
    <div className="mt-6 flex h-[240px] items-end justify-between gap-2">
      {bars.map((bar, index) => {
        const height = Math.round(56 + (bar.value / max) * 170);
        return (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
            <p className="text-[12px] text-ink-faint tabular">{bar.value}</p>
            <motion.div
              className="w-full max-w-14 origin-bottom rounded-[28px] bg-primary-500"
              style={{ height }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }
              }
            />
            <p className="text-center text-[12px] text-ink-muted">
              {bar.label} {bar.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
