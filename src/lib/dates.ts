import type { Locale } from "@/content";

export function formatYearMonth(ym: string, locale: Locale): string {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, 1));
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(/\.\s?de\s?/g, " ")
    .replace(".", "")
    .trim();
}

export function formatPeriod(
  start: string,
  end: string | null,
  locale: Locale,
  currentLabel: string,
): string {
  return `${formatYearMonth(start, locale)} – ${end ? formatYearMonth(end, locale) : currentLabel}`;
}
