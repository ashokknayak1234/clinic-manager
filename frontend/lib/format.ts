const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  timeZone: "UTC",
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatShortDate(value: string | Date): string {
  return shortDateFormatter.format(new Date(value));
}

export function formatWeekday(value: string | Date): string {
  return weekdayFormatter.format(new Date(value));
}

export function formatTime(value: string): string {
  const [hours = "0", minutes = "0"] = value.split(":");
  const hour = Number(hours);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalised = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalised}:${minutes.padStart(2, "0")} ${suffix}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
