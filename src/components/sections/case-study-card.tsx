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
    (chapter) => chapter.id === "stack" && chapter.kind === "tags",
  );
  const stackGroups = stackChapter?.kind === "tags" ? stackChapter.groups : [];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="font-mono text-xs text-muted">{t("eyebrow")}</p>
        <h2 className="text-xl font-semibold">{caseStudy.title}</h2>
        <p className="text-muted">{caseStudy.tagline}</p>
        <p className="font-mono text-sm text-muted">{facts.join(" · ")}</p>
        {stackGroups.length > 0 ? (
          <dl className="flex flex-col gap-2.5">
            {stackGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                <dt className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase">
                  {group.label}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-border/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground/90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
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
