import { z } from "zod";

// Métricas de produção do Link Charts lidas da API Prometheus do Grafana
// Cloud. `live` marca, por campo, se o valor veio da API ou do snapshot
// versionado — o board exibe a origem para nunca mentir sobre os dados.
export const grafanaStatsSchema = z.object({
  fetchedAt: z.string().min(1),
  uptime30dPct: z.number().min(0).max(100),
  p95RedirectMs: z.number().nonnegative(),
  errorRate5xxPct: z.number().min(0).max(100),
  reqPerMin: z.number().nonnegative(),
  live: z.object({
    uptime30dPct: z.boolean(),
    p95RedirectMs: z.boolean(),
    errorRate5xxPct: z.boolean(),
    reqPerMin: z.boolean(),
  }),
});

export type GrafanaStats = z.infer<typeof grafanaStatsSchema>;
