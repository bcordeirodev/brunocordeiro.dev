import { getTranslations } from "next-intl/server";
import type { GithubRelease } from "@/domain";
import { getContent, type Locale } from "@/content";
import { linkchartsActivity } from "@/content/linkcharts-activity";
import { formatYearMonth } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActivitySparkline } from "@/components/sections/activity-sparkline";
import { TransitionLink } from "@/components/motion/transition-link";

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
  const stackGroups = stackChapter?.kind === "tags" ? stackChapter.groups : [];

  const activityCategories = linkchartsActivity.months.map((month) =>
    formatYearMonth(month, locale),
  );

  return (
    // fundo mais profundo que o bg-card padrão para os chips terem contraste
    // dentro da caixa
    <Card className="rounded-lg bg-surface-deep">
      <CardContent className="flex flex-col gap-3">
        <p className="font-mono text-xs text-muted">{t("eyebrow")}</p>
        {/* nome do produto, não slogan — a tagline factual logo abaixo explica */}
        <h2 className="text-2xl font-bold tracking-tight">Link Charts</h2>
        <p className="text-muted">{caseStudy.tagline}</p>
        <p className="font-mono text-sm text-muted">{facts.join(" · ")}</p>
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[11px] text-muted">{t("activity")}</p>
          <ActivitySparkline
            categories={activityCategories}
            values={linkchartsActivity.values}
            label={t("activity")}
          />
        </div>
        {stackGroups.length > 0 ? (
          <dl className="flex flex-col gap-2.5">
            {stackGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                <dt className="font-mono text-[11px] font-bold tracking-[0.15em] text-muted uppercase">
                  {group.label}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item}>
                        {/* mesmo chip "tech" (borda + mono) usado na
                            trajetória e em /link-charts: outline em vez de
                            preenchimento, então funciona sobre qualquer
                            fundo escuro sem precisar de override local */}
                        <Badge variant="tech">{item}</Badge>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <TransitionLink
          href="/link-charts"
          className="self-start text-sm text-accent underline-offset-4 hover:underline"
        >
          {t("cta")} <span aria-hidden="true">→</span>
        </TransitionLink>
      </CardContent>
    </Card>
  );
}
