import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "@/components/motion/transition-link";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav, type NavItem } from "@/components/layout/mobile-nav";

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("nav");

  // Mesma ordem das seções na home.
  const anchors: NavItem[] = [
    { href: "/#experience", label: t("trajectory") },
    { href: "/#projects", label: t("projects") },
    { href: "/#stack", label: t("stack") },
    { href: "/link-charts", label: t("caseStudy"), isRoute: true },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      {/* Uma linha em qualquer largura: abaixo de `md` as âncoras vão para o
          MobileNav; a partir de `md` cabem em linha (logo + 5 links + idioma
          somam ~680px). */}
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2 md:py-4">
        <TransitionLink href="/" className="font-mono text-sm font-semibold tracking-tight">
          brunocordeiro.dev
        </TransitionLink>

        <nav className="hidden items-center gap-x-6 text-sm text-muted md:flex">
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

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <MobileNav items={anchors} label={t("menu")} />
        </div>
      </div>
    </header>
  );
}
