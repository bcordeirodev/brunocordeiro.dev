import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getContent, type Locale } from "@/content";
import { getGithubShowcase, getLinkchartsStats } from "@/services/github";
import { getGrafanaStats } from "@/services/grafana";
import { formatYearMonth } from "@/lib/dates";
import { buildPageMetadata } from "@/lib/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaseChapter } from "@/components/sections/case-chapter";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TransitionLink } from "@/components/motion/transition-link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { caseStudy } = getContent(locale);
  return buildPageMetadata({
    locale,
    path: "/link-charts",
    title: caseStudy.title,
    description: caseStudy.tagline,
  });
}

export default async function LinkChartsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { caseStudy } = getContent(locale);
  const [showcase, grafanaStats, linkchartsStats] = await Promise.all([
    getGithubShowcase(),
    getGrafanaStats(),
    getLinkchartsStats(),
  ]);

  const t = await getTranslations({ locale, namespace: "caseStudyPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6">
        <section className="pt-24 pb-14">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{caseStudy.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{caseStudy.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={caseStudy.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants()}
              >
                {t("visitProduct")}
              </a>
              {showcase.latestRelease ? (
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Badge>{showcase.latestRelease.tag}</Badge>
                  {t("latestRelease")} ·{" "}
                  {tCommon("updatedOn", {
                    date: formatYearMonth(showcase.latestRelease.publishedAt.slice(0, 7), locale),
                  })}
                </span>
              ) : null}
            </div>
          </Reveal>
        </section>

        {caseStudy.chapters.map((chapter) => (
          <Reveal key={chapter.id}>
            <CaseChapter
              chapter={chapter}
              grafanaStats={grafanaStats}
              linkchartsStats={linkchartsStats}
              locale={locale}
            />
          </Reveal>
        ))}

        <section className="flex flex-col items-start gap-4 pt-10 pb-24">
          <Reveal>
            <TransitionLink
              href="/#contact"
              className="font-mono text-sm text-accent underline-offset-4 hover:underline"
            >
              ← {t("backToContact")}
            </TransitionLink>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
