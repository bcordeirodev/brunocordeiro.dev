import { getRequestConfig } from "next-intl/server";

// Placeholder request config so the next-intl plugin (wired in next.config.ts)
// can resolve during build. Full locale routing, messages and navigation
// helpers are implemented in the i18n task.
export default getRequestConfig(async () => {
  return { locale: "pt", messages: {} };
});
