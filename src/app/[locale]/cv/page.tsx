import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getContent, type Locale } from "@/content";
import { buildPageMetadata } from "@/lib/site";
import type { CvLabels } from "@/lib/cv/labels";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CvBuilder } from "@/components/cv/cv-builder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cv" });
  return buildPageMetadata({
    locale,
    path: "/cv",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function CvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const t = await getTranslations({ locale, namespace: "cv" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const labels: CvLabels = {
    sections: {
      summary: t("sections.summary"),
      metrics: t("sections.metrics"),
      experiences: t("sections.experiences"),
      skills: t("sections.skills"),
      certifications: t("sections.certifications"),
      education: t("sections.education"),
      caseStudy: t("sections.caseStudy"),
    },
    panelTitle: t("panelTitle"),
    customize: t("customize"),
    close: tCommon("close"),
    selectAll: t("selectAll"),
    clearAll: t("clearAll"),
    download: t("download"),
    generating: t("generating"),
    downloadError: t("downloadError"),
    current: tCommon("current"),
    validUntil: tCommon("validUntil"),
    caseStudyCta: t("caseStudyCta"),
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{t("pageTitle")}</h1>
        <CvBuilder content={content} locale={locale} labels={labels} />
      </main>
      <SiteFooter />
    </>
  );
}
