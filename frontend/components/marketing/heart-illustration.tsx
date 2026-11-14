export function HeartIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 270 350"
      className={className}
      role="img"
      aria-label="Illustration of an anatomical heart"
    >
      <defs>
        <linearGradient id="heart-body" x1="0" x2="0.8" y1="0" y2="1">
          <stop offset="0%" stopColor="#F0283A" />
          <stop offset="100%" stopColor="#B01524" />
        </linearGradient>
        <radialGradient id="heart-shine" cx="0.32" cy="0.24" r="0.6">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heart-vessel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#D94352" />
          <stop offset="100%" stopColor="#8E1120" />
        </linearGradient>
      </defs>

      <path
        d="M92 58c-8-28 4-48 24-52 18-4 34 8 38 26 6-20 26-30 44-22 20 9 25 34 12 54 24 18 38 48 34 82-6 60-48 104-104 148C84 250 42 206 36 146c-4-34 10-64 34-82 8-5 15-7 22-6Z"
        fill="url(#heart-body)"
      />
      <path
        d="M118 36c-4-22 6-34 20-34 12 0 20 8 22 20"
        fill="none"
        stroke="url(#heart-vessel)"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M158 22c14-14 34-12 44 2 8 12 4 28-6 38"
        fill="none"
        stroke="url(#heart-vessel)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M64 74c-16 20-22 46-18 72 8 52 44 88 88 120"
        fill="none"
        stroke="#8E1120"
        strokeOpacity="0.45"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse cx="102" cy="112" rx="46" ry="60" fill="url(#heart-shine)" />
      <path
        d="M128 96c18 22 22 48 12 74-8 22-26 38-48 46"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
