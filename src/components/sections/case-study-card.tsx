import { getTranslations } from "next-intl/server";
import type { GithubRelease } from "@/domain";
import { getContent, type Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export async function CaseStudyCard({
  release,
  locale,
}: {
  release: GithubRelease | null;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudyCard" });
  const { caseStudy, profile } = getContent(locale);
  const metrics = profile.metrics.filter((metric) => metric.id !== "years").slice(0, 3);
  const metricFacts = metrics.map(
    (metric) => `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} ${metric.label}`,
  );
  const facts = release ? [...metricFacts, release.tag] : metricFacts;
  const stackChapter = caseStudy.chapters.find(
    (chapter) => chapter.id === "stack" && chapter.kind === "stats",
  );
  const stacks =
    stackChapter?.kind === "stats"
      ? stackChapter.items.flatMap((item) => item.value.split(", "))
      : [];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="font-mono text-xs text-muted">{t("eyebrow")}</p>
        <h2 className="text-xl font-semibold">{caseStudy.title}</h2>
        <p className="text-muted">{caseStudy.tagline}</p>
        <p className="font-mono text-sm text-muted">{facts.join(" · ")}</p>
        {stacks.length > 0 ? (
          <p className="font-mono text-xs leading-relaxed text-muted/80">{stacks.join(" · ")}</p>
        ) : null}
        <Link
          href="/link-charts"
          className="self-start text-sm text-accent underline-offset-4 hover:underline"
        >
          {t("cta")} <span aria-hidden="true">→</span>
        </Link>
      </CardContent>
    </Card>
  );
}
