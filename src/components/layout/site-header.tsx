import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "@/components/motion/transition-link";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["pt", "en"];

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("nav");

  const anchors = [
    { href: "#stack", label: t("stack") },
    { href: "/link-charts", label: t("caseStudy"), isRoute: true as const },
    { href: "#trajetoria", label: t("trajectory") },
    { href: "#contato", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <TransitionLink href="/" className="font-mono text-sm font-semibold tracking-tight">
          bruno.dev
        </TransitionLink>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          {anchors.map((anchor) =>
            anchor.isRoute ? (
              <TransitionLink
                key={anchor.href}
                href={anchor.href}
                className="hover:text-foreground"
              >
                {anchor.label}
              </TransitionLink>
            ) : (
              <a key={anchor.href} href={anchor.href} className="hover:text-foreground">
                {anchor.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 text-xs">
          {LOCALES.map((loc, index) => (
            <span key={loc} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted">
                  /
                </span>
              ) : null}
              <Link
                href="/"
                locale={loc}
                aria-current={locale === loc ? "true" : undefined}
                className={cn(
                  "uppercase",
                  locale === loc ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {loc}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
