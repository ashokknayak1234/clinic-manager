export const duration = {
  instant: 0.12,
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
  xslow: 0.6,
} as const;

export const ease = {
  standard: [0.2, 0.7, 0.3, 1],
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const spring = {
  type: "spring",
  stiffness: 210,
  damping: 26,
  mass: 0.9,
} as const;

export const stagger = { child: 0.06, max: 6, bar: 0.04 } as const;
