import { grafanaStatsSchema, type GrafanaStats } from "@/domain";

export type GrafanaPromAuth = { url: string; user: string; token: string };

// PromQL contra o workspace do Link Charts no Grafana Cloud, com os nomes
// reais das métricas — copiados dos dashboards versionados do produto
// (backend/ops/observability/grafana/dashboards/*.json). Uptime não tem
// métrica no Prometheus (é o workflow uptime.yml do GitHub Actions, fora
// da infra), por isso não há query para ele: vem sempre do snapshot.
export const QUERIES = {
  p95RedirectMs:
    "1000 * histogram_quantile(0.95, sum by (le) (rate(redirect_duration_seconds_bucket[24h])))",
  errorRate5xxPct:
    '100 * sum(rate(http_server_request_count_total{http_response_status_class="5xx"}[24h])) / clamp_min(sum(rate(http_server_request_count_total[24h])), 0.001)',
  reqPerMin: "60 * sum(rate(http_server_request_count_total[24h]))",
} as const;

export type GrafanaMetricKey = keyof typeof QUERIES;

const QUERY_TIMEOUT_MS = 3000;

async function queryInstant(
  fetchFn: typeof fetch,
  auth: GrafanaPromAuth,
  promql: string,
): Promise<number> {
  const url = `${auth.url.replace(/\/$/, "")}/api/v1/query?query=${encodeURIComponent(promql)}`;
  const res = await fetchFn(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${auth.user}:${auth.token}`).toString("base64")}`,
    },
    signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`grafana ${res.status}`);
  const json = (await res.json()) as {
    status?: string;
    data?: { result?: Array<{ value?: [number, string] }> };
  };
  const raw = json.status === "success" ? json.data?.result?.[0]?.value?.[1] : undefined;
  const value = raw === undefined ? Number.NaN : Number.parseFloat(raw);
  if (!Number.isFinite(value)) throw new Error("grafana: resultado vazio ou não numérico");
  return value;
}

export async function fetchGrafanaStats(
  fetchFn: typeof fetch,
  auth: GrafanaPromAuth,
  snapshot: GrafanaStats,
): Promise<GrafanaStats> {
  const keys = Object.keys(QUERIES) as GrafanaMetricKey[];
  const settled = await Promise.allSettled(
    keys.map((key) => queryInstant(fetchFn, auth, QUERIES[key])),
  );
  const values: Record<GrafanaMetricKey, number> = {
    p95RedirectMs: snapshot.p95RedirectMs,
    errorRate5xxPct: snapshot.errorRate5xxPct,
    reqPerMin: snapshot.reqPerMin,
  };
  // uptime30dPct fica de fora do loop: não existe no Prometheus (GitHub
  // Actions é a fonte), então live.uptime30dPct permanece false sempre.
  const live = { ...snapshot.live, uptime30dPct: false };
  settled.forEach((result, i) => {
    const key = keys[i];
    if (result.status === "fulfilled") {
      values[key] = result.value;
      live[key] = true;
    } else {
      live[key] = false;
    }
  });
  const anyLive = Object.values(live).some(Boolean);
  return grafanaStatsSchema.parse({
    fetchedAt: anyLive ? new Date().toISOString() : snapshot.fetchedAt,
    uptime30dPct: snapshot.uptime30dPct,
    ...values,
    live,
  });
}
