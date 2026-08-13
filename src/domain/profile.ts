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
  metaDescription: z.string().min(80).max(170), // description SERP/OG — alvo ~150 chars, com keywords da stack
  stackHighlights: z.array(z.string().min(1).max(18)).min(3).max(6), // chips da OG image (≤18 chars cabem no card)
  role: z.string().min(1), // ex.: "Desenvolvedor Full-Stack Sênior" — cargo/senioridade indexável
  languages: z.string().min(1), // ex.: "Português (nativo) · Inglês intermediário-avançado (B2)"
  location: z.string().min(1), // "Brasília-DF, Brasil" — NUNCA endereço completo
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
  metricsAsOf: z.string().min(1),
  asOfYm: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), // mês de referência, ex.: "2026-08"
  metrics: z.array(metricSchema).min(3).max(4),
});

export type Profile = z.infer<typeof profileSchema>;
export type Metric = z.infer<typeof metricSchema>;
