import { getTranslations, setRequestLocale } from "next-intl/server";
import { getContent, type Locale } from "@/content";
import { aiStats } from "@/content/ai-stats";
import type { EvidenceLevel } from "@/domain";
import { getGithubShowcase } from "@/services/github";
import { formatYearMonth } from "@/lib/dates";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { SkillMatrix } from "@/components/sections/skill-matrix";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { Timeline } from "@/components/sections/timeline";
import { Certifications } from "@/components/sections/certifications";
import { AiStats } from "@/components/sections/ai-stats";
import { RepoGrid } from "@/components/sections/repo-grid";
import { Contact } from "@/components/sections/contact";
import { Reveal } from "@/components/motion/reveal";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const showcase = await getGithubShowcase();

  const tEvidence = await getTranslations({ locale, namespace: "evidence" });
  const evidenceLabels: Record<EvidenceLevel, string> = {
    production: tEvidence("production"),
    professional: tEvidence("professional"),
    project: tEvidence("project"),
    certified: tEvidence("certified"),
    academic: tEvidence("academic"),
    declared: tEvidence("declared"),
  };

  const tAiStats = await getTranslations({ locale, namespace: "aiStats" });
  const aiStatsLabels = {
    title: tAiStats("title"),
    sessions: tAiStats("sessions"),
    activeDays: tAiStats("activeDays"),
    streak: tAiStats("streak"),
    outputTokens: tAiStats("outputTokens"),
    edits: tAiStats("edits"),
    testRuns: tAiStats("testRuns"),
    searches: tAiStats("searches"),
    commands: tAiStats("commands"),
    disclaimer: tAiStats("disclaimer", { since: formatYearMonth(aiStats.since, locale) }),
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6">
        <Hero profile={content.profile} />
        <Reveal>
          <section id="stack" className="scroll-mt-24">
            <SkillMatrix categories={content.skillCategories} labels={evidenceLabels} />
          </section>
        </Reveal>
        <Reveal>
          <CaseStudyCard release={showcase.latestRelease} locale={locale} />
        </Reveal>
        <Reveal>
          <section id="trajetoria" className="scroll-mt-24">
            <Timeline experiences={content.experiences} locale={locale} />
          </section>
        </Reveal>
        <Reveal>
          <Certifications items={content.certifications} locale={locale} />
        </Reveal>
        <Reveal>
          <section id="ia" className="scroll-mt-24">
            <AiStats stats={aiStats} labels={aiStatsLabels} />
          </section>
        </Reveal>
        <Reveal>
          <RepoGrid showcase={showcase} />
        </Reveal>
        <Reveal>
          <section id="contato" className="scroll-mt-24">
            <Contact profile={content.profile} />
          </section>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
