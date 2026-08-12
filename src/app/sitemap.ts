import type { MetadataRoute } from "next";
import { locales } from "@/content";
import { absoluteUrl, languageAlternates, localizedPath } from "@/lib/site";

const ROUTES = ["", "/link-charts"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(localizedPath(locale, route)),
      lastModified,
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
