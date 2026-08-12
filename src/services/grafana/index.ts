import { cacheLife, cacheTag } from "next/cache";
import type { GrafanaStats } from "@/domain";
import { grafanaSnapshot } from "@/content/grafana-snapshot";
import { fetchGrafanaStats } from "./core";

export async function getGrafanaStats(): Promise<GrafanaStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("grafana");
  const url = process.env.GRAFANA_PROM_URL;
  const user = process.env.GRAFANA_PROM_USER;
  const token = process.env.GRAFANA_PROM_TOKEN;
  // Sem credenciais (dev local) não há nem tentativa de rede.
  if (!url || !user || !token) return grafanaSnapshot;
  try {
    return await fetchGrafanaStats(fetch, { url, user, token }, grafanaSnapshot);
  } catch {
    return grafanaSnapshot;
  }
}
