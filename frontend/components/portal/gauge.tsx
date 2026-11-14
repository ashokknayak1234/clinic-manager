"use client";

import { motion, useReducedMotion } from "motion/react";
import { todaysStatusCounts, todayAppointments } from "@/features/api/mock";

export function Gauge() {
  const reduced = useReducedMotion();
  const counts = todaysStatusCounts();
  const total = todayAppointments.length;
  const completed = counts.COMPLETED;
  const inProgress = counts.CONFIRMED;
  const remaining = total - completed - inProgress;
  const percent = Math.round((completed / total) * 100);

  const radius = 92;
  const circumference = Math.PI * radius;

  const segments = [
    {
      key: "completed",
      fraction: completed / total,
      color: "var(--color-accent-500)",
    },
    {
      key: "in-progress",
      fraction: inProgress / total,
      color: "var(--color-navy-700)",
    },
    {
      key: "remaining",
      fraction: remaining / total,
      color: "var(--color-accent-200)",
    },
  ];

  let cursor = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[118px] w-[212px]">
        <svg
          viewBox="0 0 212 118"
          className="size-full"
          role="img"
          aria-label={`${percent}% of today's visits completed`}
        >
          <path
            d="M 14 106 A 92 92 0 0 1 198 106"
            fill="none"
            stroke="var(--color-track-indigo)"
            strokeWidth="28"
            strokeLinecap="round"
          />
          {segments.map((segment, index) => {
            const start = cursor;
            cursor += segment.fraction;
            const hiddenOffset = circumference * (1 - start) + circumference * segment.fraction;
            const targetOffset = -circumference * start;
            return (
              <motion.path
                key={segment.key}
                d="M 14 106 A 92 92 0 0 1 198 106"
                fill="none"
                stroke={segment.color}
                strokeWidth="28"
                strokeLinecap="round"
                strokeDasharray={`${circumference * segment.fraction} ${circumference}`}
                initial={
                  reduced
                    ? { strokeDashoffset: targetOffset }
                    : { strokeDashoffset: hiddenOffset }
                }
                whileInView={{ strokeDashoffset: targetOffset }}
                viewport={{ once: true, amount: 0.4 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }
                }
              />
            );
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-display text-[34px] leading-none font-bold tabular text-ink">
            {percent}%
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">of today&apos;s visits</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <li className="flex items-center gap-1.5 text-[12px] text-ink-muted">
          <span className="size-2 rounded-full bg-accent-500" aria-hidden="true" />
          Completed
        </li>
        <li className="flex items-center gap-1.5 text-[12px] text-ink-muted">
          <span className="size-2 rounded-full bg-navy-700" aria-hidden="true" />
          In progress
        </li>
        <li className="flex items-center gap-1.5 text-[12px] text-ink-muted">
          <span className="size-2 rounded-full bg-accent-200" aria-hidden="true" />
          Remaining
        </li>
      </ul>
    </div>
  );
}
