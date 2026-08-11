import { z } from "zod";
import { profileSchema } from "./profile";
import { experienceSchema } from "./experience";
import { skillCategorySchema } from "./skill";
import { certificationSchema } from "./certification";
import { caseStudySchema } from "./case-study";

export const siteContentSchema = z.object({
  profile: profileSchema,
  skillCategories: z.array(skillCategorySchema).min(6),
  experiences: z.array(experienceSchema).min(5),
  certifications: z.array(certificationSchema).min(2),
  caseStudy: caseStudySchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export * from "./profile";
export * from "./experience";
export * from "./skill";
export * from "./certification";
export * from "./case-study";
export * from "./github";
