import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1),
  proof: z.string().min(1),
  // onde a skill foi exercitada (empresas/projetos), ex.: ["Link Charts", "G4F"]
  tags: z.array(z.string().min(1)).min(1),
});

export const skillCategoryIdSchema = z.enum(["frontend", "backend", "devops", "quality", "ai"]);

export const skillCategorySchema = z.object({
  id: skillCategoryIdSchema,
  title: z.string().min(1),
  skills: z.array(skillSchema).min(1),
});

export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
