import { z } from "zod";

export const caseChapterSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("prose"),
    id: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    kind: z.literal("terminal"),
    id: z.string(),
    title: z.string(),
    intro: z.string(),
    lines: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    kind: z.literal("stats"),
    id: z.string(),
    title: z.string(),
    items: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),
  z.object({
    kind: z.literal("tags"),
    id: z.string(),
    title: z.string(),
    groups: z
      .array(
        z.object({
          label: z.string().min(1),
          items: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  }),
  z.object({
    kind: z.literal("dashboard"),
    id: z.string(),
    title: z.string(),
    intro: z.string(),
    asOf: z.string().min(1),
    okLabel: z.string().min(1),
    stats: z
      .array(
        z.object({ label: z.string().min(1), value: z.string().min(1), sub: z.string().min(1) }),
      )
      .min(3),
    columns: z.object({
      workflow: z.string().min(1),
      runs: z.string().min(1),
      failures: z.string().min(1),
      success: z.string().min(1),
    }),
    rows: z
      .array(
        z.object({
          label: z.string().min(1),
          runs: z.number().int().positive(),
          failures: z.number().int().nonnegative(),
        }),
      )
      .min(1),
  }),
]);

export const caseStudySchema = z.object({
  slug: z.literal("link-charts"),
  title: z.string().min(1),
  tagline: z.string().min(1),
  productUrl: z.string().url(),
  chapters: z.array(caseChapterSchema).min(5),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
export type CaseChapter = z.infer<typeof caseChapterSchema>;
