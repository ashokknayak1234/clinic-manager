import { cn } from "@/lib/utils";

type Variant = "line" | "area" | "bars";

function buildPath(values: number[], width: number, height: number): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1 || 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function Sparkline({
  values = [4, 9, 6, 12, 8, 14, 11, 16],
  variant = "line",
  width = 220,
  height = 56,
  className,
  label,
}: {
  values?: number[];
  variant?: Variant;
  width?: number;
  height?: number;
  className?: string;
  label?: string;
}) {
  if (variant === "bars") {
    const max = Math.max(...values);
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn("text-primary-500", className)}
        role="img"
        aria-label={label ?? "Sample bar trend"}
      >
        {values.map((value, index) => {
          const barWidth = width / (values.length * 1.8);
          const gap = (width - barWidth * values.length) / (values.length - 1 || 1);
          const barHeight = Math.max(4, (value / max) * (height - 6));
          return (
            <rect
              key={index}
              x={index * (barWidth + gap)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={barWidth / 2}
              fill="currentColor"
              opacity={index === values.length - 1 ? 1 : 0.35}
            />
          );
        })}
      </svg>
    );
  }

  const path = buildPath(values, width, height);
  const area = `${path} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-primary-500", className)}
      role="img"
      aria-label={label ?? "Sample trend line"}
    >
      {variant === "area" && (
        <>
          <defs>
            <linearGradient id="spark-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#spark-area)" />
        </>
      )}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
