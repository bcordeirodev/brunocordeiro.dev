import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "en",
  localePrefix: "always",
  // en é o locale de entrada (público-alvo internacional), sem detecção
  // pelo idioma do navegador; o visitante troca para /pt pelo switcher.
  // Prefixo sempre presente: todas as URLs /pt/... seguem válidas.
  localeDetection: false,
});
