import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="border-b border-border/50 pb-1 font-mono text-xs tracking-[0.2em] text-muted uppercase">
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
        <p className="text-muted">{profile.role}</p>
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
          {data.metrics
            .map((m) => `${m.prefix ?? ""}${m.value}${m.suffix ?? ""} ${m.label}`)
            .join(" · ")}
        </p>
      ) : null}

      {data.experiences ? (
        <Section title={labels.sections.experiences}>
          {data.experiences.map((exp) => (
            <div key={`${exp.company}:${exp.start}`} className="flex flex-col gap-1">
              <p className="font-medium">
                {exp.role} — {exp.company}{" "}
                <span className="font-normal text-muted">
                  · {formatPeriod(exp.start, exp.end, locale, labels.current)}
                </span>
              </p>
              <p className="text-xs text-muted">{exp.stacks.join(" · ")}</p>
              {exp.projects.map((p) => (
                <p key={p.name} className="text-xs text-muted">
                  {p.name} — {p.description}
                </p>
              ))}
            </div>
          ))}
        </Section>
      ) : null}

      {data.skillCategories ? (
        <Section title={labels.sections.skills}>
          {data.skillCategories.map((cat) => (
            <div key={cat.id}>
              <p className="font-medium">{cat.title}</p>
              {cat.skills.map((s) => (
                <p key={s.name} className="text-xs text-muted">
                  {s.name} — {s.proof}
                </p>
              ))}
            </div>
          ))}
        </Section>
      ) : null}

      {data.certifications ? (
        <Section title={labels.sections.certifications}>
          {data.certifications.map((c) => (
            <p key={c.name} className="text-xs">
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-muted">
                — {c.issuer} · {formatYearMonth(c.issued, locale)}
                {c.expires ? ` (${labels.validUntil} ${formatYearMonth(c.expires, locale)})` : ""}
              </span>
            </p>
          ))}
        </Section>
      ) : null}

      {data.education ? (
        <Section title={labels.sections.education}>
          {data.education.map((e) => (
            <p key={e.degree} className="text-xs">
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
