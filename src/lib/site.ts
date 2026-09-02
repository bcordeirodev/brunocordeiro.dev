import type { Metadata } from "next";
import { locales, type Locale } from "@/content";

export const SITE_URL = "https://brunocordeiro.dev";

export const defaultLocale: Locale = "en";

const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US" };

// hreflang: além da tag regional, emitimos o "pt" genérico (cobre pt-PT etc.).
const LANGUAGE_TAGS: Record<Locale, string[]> = { pt: ["pt", "pt-BR"], en: ["en"] };
const CANONICAL_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Tag BCP 47 canônica do locale, ex.: `languageTag("pt")` → `"pt-BR"`. */
export function languageTag(locale: Locale): string {
  return CANONICAL_TAG[locale];
}

/** Builds `/{locale}{path}`, e.g. `localizedPath("pt", "/link-charts")`. */
export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

/** Resolves a path against {@link SITE_URL}. */
export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path}`;
}

// Dimensões e id declarados em `src/app/[locale]/opengraph-image.tsx`.
const OG_IMAGE = { id: "card", width: 1200, height: 630 } as const;

/**
 * URL absoluta da OG image do locale.
 *
 * Rotas que declaram `openGraph` explicitamente NÃO herdam a imagem da
 * convenção de arquivo do segmento `[locale]` ancestral — o objeto `openGraph`
 * do filho substitui o do pai por inteiro. Sem apontar a imagem aqui,
 * `/[locale]/link-charts` e `/[locale]/cv` saíam sem `og:image` e todo
 * compartilhamento delas renderizava como texto puro.
 */
export function ogImageUrl(locale: Locale): string {
  return absoluteUrl(`${localizedPath(locale)}/opengraph-image/${OG_IMAGE.id}`);
}

/** hreflang → absolute URL map for a route, incl. `x-default`. */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.flatMap((locale) =>
        LANGUAGE_TAGS[locale].map((tag) => [tag, absoluteUrl(localizedPath(locale, path))]),
      ),
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
      images: [
        {
          url: ogImageUrl(locale),
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
          type: "image/png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl(locale)],
    },
  };
}
