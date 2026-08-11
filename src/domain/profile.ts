import { z } from "zod";

export const metricSchema = z.object({
  id: z.string().min(1),
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  location: z.string().min(1), // "Brasília-DF, Brasil" — NUNCA endereço completo
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
  metricsAsOf: z.string().min(1), // ex.: "ago/2026"
  metrics: z.array(metricSchema).min(3).max(4),
});

export type Profile = z.infer<typeof profileSchema>;
export type Metric = z.infer<typeof metricSchema>;
