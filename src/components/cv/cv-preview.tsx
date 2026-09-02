import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { certificationKey, educationKey } from "@/lib/cv/selection";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

// Espelha os chips do PDF — a lista de tecnologias fica escaneável em vez de
// virar uma linha corrida de texto.
function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-sm border border-border/60 bg-surface px-1.5 py-0.5 text-[10px] text-muted"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="border-b border-border/50 pb-1 font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
        {title}
      </h3>
      {children}
    </section>
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
    <article className="flex flex-col gap-6 rounded-lg border border-border/50 bg-background p-6 text-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
        {/* Espelha o PDF: `role` e `headline` são a mesma string hoje; o header usa `headline` de propósito. */}
        <p className="text-muted">{profile.headline}</p>
        <p className="text-xs text-muted">
          <span>{profile.email}</span> · {profile.location} · {profile.languages}
        </p>
        <p className="text-xs text-muted">
          {profile.github} · {profile.linkedin}
        </p>
      </header>

      {data.summary ? <p className="text-muted">{data.summary}</p> : null}

      {data.metrics ? (
        <p className="text-xs text-muted">
          {data.metrics.map((metric, index) => (
            <span key={metric.id}>
              {index > 0 ? " · " : ""}
              <span className="font-medium text-foreground">
                {`${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""}`}
              </span>{" "}
              {metric.label}
            </span>
          ))}
        </p>
      ) : null}

      {data.experiences ? (
        <Section title={labels.sections.experiences}>
          {/* Régua entre as experiências: com os chips ocupando a largura
              toda, um bloco emendava no outro e a trajetória virava um muro. */}
          {data.experiences.map((exp) => (
            <div
              key={`${exp.company}:${exp.start}`}
              className="flex flex-col gap-2 border-t border-border/40 py-4 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="font-medium">
                  {exp.role} — {exp.company}
                </p>
                <p className="font-mono text-xs text-muted">
                  {formatPeriod(exp.start, exp.end, locale, labels.current)}
                </p>
              </div>
              <Chips items={exp.stacks} />
              {/* Aqui a descrição de cada sistema entra; no PDF, não — a tela
                  tem espaço de sobra e o documento precisa caber em 2 páginas. */}
              {exp.projects.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {exp.projects.map((p) => (
                    <p key={p.name} className="text-xs text-muted">
                      <span className="font-medium text-foreground">{p.name}</span> —{" "}
                      {p.description}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </Section>
      ) : null}

      {data.skillCategories ? (
        <Section title={labels.sections.skills}>
          {/* Só os nomes, como no PDF: a prova de cada skill vive no site. */}
          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-1">
              <p className="text-xs font-medium">{cat.title}</p>
              <Chips items={cat.skills.map((s) => s.name)} />
            </div>
          ))}
        </Section>
      ) : null}

      {data.certifications ? (
        <Section title={labels.sections.certifications}>
          {data.certifications.map((c) => (
            <div key={certificationKey(c)} className="flex flex-col gap-1">
              <p className="text-xs">
                <span className="font-medium">{c.name}</span>{" "}
                <span className="text-muted">
                  — {c.issuer} · {formatYearMonth(c.issued, locale)}
                  {c.expires ? ` (${labels.validUntil} ${formatYearMonth(c.expires, locale)})` : ""}
                </span>
              </p>
              {c.credentialUrl ? (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted underline-offset-4 hover:underline"
                >
                  {c.credentialUrl}
                </a>
              ) : null}
            </div>
          ))}
        </Section>
      ) : null}

      {data.education ? (
        <Section title={labels.sections.education}>
          {data.education.map((e) => (
            <p key={educationKey(e)} className="text-xs">
              <span className="font-medium">{e.degree}</span>{" "}
              <span className="text-muted">
                — {e.institution} · {e.period}
              </span>
            </p>
          ))}
        </Section>
      ) : null}

      {data.caseStudy ? (
        <Section title={labels.sections.caseStudy}>
          <p className="text-xs">
            <span className="font-medium">{data.caseStudy.title}</span>{" "}
            <span className="text-muted">— {data.caseStudy.tagline}</span>
          </p>
          <p className="text-xs text-muted">
            {labels.caseStudyCta}: {data.caseStudy.url}
          </p>
        </Section>
      ) : null}
    </article>
  );
}
