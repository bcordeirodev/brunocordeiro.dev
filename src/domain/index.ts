import { z } from "zod";
import { profileSchema } from "./profile";
import { experienceSchema } from "./experience";
import { skillCategorySchema } from "./skill";
import { certificationSchema } from "./certification";
import { educationSchema } from "./education";
import { caseStudySchema } from "./case-study";

export const siteContentSchema = z.object({
  profile: profileSchema,
  skillCategories: z.array(skillCategorySchema).min(5),
  experiences: z.array(experienceSchema).min(5),
  certifications: z.array(certificationSchema).min(3),
  education: z.array(educationSchema).min(1),
  caseStudy: caseStudySchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export * from "./profile";
export * from "./experience";
export * from "./skill";
export * from "./certification";
export * from "./education";
export * from "./case-study";
export * from "./github";
export * from "./ai-stats";
