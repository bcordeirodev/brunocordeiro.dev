import type {
  Certification,
  Education,
  Experience,
  Metric,
  Profile,
  SiteContent,
  SkillCategory,
} from "@/domain";
import type { Locale } from "@/content";
import { absoluteUrl, localizedPath } from "@/lib/site";
import {
  certificationKey,
  educationKey,
  experienceKey,
  skillKey,
  type CvSelection,
} from "./selection";

export type CvData = {
  profile: Profile;
  summary: string | null;
  metrics: Metric[] | null;
  experiences: Experience[] | null;
  skillCategories: SkillCategory[] | null;
  certifications: Certification[] | null;
  education: Education[] | null;
  caseStudy: { title: string; tagline: string; url: string } | null;
};

const orNull = <T>(arr: T[]): T[] | null => (arr.length > 0 ? arr : null);

export function buildCvData(
  content: SiteContent,
  selection: CvSelection,
  locale: Locale,
): CvData {
  const { sections } = selection;
  return {
    profile: content.profile,
    summary: sections.summary ? content.profile.subheadline : null,
    metrics: sections.metrics ? content.profile.metrics : null,
    experiences: sections.experiences
      ? orNull(content.experiences.filter((e) => selection.experiences[experienceKey(e)]))
      : null,
    skillCategories: sections.skills
      ? orNull(
          content.skillCategories
            .map((cat) => ({
              ...cat,
              skills: cat.skills.filter((s) => selection.skills[skillKey(cat.id, s.name)]),
            }))
            .filter((cat) => cat.skills.length > 0),
        )
      : null,
    certifications: sections.certifications
      ? orNull(content.certifications.filter((c) => selection.certifications[certificationKey(c)]))
      : null,
    education: sections.education
      ? orNull(content.education.filter((e) => selection.education[educationKey(e)]))
      : null,
    caseStudy: sections.caseStudy
      ? {
          title: content.caseStudy.title,
          tagline: content.caseStudy.tagline,
          url: absoluteUrl(localizedPath(locale, "/link-charts")),
        }
      : null,
  };
}
