export function PageHeading({
  overline,
  title,
  subtitle,
  actions,
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {overline && (
          <p className="text-[12px] font-medium text-ink-faint">{overline}</p>
        )}
        <h1 className="mt-1 text-h1 text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
