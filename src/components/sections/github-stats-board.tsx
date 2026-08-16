import type { CaseChapter, GithubRepoStats, LinkchartsStats } from "@/domain";
import type { Locale } from "@/content";

type GithubChapter = Extract<CaseChapter, { kind: "github" }>;

// Mesmo rótulo mono da ficha técnica (case-chapter), para os pares
// rótulo/valor e o título da barra de linguagens.
const EYEBROW = "font-mono text-xs tracking-[0.15em] text-muted uppercase";

// Cores do linguist do GitHub para as linguagens presentes nos dois repos;
// qualquer outra cai no cinza neutro.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#663399",
  PHP: "#4F5D95",
  Blade: "#f7523f",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};
const LANGUAGE_FALLBACK = "#8b949e";

const languageColor = (name: string) => LANGUAGE_COLORS[name] ?? LANGUAGE_FALLBACK;

const intlLocale = (locale: Locale) => (locale === "pt" ? "pt-BR" : "en-US");

const fmtInt = (locale: Locale, value: number) =>
  new Intl.NumberFormat(intlLocale(locale)).format(value);

// Data numérica compacta ("14/08/2026") para o valor caber numa linha só,
// no mesmo corpo dos outros números da ficha.
const fmtDate = (locale: Locale, iso: string) =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      data-icon="github"
      className={className}
      fill="currentColor"
    >
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

const pctLabel = (pct: number) => (pct < 1 ? "<1%" : `${Math.round(pct)}%`);

function LanguageBar({ repo, label }: { repo: GithubRepoStats; label: string }) {
  const total = repo.languages.reduce((sum, language) => sum + language.bytes, 0);
  return (
    <div className="flex flex-col gap-2.5 border-t border-border/40 pt-3">
      <span className={EYEBROW}>{label}</span>
      <div
        role="img"
        aria-label={`${label} — ${repo.name}`}
        className="flex h-1.5 gap-px overflow-hidden rounded-full"
      >
        {repo.languages.map((language) => (
          <span
            key={language.name}
            style={{
              width: `${(language.bytes / total) * 100}%`,
              backgroundColor: languageColor(language.name),
            }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {repo.languages.map((language) => (
          <li key={language.name} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: languageColor(language.name) }}
            />
            {`${language.name} ${pctLabel((language.bytes / total) * 100)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RepoColumn({
  repo,
  sub,
  source,
  chapter,
  locale,
}: {
  repo: GithubRepoStats;
  sub: string;
  source: LinkchartsStats["source"];
  chapter: GithubChapter;
  locale: Locale;
}) {
  const { labels } = chapter;
  const pairs = [
    { label: labels.commits, value: fmtInt(locale, repo.commits) },
    { label: labels.tags, value: fmtInt(locale, repo.tags) },
    { label: labels.latestTag, value: repo.latestTag ?? "—" },
    { label: labels.lastPush, value: fmtDate(locale, repo.pushedAt) },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${repo.name} — ${labels.viewRepo}`}
            className="flex items-center gap-2 font-mono text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            <GithubMark className="size-4 shrink-0 text-foreground" />
            {repo.name} ↗
          </a>
          <span className="text-xs text-muted">{sub}</span>
        </div>
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[10px] leading-none whitespace-nowrap ${
            source === "live" ? "border-accent/60 text-accent" : "border-border/60 text-muted"
          }`}
        >
          {source === "live" ? labels.liveLabel : labels.snapshotLabel}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        {pairs.map((pair) => (
          <div key={pair.label} className="flex flex-col gap-1 border-t border-border/40 pt-3">
            <dt className={EYEBROW}>{pair.label}</dt>
            <dd className="font-mono text-xl leading-none tracking-tight text-foreground/90">
              {pair.value}
            </dd>
          </div>
        ))}
      </dl>
      <LanguageBar repo={repo} label={labels.languages} />
    </div>
  );
}

export function GithubStatsBoard({
  chapter,
  stats,
  locale,
}: {
  chapter: GithubChapter;
  stats: LinkchartsStats;
  locale: Locale;
}) {
  return (
    <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
      <RepoColumn
        repo={stats.frontend}
        sub={chapter.repos.frontend.sub}
        source={stats.source}
        chapter={chapter}
        locale={locale}
      />
      <RepoColumn
        repo={stats.backend}
        sub={chapter.repos.backend.sub}
        source={stats.source}
        chapter={chapter}
        locale={locale}
      />
    </div>
  );
}
