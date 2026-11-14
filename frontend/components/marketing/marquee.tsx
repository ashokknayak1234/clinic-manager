const items = [
  "Appointments",
  "Patients",
  "Prescriptions",
  "Billing",
  "Reports",
  "Audit log",
];

export function Marquee() {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line bg-surface py-4"
    >
      <div className="flex w-max animate-marquee items-center whitespace-nowrap">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-6 pr-6 text-[13px] font-medium text-ink-muted"
          >
            {item}
            <span className="text-primary-400">❖</span>
          </span>
        ))}
      </div>
    </div>
  );
}
