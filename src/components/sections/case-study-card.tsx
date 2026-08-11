import { getTranslations } from "next-intl/server";
import type { GithubRelease } from "@/domain";
import { getContent, type Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TransitionLink } from "@/components/motion/transition-link";
import { cn } from "@/lib/utils";

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

  return (
    <Card className="ring-2 ring-accent">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">{caseStudy.title}</h2>
          {release ? <Badge>{release.tag}</Badge> : null}
        </div>
        <p className="text-muted">{caseStudy.tagline}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {metrics.map((metric) => (
            <span key={metric.id}>
              <strong className="text-accent">
                {metric.prefix}
                {metric.value}
                {metric.suffix}
              </strong>{" "}
              <span className="text-muted">{metric.label}</span>
            </span>
          ))}
        </div>
        <TransitionLink href="/link-charts" className={cn(buttonVariants(), "self-start")}>
          {t("cta")}
        </TransitionLink>
      </CardContent>
    </Card>
  );
}
