import { getTranslations } from "next-intl/server";
import type { Experience } from "@/domain";
import type { Locale } from "@/content";
import { Badge } from "@/components/ui/badge";
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
}: {
  experiences: Experience[];
  locale: Locale;
  nowYm: string;
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  // Reuses the nav's own "trajectory" label instead of a new message key:
  // same mono-eyebrow recipe as AiStats/RepoGrid/Certifications, so the
  // #trajetoria anchor (linked from the header nav) lands on a titled
  // section instead of jumping straight to the first company heading.
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
        {tNav("trajectory")}
      </h2>
      <ol className="flex flex-col gap-14">
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
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-medium">{experience.company}</h3>
                <Badge variant="outline">{experience.employmentType}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted">{experience.role}</p>
              <p className="mt-1.5 text-xs text-muted">
                {formatPeriod(experience.start, experience.end, locale, t("current"))}
                {` · ${formatDuration(experience.start, experience.end, locale, nowYm)}`}
                {experience.location ? ` · ${experience.location}` : ""}
              </p>
              {parallelCompanies.length > 0 && (
                <p className="mt-1 font-mono text-xs text-muted">
                  {t("inParallelWith", { companies: parallelCompanies.join(", ") })}
                </p>
              )}
              {experience.stacks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.stacks.map((stack) => (
                    <Badge key={stack} variant="tech" className="h-auto max-w-full whitespace-normal">
                      {stack}
                    </Badge>
                  ))}
                </div>
              )}
              {experience.projects.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5 border-t border-border/60 pt-3">
                  {experience.projects.map((project) => (
                    <li key={project.name} className="text-sm">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-muted"> — {project.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
