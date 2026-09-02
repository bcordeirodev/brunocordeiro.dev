import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "@/components/motion/transition-link";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("nav");

  const anchors = [
    { href: "/#projects", label: t("projects") },
    { href: "/link-charts", label: t("caseStudy"), isRoute: true as const },
    { href: "/#experience", label: t("trajectory") },
    { href: "/#stack", label: t("stack") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <TransitionLink href="/" className="font-mono text-sm font-semibold tracking-tight">
          brunocordeiro.dev
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
              <Link key={anchor.href} href={anchor.href} className="hover:text-foreground">
                {anchor.label}
              </Link>
            ),
          )}
        </nav>

        <LocaleSwitcher locale={locale} />
      </div>
    </header>
  );
}
