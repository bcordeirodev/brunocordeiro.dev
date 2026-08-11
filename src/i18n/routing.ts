import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "always",
  // pt is the canonical entry locale regardless of the visitor's browser
  // language; users switch to /en explicitly via the locale switcher.
  localeDetection: false,
});
