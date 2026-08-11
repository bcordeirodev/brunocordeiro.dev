import type { Metadata } from "next";
import { locales, type Locale } from "@/content";

export const SITE_URL = "https://brunocordeiro.dev";

export const defaultLocale: Locale = "pt";

const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US" };
const LANGUAGE_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Builds `/{locale}{path}`, e.g. `localizedPath("pt", "/link-charts")`. */
export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

/** Resolves a path against {@link SITE_URL}. */
export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path}`;
}

/** hreflang → absolute URL map for a route, incl. `x-default`. */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [LANGUAGE_TAG[locale], absoluteUrl(localizedPath(locale, path))]),
    ),
    "x-default": absoluteUrl(localizedPath(defaultLocale, path)),
  };
}

/**
 * Shared metadata shape (canonical, hreflang alternates, OpenGraph, Twitter
 * card) for a given locale + route. `path` is the route segment after the
 * locale prefix, e.g. `""` for the home page or `"/link-charts"`.
 */
export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bruno Cordeiro",
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
