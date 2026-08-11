import { Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { GithubShowcase } from "@/domain";
import type { Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { formatYearMonth } from "@/lib/dates";

export async function RepoGrid({ showcase }: { showcase: GithubShowcase }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "common" });
  const tSections = await getTranslations({ locale, namespace: "sections" });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
        {tSections("githubProjects")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {showcase.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Card className="h-full transition-colors hover:ring-accent/40">
              <CardContent className="flex flex-col gap-2">
                <h3 className="font-mono text-sm font-medium">{repo.name}</h3>
                {repo.description ? <p className="text-sm text-muted">{repo.description}</p> : null}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                  {repo.language ? <span>{repo.language}</span> : null}
                  <span
                    className="inline-flex items-center gap-1"
                    aria-label={t("stars", { count: repo.stars })}
                  >
                    <Star className="size-3.5" aria-hidden="true" />
                    <span aria-hidden="true">{repo.stars}</span>
                  </span>
                  <span>
                    {t("updatedOn", { date: formatYearMonth(repo.pushedAt.slice(0, 7), locale) })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
