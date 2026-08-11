import { siteContentSchema, type SiteContent } from "@/domain";
import { ptContent } from "./pt";
import { enContent } from "./en";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

const raw: Record<Locale, unknown> = { pt: ptContent, en: enContent };

export function getContent(locale: Locale): SiteContent {
  return siteContentSchema.parse(raw[locale]);
}
