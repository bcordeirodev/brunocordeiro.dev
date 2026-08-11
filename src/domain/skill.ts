import { z } from "zod";

export const evidenceLevelSchema = z.enum([
  "production",
  "professional",
  "project",
  "certified",
  "academic",
  "declared",
]);

export const skillSchema = z.object({
  name: z.string().min(1),
  evidence: evidenceLevelSchema,
  proof: z.string().min(1),
  highlight: z.boolean().optional().default(false),
  // onde a skill foi exercitada (serviços/projetos), ex.: ["Link Charts", "G4F"]
  tags: z.array(z.string().min(1)).min(1).optional(),
});

export const skillCategoryIdSchema = z.enum([
  "languages",
  "architecture",
  "frontend",
  "backend",
  "devops",
  "quality",
  "databases",
  "ai",
  "tools",
]);

export const skillCategorySchema = z.object({
  id: skillCategoryIdSchema,
  title: z.string().min(1),
  skills: z.array(skillSchema).min(1),
});

export type EvidenceLevel = z.infer<typeof evidenceLevelSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
