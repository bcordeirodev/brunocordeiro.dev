import { getTranslations } from "next-intl/server";
import type { GithubRelease } from "@/domain";
import { getContent, type Locale } from "@/content";
import { linkchartsActivity } from "@/content/linkcharts-activity";
import { formatYearMonth } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActivitySparkline } from "@/components/sections/activity-sparkline";
import { TransitionLink } from "@/components/motion/transition-link";

const TOTAL_COMMITS = linkchartsActivity.values.reduce((sum, value) => sum + value, 0);

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
    (chapter) => chapter.id === "stack" && chapter.kind === "tags",
  );
  // o card é entrada de índice, não inventário: 2 techs por área (o conjunto
  // completo, agrupado, vive na página do case)
  const headlineStacks =
    stackChapter?.kind === "tags"
      ? stackChapter.groups.flatMap((group) => group.items.slice(0, 2))
      : [];

  const activityCategories = linkchartsActivity.months.map((month) =>
    formatYearMonth(month, locale),
  );

  return (
    <Card className="rounded-lg bg-surface-deep">
      <CardContent className="flex flex-col gap-5">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-muted">{t("eyebrow")}</p>
            {/* nome do produto, não slogan — a tagline factual explica */}
            <h2 className="text-2xl font-bold tracking-tight">Link Charts</h2>
            <p className="text-muted">{caseStudy.tagline}</p>
            <p className="font-mono text-sm text-muted">{facts.join(" · ")}</p>
            <TransitionLink
              href="/link-charts"
              className="self-start text-sm text-accent underline-offset-4 hover:underline"
            >
              {t("cta")} <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
          {/* assinatura do card: o gráfico emoldurado como mini-painel, na
              linguagem dos painéis do case (header mono + moldura) */}
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-1.5">
              <span className="font-mono text-[11px] text-muted">{t("activity")}</span>
              <span className="font-mono text-[11px] text-accent">
                {TOTAL_COMMITS.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}{" "}
                {t("activityTotal")}
              </span>
            </div>
            <div className="px-2 pt-2">
              <ActivitySparkline
                categories={activityCategories}
                values={linkchartsActivity.values}
                label={t("activity")}
              />
            </div>
          </div>
        </div>
        {headlineStacks.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
            {headlineStacks.map((item) => (
              <li key={item}>
                <Badge variant="tech" className="h-auto max-w-full whitespace-normal">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
