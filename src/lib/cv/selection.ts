import type { Certification, Education, Experience, SiteContent } from "@/domain";

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

// Nomes sozinhos são únicos hoje, mas o par com um segundo campo blinda
// contra homônimos futuros (duas passagens pela mesma empresa, a mesma
// certificação de emissores/anos diferentes etc.).
export function experienceKey(e: Pick<Experience, "company" | "start">): string {
  return `${e.company}:${e.start}`;
}

export function skillKey(categoryId: string, skillName: string): string {
  return `${categoryId}:${skillName}`;
}

export function certificationKey(c: Pick<Certification, "name" | "issued">): string {
  return `${c.name}:${c.issued}`;
}

export function educationKey(e: Pick<Education, "degree" | "institution">): string {
  return `${e.degree}:${e.institution}`;
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
    certifications: allTrue(content.certifications.map(certificationKey)),
    education: allTrue(content.education.map(educationKey)),
  };
}
