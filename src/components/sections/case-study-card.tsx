import { getTranslations } from "next-intl/server";
import type { GithubRelease } from "@/domain";
import { getContent, type Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { TransitionLink } from "@/components/motion/transition-link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Entrada compacta para o case: nome, tagline factual, release em produção e
 * o link. Sem sparkline, métricas ou muro de badges — o case continua a um
 * clique, mas a home não gira mais em torno dele (a trajetória e a stack
 * vêm antes).
 */
export async function CaseStudyCard({
  release,
  locale,
}: {
  release: GithubRelease | null;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudyCard" });
  const tPage = await getTranslations({ locale, namespace: "caseStudyPage" });
  const { caseStudy } = getContent(locale);

  return (
    <Card className="rounded-lg bg-surface-deep">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs text-muted">{t("eyebrow")}</p>
          {/* nome do produto, não slogan — a tagline factual explica */}
          <h2 className="text-xl font-bold tracking-tight">Link Charts</h2>
          <p className="max-w-2xl text-sm text-muted">{caseStudy.tagline}</p>
          {release ? (
            <p className="font-mono text-xs text-muted">
              {tPage("latestRelease")} · {release.tag}
            </p>
          ) : null}
        </div>
        <TransitionLink
          href="/link-charts"
          className={buttonVariants({ variant: "outline", className: "shrink-0 self-start" })}
        >
          {t("cta")} <span aria-hidden="true">→</span>
        </TransitionLink>
      </CardContent>
    </Card>
  );
}
