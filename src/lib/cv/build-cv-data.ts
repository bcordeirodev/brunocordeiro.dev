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
import { parseFocus } from "./focus";
import {
  certificationKey,
  educationKey,
  experienceKey,
  skillKey,
  type CaseStudyPlacement,
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
  caseStudy: { title: string; tagline: string; url: string; placement: CaseStudyPlacement } | null;
  // Tecnologias a destacar (já normalizadas); vazio = CV sem foco.
  focus: string[];
  // URL desta página no site, impressa no rodapé do PDF: quem recebe o
  // arquivo por e-mail consegue voltar à versão completa e atualizada.
  sourceUrl: string;
};

const orNull = <T>(arr: T[]): T[] | null => (arr.length > 0 ? arr : null);

export function buildCvData(content: SiteContent, selection: CvSelection, locale: Locale): CvData {
  const { sections } = selection;
  return {
    profile: content.profile,
    summary: sections.summary ? selection.summaryOverride.trim() || content.profile.pitch : null,
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
          placement: selection.caseStudyPlacement,
        }
      : null,
    focus: parseFocus(selection.focus),
    sourceUrl: absoluteUrl(localizedPath(locale, "/cv")),
  };
}
