import type { MetadataRoute } from "next";
import { getContent, locales } from "@/content";
import { absoluteUrl, defaultLocale, languageAlternates, localizedPath } from "@/lib/site";

const ROUTES = ["", "/link-charts"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Estável entre builds: acompanha o ritual mensal de atualização do
  // conteúdo (asOfYm) em vez de mudar a cada deploy.
  const lastModified = `${getContent(defaultLocale).profile.asOfYm}-01`;
  return locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(localizedPath(locale, route)),
      lastModified,
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
