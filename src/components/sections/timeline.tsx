import { getTranslations } from "next-intl/server";
import type { Experience } from "@/domain";
import type { Locale } from "@/content";
import { Badge } from "@/components/ui/badge";
import { matchesFocus } from "@/lib/cv/focus";
import { formatDuration, formatPeriod } from "@/lib/dates";

function periodsOverlap(a: Experience, b: Experience): boolean {
  const aEnd = a.end ?? "9999-12";
  const bEnd = b.end ?? "9999-12";
  return a.start < bEnd && b.start < aEnd;
}

function overlappingCompanies(experience: Experience, experiences: Experience[]): string[] {
  if (experience.employmentType === "full-time") return [];
  return experiences
    .filter((other) => other !== experience && periodsOverlap(experience, other))
    .map((other) => other.company);
}

export async function Timeline({
  experiences,
  locale,
  nowYm,
  highlights = [],
}: {
  experiences: Experience[];
  locale: Locale;
  nowYm: string;
  /* Tecnologias da linha de destaque do perfil (`stackHighlights`, já
     separadas): na stack de cada experiência elas saem em evidência, para o
     leitor achar "Laravel" e "Angular" sem varrer a lista. */
  highlights?: string[];
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tCv = await getTranslations({ locale, namespace: "cv" });
  // Reuses the nav's own "trajectory" label instead of a new message key:
  // same mono-eyebrow recipe as AiStats/RepoGrid/Certifications, so the
  // #experience anchor (linked from the header nav) lands on a titled
  // section instead of jumping straight to the first company heading.
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
        {tNav("trajectory")}
      </h2>
      <ol className="flex flex-col gap-12">
        {experiences.map((experience) => {
          const parallelCompanies = overlappingCompanies(experience, experiences);

          return (
            <li
              key={`${experience.company}-${experience.start}`}
              className="relative border-l border-border pl-8"
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent"
              />
              {/* Mesma anatomia do CV: quem/onde à esquerda, quando à direita. */}
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-medium">{experience.company}</h3>
                    <Badge variant="outline">{experience.employmentType}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {experience.role}
                    {experience.location ? ` · ${experience.location}` : ""}
                  </p>
                </div>
                <div className="font-mono text-xs text-muted sm:text-right">
                  <p>{formatPeriod(experience.start, experience.end, locale, t("current"))}</p>
                  <p>{formatDuration(experience.start, experience.end, locale, nowYm)}</p>
                </div>
              </div>
              {parallelCompanies.length > 0 && (
                <p className="mt-1 font-mono text-xs text-muted">
                  {t("inParallelWith", { companies: parallelCompanies.join(", ") })}
                </p>
              )}
              {/* O que foi construído vem antes de com o quê. */}
              {experience.projects.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {experience.projects.map((project) => (
                    <li key={project.name} className="flex gap-2 text-sm">
                      <span aria-hidden="true" className="text-accent">
                        •
                      </span>
                      <span>
                        <span className="font-medium">{project.name}</span>
                        <span className="text-muted"> — {project.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Stack numa linha corrida, como no PDF: o muro de badges
                  fazia cada experiência parecer um inventário; aqui a lista
                  existe para a busca por palavra-chave, com as tecnologias
                  em destaque marcadas. */}
              {experience.stacks.length > 0 && (
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  <span className="font-medium text-foreground">{tCv("stack")}: </span>
                  {experience.stacks.map((stack, index) => (
                    <span key={stack}>
                      {index > 0 ? " · " : ""}
                      <span
                        className={
                          matchesFocus(stack, highlights) ? "font-medium text-foreground" : ""
                        }
                      >
                        {stack}
                      </span>
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
