import { getTranslations } from "next-intl/server";
import type { Experience } from "@/domain";
import type { Locale } from "@/content";
import { Badge } from "@/components/ui/badge";
import { formatPeriod } from "@/lib/dates";

export async function Timeline({
  experiences,
  locale,
}: {
  experiences: Experience[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <ol className="flex flex-col gap-10">
      {experiences.map((experience) => (
        <li
          key={`${experience.company}-${experience.start}`}
          className="relative border-l border-border pl-6"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent"
          />
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="font-medium">{experience.company}</h3>
            <Badge variant="outline">{experience.employmentType}</Badge>
          </div>
          <p className="text-sm text-muted">{experience.role}</p>
          <p className="mt-1 text-xs text-muted">
            {formatPeriod(experience.start, experience.end, locale, t("current"))}
            {experience.location ? ` · ${experience.location}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {experience.stacks.map((stack) => (
              <Badge key={stack} variant="secondary">
                {stack}
              </Badge>
            ))}
          </div>
          {experience.projects.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1">
              {experience.projects.map((project) => (
                <li key={project.name} className="text-sm">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-muted"> — {project.description}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
