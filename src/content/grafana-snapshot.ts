import type { GrafanaStats } from "@/domain";

/**
 * Fallback estático usado quando a API do Grafana Cloud falha ou não há
 * credenciais (dev local). Uptime vem do histórico real do workflow
 * uptime.yml do GitHub Actions (820 execuções, 8 falhas) — não existe no
 * Prometheus, então nunca é live. Os demais valores: conferir/regenerar no
 * Grafana Explore com as queries de src/services/grafana/core.ts e
 * atualizar aqui junto com fetchedAt.
 */
export const grafanaSnapshot: GrafanaStats = {
  fetchedAt: "2026-08-01T00:00:00Z",
  uptime30dPct: 99.0,
  p95RedirectMs: 180,
  errorRate5xxPct: 0.4,
  reqPerMin: 12,
  live: {
    uptime30dPct: false,
    p95RedirectMs: false,
    errorRate5xxPct: false,
    reqPerMin: false,
  },
};
