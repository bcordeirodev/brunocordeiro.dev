import { describe, expect, it, vi } from "vitest";
import type { GrafanaStats } from "@/domain";
import { fetchGrafanaStats, QUERIES } from "./core";

const snapshot: GrafanaStats = {
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

const auth = { url: "https://prom.example.com", user: "123", token: "tok" };

const promOk = (value: number) =>
  new Response(
    JSON.stringify({
      status: "success",
      data: { resultType: "vector", result: [{ metric: {}, value: [1754000000, String(value)] }] },
    }),
  );

const promEmpty = () =>
  new Response(JSON.stringify({ status: "success", data: { resultType: "vector", result: [] } }));

function queryOf(url: string): string {
  return decodeURIComponent(new URL(url).searchParams.get("query") ?? "");
}

describe("fetchGrafanaStats", () => {
  it("retorna os 3 valores live e mantém uptime do snapshot", async () => {
    const byQuery: Record<string, number> = {
      [QUERIES.p95RedirectMs]: 142,
      [QUERIES.errorRate5xxPct]: 0.2,
      [QUERIES.reqPerMin]: 34.5,
    };
    const fetchFn = vi.fn().mockImplementation((url: string) =>
      Promise.resolve(promOk(byQuery[queryOf(url)])),
    );
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(fetchFn).toHaveBeenCalledTimes(3);
    expect(result.uptime30dPct).toBe(snapshot.uptime30dPct);
    expect(result.p95RedirectMs).toBe(142);
    expect(result.errorRate5xxPct).toBe(0.2);
    expect(result.reqPerMin).toBe(34.5);
    expect(result.live).toEqual({
      uptime30dPct: false,
      p95RedirectMs: true,
      errorRate5xxPct: true,
      reqPerMin: true,
    });
    expect(result.fetchedAt).not.toBe(snapshot.fetchedAt);
  });

  it("autentica com Basic user:token", async () => {
    const fetchFn = vi.fn().mockResolvedValue(promOk(1));
    await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    const authHeader = (init.headers as Record<string, string>).Authorization;
    expect(authHeader).toBe(`Basic ${Buffer.from("123:tok").toString("base64")}`);
  });

  it("faz fallback por painel quando uma query falha", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (queryOf(url) === QUERIES.p95RedirectMs)
        return Promise.resolve(new Response("boom", { status: 500 }));
      return Promise.resolve(promOk(50));
    });
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result.p95RedirectMs).toBe(snapshot.p95RedirectMs);
    expect(result.live.p95RedirectMs).toBe(false);
    expect(result.live.uptime30dPct).toBe(false);
    expect(result.live.errorRate5xxPct).toBe(true);
    expect(result.live.reqPerMin).toBe(true);
  });

  it("trata resultado vazio como falha daquele painel", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (queryOf(url) === QUERIES.reqPerMin) return Promise.resolve(promEmpty());
      return Promise.resolve(promOk(10));
    });
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result.reqPerMin).toBe(snapshot.reqPerMin);
    expect(result.live.reqPerMin).toBe(false);
  });

  it("quando todas as queries falham devolve o snapshot inteiro", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 403 }));
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result).toEqual(snapshot);
  });
});
