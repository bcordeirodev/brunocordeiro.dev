import type { Locale } from "@/content";
import type { Experience } from "@/domain";
import type { CvData } from "@/lib/cv/build-cv-data";
import { displayUrl } from "@/lib/cv/display-url";
import { matchesFocus, sortByFocus } from "@/lib/cv/focus";
import type { CvLabels } from "@/lib/cv/labels";
import { certificationKey, educationKey } from "@/lib/cv/selection";
import { formatDuration, formatPeriod, formatYearMonth } from "@/lib/dates";

// O preview espelha o PDF (mesma ordem, mesma hierarquia) para que o que o
// recrutador vê na tela seja o que sai no arquivo.

function Chips({ items, focus = [] }: { items: string[]; focus?: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {sortByFocus(items, (item) => item, focus).map((item) => (
        <span
          key={item}
          className={
            matchesFocus(item, focus)
              ? "rounded-sm border border-accent/70 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
              : "rounded-sm border border-border/60 bg-surface px-1.5 py-0.5 text-[10px] text-muted"
          }
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="border-b border-border/50 pb-1.5 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function ExperienceEntry({
  exp,
  locale,
  labels,
  nowYm,
  focus,
}: {
  exp: Experience;
  locale: Locale;
  labels: CvLabels;
  nowYm: string;
  focus: string[];
}) {
  const meta = [exp.location].filter(Boolean);
  return (
    <div className="flex flex-col gap-2 border-t border-border/40 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          <p className="font-semibold">
            {exp.role}
            <span className="font-medium text-muted">{` · ${exp.company}`}</span>
          </p>
          <p className="text-xs text-muted">{meta.join(" · ")}</p>
        </div>
        <div className="text-right font-mono text-xs text-muted">
          <p>{formatPeriod(exp.start, exp.end, locale, labels.current)}</p>
          {/* Sem opacidade extra: a 70% o cinza cai abaixo de 4.5:1 e o axe reprova. */}
          <p className="text-[11px]">{formatDuration(exp.start, exp.end, locale, nowYm)}</p>
        </div>
      </div>
      {exp.projects.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {exp.projects.map((p) => (
            <li key={p.name} className="flex gap-2 text-xs text-muted">
              <span aria-hidden="true" className="text-accent">
                •
              </span>
              <span>
                <span className="font-medium text-foreground">{p.name}</span> — {p.description}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {exp.stacks.length > 0 ? (
        <p className="text-xs text-muted">
          <span className="font-medium text-foreground">{labels.stack}: </span>
          {exp.stacks.map((stack, index) => (
            <span key={stack}>
              {index > 0 ? " · " : ""}
              <span className={matchesFocus(stack, focus) ? "font-semibold text-foreground" : ""}>
                {stack}
              </span>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

export function CvPreview({
  data,
  locale,
  labels,
}: {
  data: CvData;
  locale: Locale;
  labels: CvLabels;
}) {
  const { profile } = data;
  return (
    <article className="flex flex-col gap-7 rounded-lg border border-border/50 bg-background p-6 text-sm">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
            {/* Espelha o PDF: `role` e `headline` são a mesma string hoje; o header usa `headline` de propósito. */}
            <p className="font-medium text-muted">{profile.headline}</p>
            <p className="text-xs text-muted">{profile.availability}</p>
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-muted sm:text-right">
            <p>{profile.email}</p>
            <p>{profile.location}</p>
            <p>{displayUrl(profile.github)}</p>
            <p>{displayUrl(profile.linkedin)}</p>
            <p>{profile.languages}</p>
          </div>
        </div>
        <div aria-hidden="true" className="flex items-center">
          <span className="h-0.5 w-10 bg-accent" />
          <span className="h-px flex-1 bg-border/60" />
        </div>
      </header>

      {data.summary ? <p className="text-muted">{data.summary}</p> : null}

      {data.focus.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-medium">{labels.coreStack}:</span>
          <Chips items={data.focus} focus={data.focus} />
        </div>
      ) : null}

      {data.experiences ? (
        <Section title={labels.sections.experiences}>
          <div className="flex flex-col">
            {data.experiences.map((exp) => (
              <ExperienceEntry
                key={`${exp.company}:${exp.start}`}
                exp={exp}
                locale={locale}
                labels={labels}
                nowYm={profile.asOfYm}
                focus={data.focus}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {data.skillCategories ? (
        <Section title={labels.sections.skills}>
          {/* Só os nomes, como no PDF: a prova de cada skill vive no site. */}
          <div className="flex flex-col gap-3">
            {data.skillCategories.map((cat) => (
              <div key={cat.id} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <p className="text-xs font-semibold">{cat.title}</p>
                <Chips items={cat.skills.map((s) => s.name)} focus={data.focus} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.certifications || data.education ? (
        <div className="grid gap-7 sm:grid-cols-5">
          {data.certifications ? (
            <div className={data.education ? "sm:col-span-3" : "sm:col-span-5"}>
              <Section title={labels.sections.certifications}>
                {data.certifications.map((c) => (
                  <div key={certificationKey(c)} className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold">{c.name}</p>
                    <p className="text-xs text-muted">
                      {c.issuer} · {formatYearMonth(c.issued, locale)}
                      {c.expires
                        ? ` · ${labels.validUntil} ${formatYearMonth(c.expires, locale)}`
                        : ""}
                    </p>
                    {c.credentialUrl ? (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent underline-offset-4 hover:underline"
                      >
                        {displayUrl(c.credentialUrl)}
                      </a>
                    ) : null}
                  </div>
                ))}
              </Section>
            </div>
          ) : null}
          {data.education ? (
            <div className={data.certifications ? "sm:col-span-2" : "sm:col-span-5"}>
              <Section title={labels.sections.education}>
                {data.education.map((e) => (
                  <div key={educationKey(e)} className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold">{e.degree}</p>
                    <p className="text-xs text-muted">
                      {e.institution} · {e.period}
                    </p>
                  </div>
                ))}
              </Section>
            </div>
          ) : null}
        </div>
      ) : null}

      {data.caseStudy ? (
        <Section title={labels.sections.caseStudy}>
          <p className="text-xs text-muted">
            <span className="font-medium text-foreground">{data.caseStudy.title}</span> —{" "}
            {data.caseStudy.tagline} ·{" "}
            <a
              href={data.caseStudy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              {displayUrl(data.caseStudy.url)}
            </a>
          </p>
        </Section>
      ) : null}

      <footer className="flex justify-between border-t border-border/40 pt-3 text-[11px] text-muted">
        <span>{displayUrl(data.sourceUrl)}</span>
      </footer>
    </article>
  );
}
