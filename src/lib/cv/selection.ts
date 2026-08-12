import type { Experience, SiteContent } from "@/domain";

export type CvSectionId =
  | "summary"
  | "metrics"
  | "experiences"
  | "skills"
  | "certifications"
  | "education"
  | "caseStudy";

export type CvSelection = {
  sections: Record<CvSectionId, boolean>;
  experiences: Record<string, boolean>;
  skills: Record<string, boolean>;
  certifications: Record<string, boolean>;
  education: Record<string, boolean>;
};

// company sozinho é único hoje, mas o par com start blinda contra duas
// passagens pela mesma empresa sem quebrar seleções existentes.
export function experienceKey(e: Pick<Experience, "company" | "start">): string {
  return `${e.company}:${e.start}`;
}

export function skillKey(categoryId: string, skillName: string): string {
  return `${categoryId}:${skillName}`;
}

const allTrue = (keys: string[]): Record<string, boolean> =>
  Object.fromEntries(keys.map((k) => [k, true]));

export function defaultSelection(content: SiteContent): CvSelection {
  return {
    sections: {
      summary: true,
      metrics: true,
      experiences: true,
      skills: true,
      certifications: true,
      education: true,
      caseStudy: true,
    },
    experiences: allTrue(content.experiences.map(experienceKey)),
    skills: allTrue(
      content.skillCategories.flatMap((cat) => cat.skills.map((s) => skillKey(cat.id, s.name))),
    ),
    certifications: allTrue(content.certifications.map((c) => c.name)),
    education: allTrue(content.education.map((e) => e.degree)),
  };
}
