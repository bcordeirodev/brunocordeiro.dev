import { z } from "zod";

// site oficial de uma tecnologia da skill, ex.: { label: "React", url: "https://react.dev" }
export const skillLinkSchema = z.object({
  label: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  proof: z.string().min(1),
  // onde a skill foi exercitada (empresas/projetos), ex.: ["Link Charts", "G4F"]
  tags: z.array(z.string().min(1)).min(1),
  // sites oficiais das tecnologias citadas no nome (máx. 3 por skill);
  // ausente em skills conceituais — ver docs/superpowers/specs/2026-08-12-stack-official-sites-design.md
  links: z.array(skillLinkSchema).min(1).optional(),
});

export const skillCategoryIdSchema = z.enum(["frontend", "backend", "devops", "quality", "ai"]);

export const skillCategorySchema = z.object({
  id: skillCategoryIdSchema,
  title: z.string().min(1),
  skills: z.array(skillSchema).min(1),
});

export type SkillLink = z.infer<typeof skillLinkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
