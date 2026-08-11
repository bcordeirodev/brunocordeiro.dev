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

// Contagem inclusiva de meses (padrão LinkedIn): mar/2022 → ago/2026 = 4 anos 6 meses.
// Vínculos abertos (end null) contam até nowYm — a data de referência do conteúdo
// (profile.asOfYm), nunca o relógio: a página é prerenderizada (cacheComponents).
export function formatDuration(
  start: string,
  end: string | null,
  locale: Locale,
  nowYm?: string,
): string {
  const reference = end ?? nowYm;
  if (!reference) return "";
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = reference.split("-").map(Number);
  const totalMonths = ((ey ?? 0) - (sy ?? 0)) * 12 + ((em ?? 1) - (sm ?? 1)) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearLabel = locale === "pt" ? (years === 1 ? "ano" : "anos") : years === 1 ? "yr" : "yrs";
  const monthLabel =
    locale === "pt" ? (months === 1 ? "mês" : "meses") : months === 1 ? "mo" : "mos";
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${yearLabel}`);
  if (months > 0) parts.push(`${months} ${monthLabel}`);
  return parts.join(" ");
}
