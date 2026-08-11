import { z } from "zod";

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "esperado YYYY-MM");

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  employmentType: z.enum(["full-time", "freelance", "part-time"]),
  start: yearMonth,
  end: yearMonth.nullable(),
  location: z.string().optional(),
  stacks: z.array(z.string().min(1)).min(1),
  projects: z.array(z.object({ name: z.string().min(1), description: z.string().min(1) })),
});

export type Experience = z.infer<typeof experienceSchema>;
