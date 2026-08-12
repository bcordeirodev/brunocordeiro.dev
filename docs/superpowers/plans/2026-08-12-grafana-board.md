# Grafana Board (link-charts) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O capítulo "Operação em números" de `/[locale]/link-charts` passa a consumir métricas reais da API Prometheus do Grafana Cloud e a exibi-las num board com visual de dashboard Grafana (stat panels com thresholds, gauge de uptime, barras de atividade), com fallback por painel para snapshot versionado.

**Architecture:** Espelha o serviço GitHub existente: `src/services/grafana/core.ts` (fetch puro, testável, injeta `fetchFn`) + `index.ts` (`"use cache"` + `cacheLife("hours")` + `cacheTag("grafana")` + fallback para `src/content/grafana-snapshot.ts`). Novo kind `grafana` no discriminated union de capítulos substitui o kind `dashboard` (que é removido junto com `DashboardPanel`). O board é server component com um filho client (`GrafanaBars`, ApexCharts lazy no padrão do `activity-sparkline.tsx`).

**Tech Stack:** Next.js 16 (App Router, `"use cache"`), zod 4, vitest + testing-library, ApexCharts (react-apexcharts), Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-08-12-grafana-board-design.md`

## Global Constraints

- Commits: Conventional Commits, subject minúsculo, imperativo, sem ponto final, **sem qualquer referência a IA/Claude/Anthropic, sem Co-Authored-By**.
- `git add` sempre com paths explícitos — há mudanças de outra sessão no checkout (`src/content/{en,pt}/experiences.ts`, `mobprobe.mjs`, `mobshot.mjs`): **não tocar, não commitar**.
- ESLint 0 warnings (`npm run lint`), TypeScript estrito (`npm run typecheck`), prettier (`npm run format:check`).
- Testes: `npm test` (vitest, jsdom, alias `@` → `src`).
- Conteúdo pt/en com paridade estrutural (mesmos ids de capítulo nos dois locales) — validado por `src/content/content.test.ts`.
- Envs novas (produção, fornecidas depois pelo Bruno): `GRAFANA_PROM_URL`, `GRAFANA_PROM_USER`, `GRAFANA_PROM_TOKEN`. Sem elas o site renderiza 100% do snapshot, sem chamadas de rede.
- Paleta Grafana dark usada **localmente** nos componentes (site é dark-only): board `#111217`, painel `#181b1f`, borda `#2c3235`, texto `#ccccdc`, texto dim `#8e8e9a`, verde `#73bf69`, amarelo `#f2cc0c`, vermelho `#f2495c`.
- Sem logo do Grafana — atribuição apenas textual (vem do content).

---

### Task 1: Domínio `GrafanaStats`

**Files:**
- Create: `src/domain/grafana.ts`
- Modify: `src/domain/index.ts` (adicionar `export * from "./grafana";`)
- Test: `src/domain/domain.test.ts` (adicionar bloco)

**Interfaces:**
- Consumes: nada.
- Produces: `grafanaStatsSchema` (zod) e `type GrafanaStats = z.infer<typeof grafanaStatsSchema>`, exportados de `@/domain`. Campos: `fetchedAt: string`, `uptime30dPct: number (0–100)`, `p95RedirectMs: number (>=0)`, `errorRate5xxPct: number (0–100)`, `reqPerMin: number (>=0)`, `live: { uptime30dPct: boolean; p95RedirectMs: boolean; errorRate5xxPct: boolean; reqPerMin: boolean }`.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao final de `src/domain/domain.test.ts` (seguir o estilo dos blocos existentes do arquivo):

```ts
describe("grafanaStatsSchema", () => {
  it("aceita stats válidos e rejeita uptime fora de 0–100", () => {
    const valid = {
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
    expect(() => grafanaStatsSchema.parse(valid)).not.toThrow();
    expect(() => grafanaStatsSchema.parse({ ...valid, uptime30dPct: 101 })).toThrow();
  });
});
```

E no import do topo do arquivo, acrescentar `grafanaStatsSchema` à lista importada de `"./index"` (ou de onde o teste já importa os schemas — seguir o import existente do arquivo).

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/domain/domain.test.ts`
Expected: FAIL — `grafanaStatsSchema` não exportado.

- [ ] **Step 3: Implementar o domínio**

`src/domain/grafana.ts`:

```ts
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
```

Em `src/domain/index.ts`, adicionar ao bloco de re-exports:

```ts
export * from "./grafana";
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/domain/domain.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/grafana.ts src/domain/index.ts src/domain/domain.test.ts
git commit -m "feat(domain): add grafana stats schema"
```

---

### Task 2: Snapshot versionado

**Files:**
- Create: `src/content/grafana-snapshot.ts`

**Interfaces:**
- Consumes: `GrafanaStats` de `@/domain` (Task 1).
- Produces: `grafanaSnapshot: GrafanaStats` exportado de `@/content/grafana-snapshot`, com todos os `live` em `false`.

- [ ] **Step 1: Criar o snapshot**

`src/content/grafana-snapshot.ts`:

```ts
import type { GrafanaStats } from "@/domain";

/**
 * Fallback estático usado quando a API do Grafana Cloud falha ou não há
 * credenciais (dev local). Uptime vem do histórico real do probe externo
 * (820 execuções, 8 falhas). Os demais valores: conferir/regenerar no
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
```

- [ ] **Step 2: Verificar tipos**

Run: `npm run typecheck`
Expected: PASS (sem erros)

- [ ] **Step 3: Commit**

```bash
git add src/content/grafana-snapshot.ts
git commit -m "feat(content): add grafana metrics snapshot fallback"
```

---

### Task 3: Serviço core — fetch Prometheus com fallback por painel

**Files:**
- Create: `src/services/grafana/core.ts`
- Test: `src/services/grafana/core.test.ts`

**Interfaces:**
- Consumes: `grafanaStatsSchema`, `GrafanaStats` de `@/domain` (Task 1).
- Produces:
  - `type GrafanaPromAuth = { url: string; user: string; token: string }`
  - `QUERIES: Record<"uptime30dPct" | "p95RedirectMs" | "errorRate5xxPct" | "reqPerMin", string>` (PromQL, exportado para testes e ajuste fácil)
  - `fetchGrafanaStats(fetchFn: typeof fetch, auth: GrafanaPromAuth, snapshot: GrafanaStats): Promise<GrafanaStats>` — nunca rejeita por query individual; query que falha usa o valor do snapshot e `live[campo] = false`.

- [ ] **Step 1: Escrever os testes que falham**

`src/services/grafana/core.test.ts`:

```ts
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
  it("retorna os 4 valores live quando todas as queries respondem", async () => {
    const byQuery: Record<string, number> = {
      [QUERIES.uptime30dPct]: 99.7,
      [QUERIES.p95RedirectMs]: 142,
      [QUERIES.errorRate5xxPct]: 0.2,
      [QUERIES.reqPerMin]: 34.5,
    };
    const fetchFn = vi.fn().mockImplementation((url: string) =>
      Promise.resolve(promOk(byQuery[queryOf(url)])),
    );
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result.uptime30dPct).toBe(99.7);
    expect(result.p95RedirectMs).toBe(142);
    expect(result.errorRate5xxPct).toBe(0.2);
    expect(result.reqPerMin).toBe(34.5);
    expect(result.live).toEqual({
      uptime30dPct: true,
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
    expect(result.live.uptime30dPct).toBe(true);
    expect(result.live.errorRate5xxPct).toBe(true);
    expect(result.live.reqPerMin).toBe(true);
  });

  it("trata resultado vazio como falha daquele painel", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (queryOf(url) === QUERIES.uptime30dPct) return Promise.resolve(promEmpty());
      return Promise.resolve(promOk(10));
    });
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result.uptime30dPct).toBe(snapshot.uptime30dPct);
    expect(result.live.uptime30dPct).toBe(false);
  });

  it("quando todas as queries falham devolve o snapshot inteiro", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 403 }));
    const result = await fetchGrafanaStats(fetchFn as unknown as typeof fetch, auth, snapshot);
    expect(result).toEqual(snapshot);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/services/grafana/core.test.ts`
Expected: FAIL — módulo `./core` não existe.

- [ ] **Step 3: Implementar o core**

`src/services/grafana/core.ts`:

```ts
import { grafanaStatsSchema, type GrafanaStats } from "@/domain";

export type GrafanaPromAuth = { url: string; user: string; token: string };

// PromQL contra o workspace do Link Charts no Grafana Cloud. Os nomes exatos
// das métricas OTel podem divergir do workspace real — ajustar aqui (e o
// snapshot em src/content/grafana-snapshot.ts cobre enquanto isso).
export const QUERIES = {
  uptime30dPct: "100 * avg_over_time(probe_success[30d])",
  p95RedirectMs:
    '1000 * histogram_quantile(0.95, sum by (le) (rate(http_server_duration_seconds_bucket{http_route="/r/{slug}"}[24h])))',
  errorRate5xxPct:
    '100 * sum(rate(http_server_duration_seconds_count{http_status_code=~"5.."}[24h])) / sum(rate(http_server_duration_seconds_count[24h]))',
  reqPerMin: "60 * sum(rate(http_server_duration_seconds_count[24h]))",
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
    uptime30dPct: snapshot.uptime30dPct,
    p95RedirectMs: snapshot.p95RedirectMs,
    errorRate5xxPct: snapshot.errorRate5xxPct,
    reqPerMin: snapshot.reqPerMin,
  };
  const live = { ...snapshot.live };
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
    ...values,
    live,
  });
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/services/grafana/core.test.ts`
Expected: PASS (5 testes)

- [ ] **Step 5: Commit**

```bash
git add src/services/grafana/core.ts src/services/grafana/core.test.ts
git commit -m "feat(grafana): fetch prometheus stats with per-panel fallback"
```

---

### Task 4: Wrapper cacheado + tag `grafana` no revalidate

**Files:**
- Create: `src/services/grafana/index.ts`
- Modify: `src/app/api/revalidate/route.ts`

**Interfaces:**
- Consumes: `fetchGrafanaStats`, `GrafanaPromAuth` (Task 3); `grafanaSnapshot` (Task 2).
- Produces: `getGrafanaStats(): Promise<GrafanaStats>` exportado de `@/services/grafana`. Rota `/api/revalidate` aceita `?tag=github|grafana` (sem `tag` ou valor inválido → revalida as duas).

- [ ] **Step 1: Implementar o wrapper**

`src/services/grafana/index.ts` (espelho de `src/services/github/index.ts`):

```ts
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
```

- [ ] **Step 2: Estender a rota de revalidate**

Em `src/app/api/revalidate/route.ts`, substituir a função `handle` por:

```ts
const VALID_TAGS = ["github", "grafana"] as const;

function handle(request: Request): NextResponse {
  if (!isAuthorized(request)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  const requested = new URL(request.url).searchParams.get("tag");
  const tags = (VALID_TAGS as readonly string[]).includes(requested ?? "")
    ? [requested as string]
    : [...VALID_TAGS];
  // expire: 0 hard-expires the entry so the very next request refetches,
  // instead of stale-while-revalidate serving old data one more time.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tags });
}
```

E atualizar o comentário do topo do arquivo de "(GitHub showcase)" para "(GitHub showcase, Grafana stats)".

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npx vitest run src/services`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/services/grafana/index.ts src/app/api/revalidate/route.ts
git commit -m "feat(grafana): add cached stats service and revalidate tag"
```

---

### Task 5: Kind `grafana` no domínio + migração do conteúdo pt/en

**Files:**
- Modify: `src/domain/case-study.ts` (trocar o objeto do kind `dashboard` pelo kind `grafana` no union)
- Modify: `src/content/pt/case-study.ts` (capítulo `operations`)
- Modify: `src/content/en/case-study.ts` (capítulo `operations`)

**Interfaces:**
- Consumes: nada novo.
- Produces: no union `caseChapterSchema`, o membro `dashboard` é **substituído** por:

```ts
z.object({
  kind: z.literal("grafana"),
  id: z.string(),
  title: z.string(),
  intro: z.string(),
  board: z.object({
    title: z.string().min(1),
    timeRange: z.string().min(1),
    attribution: z.string().min(1),
    snapshotLabel: z.string().min(1),
    updatedLabel: z.string().min(1),
    footer: z.string().min(1),
  }),
  panels: z.object({
    uptime: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
    p95: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
    errors: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
    reqRate: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
    activity: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
  }),
}),
```

O tipo `Extract<CaseChapter, { kind: "grafana" }>` é o que a Task 6 consome.

- [ ] **Step 1: Atualizar o schema**

Em `src/domain/case-study.ts`, remover o `z.object({ kind: z.literal("dashboard"), ... })` inteiro do union e inserir o objeto acima no lugar.

- [ ] **Step 2: Rodar testes e ver o conteúdo quebrar**

Run: `npx vitest run src/content/content.test.ts`
Expected: FAIL — capítulo `operations` (kind `dashboard`) não valida mais. Confirma que o schema mudou.

- [ ] **Step 3: Migrar o conteúdo pt**

Em `src/content/pt/case-study.ts`, substituir o capítulo `operations` inteiro (o objeto `kind: "dashboard"`) por:

```ts
{
  kind: "grafana",
  id: "operations",
  title: "Operação em números",
  intro:
    "O retrato que o Grafana mede de verdade: métricas de produção consultadas na API do Grafana Cloud e renderizadas aqui — nenhum número de vitrine.",
  board: {
    title: "linkcharts · produção",
    timeRange: "Últimos 30 dias",
    attribution: "dados via Grafana Cloud · Prometheus",
    snapshotLabel: "snapshot",
    updatedLabel: "atualizado",
    footer:
      "1.035/1.035 amostras de deploy com HTTP 200 · 9 alert rules e 4 dashboards versionados como JSON no repositório — zero config na UI",
  },
  panels: {
    uptime: {
      title: "uptime · 30d",
      sub: "probe externo a cada 5 min — abre issue de incidente sozinho",
    },
    p95: {
      title: "latência p95 · redirect",
      sub: "rota crítica /r/{slug}, últimas 24h",
    },
    errors: {
      title: "erros 5xx",
      sub: "percentual das requisições, últimas 24h",
    },
    reqRate: {
      title: "requisições/min",
      sub: "média das últimas 24h",
    },
    activity: {
      title: "commits por mês",
      sub: "git real dos repositórios do Link Charts, mar/2025–ago/2026",
    },
  },
},
```

- [ ] **Step 4: Migrar o conteúdo en**

Em `src/content/en/case-study.ts`, substituir o capítulo `operations` inteiro por:

```ts
{
  kind: "grafana",
  id: "operations",
  title: "Operations in numbers",
  intro:
    "The picture Grafana actually measures: production metrics queried from the Grafana Cloud API and rendered here — no vanity metrics.",
  board: {
    title: "linkcharts · production",
    timeRange: "Last 30 days",
    attribution: "data via Grafana Cloud · Prometheus",
    snapshotLabel: "snapshot",
    updatedLabel: "updated",
    footer:
      "1,035/1,035 deploy samples with HTTP 200 · 9 alert rules and 4 dashboards versioned as JSON in the repository — zero UI config",
  },
  panels: {
    uptime: {
      title: "uptime · 30d",
      sub: "external probe every 5 min — opens an incident issue on its own",
    },
    p95: {
      title: "p95 latency · redirect",
      sub: "critical route /r/{slug}, last 24h",
    },
    errors: {
      title: "5xx errors",
      sub: "share of requests, last 24h",
    },
    reqRate: {
      title: "requests/min",
      sub: "average over the last 24h",
    },
    activity: {
      title: "commits per month",
      sub: "real git history of the Link Charts repositories, Mar 2025–Aug 2026",
    },
  },
},
```

- [ ] **Step 5: Rodar os testes de conteúdo e domínio**

Run: `npx vitest run src/content/content.test.ts src/domain/domain.test.ts`
Expected: PASS. (O typecheck completo ainda falha porque `dashboard-panel.tsx`/`case-chapter.tsx` referenciam o kind removido — resolvido na Task 7; não rodar `npm run typecheck` neste commit.)

- [ ] **Step 6: Commit**

```bash
git add src/domain/case-study.ts src/content/pt/case-study.ts src/content/en/case-study.ts
git commit -m "feat(content): migrate operations chapter to grafana board kind"
```

---

### Task 6: Componentes `GrafanaBars` e `GrafanaBoard`

**Files:**
- Create: `src/components/sections/grafana-bars.tsx`
- Create: `src/components/sections/grafana-board.tsx`
- Test: `src/components/sections/grafana-board.test.tsx`

**Interfaces:**
- Consumes: `Extract<CaseChapter, { kind: "grafana" }>` (Task 5), `GrafanaStats` (Task 1), `linkchartsActivity` de `@/content/linkcharts-activity`, `type Locale` de `@/content`.
- Produces: `GrafanaBoard({ chapter, stats, locale }: { chapter: GrafanaChapter; stats: GrafanaStats; locale: Locale })` — server component; `GrafanaBars({ categories, values, label }: { categories: string[]; values: number[]; label: string })` — client component.

- [ ] **Step 1: Escrever os testes que falham**

`src/components/sections/grafana-board.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { CaseChapter, GrafanaStats } from "@/domain";
import { GrafanaBoard } from "./grafana-board";

const chapter: Extract<CaseChapter, { kind: "grafana" }> = {
  kind: "grafana",
  id: "operations",
  title: "Operação em números",
  intro: "intro",
  board: {
    title: "linkcharts · produção",
    timeRange: "Últimos 30 dias",
    attribution: "dados via Grafana Cloud · Prometheus",
    snapshotLabel: "snapshot",
    updatedLabel: "atualizado",
    footer: "rodapé do board",
  },
  panels: {
    uptime: { title: "uptime · 30d", sub: "probe externo" },
    p95: { title: "latência p95 · redirect", sub: "rota crítica" },
    errors: { title: "erros 5xx", sub: "percentual" },
    reqRate: { title: "requisições/min", sub: "média 24h" },
    activity: { title: "commits por mês", sub: "git real" },
  },
};

const stats: GrafanaStats = {
  fetchedAt: "2026-08-12T10:00:00Z",
  uptime30dPct: 99.0,
  p95RedirectMs: 180,
  errorRate5xxPct: 0.4,
  reqPerMin: 12,
  live: { uptime30dPct: true, p95RedirectMs: true, errorRate5xxPct: true, reqPerMin: true },
};

it("renderiza chrome do board, painéis e valores formatados", () => {
  render(<GrafanaBoard chapter={chapter} stats={stats} locale="pt" />);
  expect(screen.getByText("linkcharts · produção")).toBeInTheDocument();
  expect(screen.getByText("Últimos 30 dias")).toBeInTheDocument();
  expect(screen.getByText("dados via Grafana Cloud · Prometheus")).toBeInTheDocument();
  expect(screen.getByText("rodapé do board")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /uptime/ })).toBeInTheDocument();
  expect(screen.getByText("180 ms")).toBeInTheDocument();
  expect(screen.getByText("0,4%")).toBeInTheDocument();
});

it("colore o p95 por threshold (vermelho acima de 800 ms)", () => {
  render(
    <GrafanaBoard chapter={chapter} stats={{ ...stats, p95RedirectMs: 950 }} locale="pt" />,
  );
  expect(screen.getByText("950 ms")).toHaveStyle({ color: "#f2495c" });
});

it("marca painéis vindos de snapshot", () => {
  render(
    <GrafanaBoard
      chapter={chapter}
      stats={{
        ...stats,
        live: { uptime30dPct: true, p95RedirectMs: false, errorRate5xxPct: false, reqPerMin: true },
      }}
      locale="pt"
    />,
  );
  expect(screen.getAllByText("snapshot")).toHaveLength(2);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/sections/grafana-board.test.tsx`
Expected: FAIL — módulo `./grafana-board` não existe.

- [ ] **Step 3: Implementar `GrafanaBars`**

`src/components/sections/grafana-bars.tsx` (mesmo padrão lazy/in-view do `activity-sparkline.tsx`):

```tsx
"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { ApexOptions } from "apexcharts";

// ApexCharts só roda no browser — carregado fora do bundle inicial e sem SSR
// (mesmo padrão do activity-sparkline).
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function GrafanaBars({
  categories,
  values,
  label,
}: {
  categories: string[];
  values: number[];
  label: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: !reduced },
      foreColor: "#8e8e9a",
      parentHeightOffset: 0,
    },
    colors: ["#73bf69"],
    plotOptions: { bar: { columnWidth: "60%", borderRadius: 2 } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#2c3235", strokeDashArray: 3 },
    xaxis: { categories, labels: { rotate: -45, style: { fontSize: "10px" } } },
    yaxis: { labels: { style: { fontSize: "10px" } } },
    tooltip: { theme: "dark", y: { formatter: (value) => `${value}` } },
  };

  return (
    <div ref={ref} role="img" aria-label={label} className="min-h-40">
      {inView ? (
        <ReactApexChart
          options={options}
          series={[{ name: label, data: values }]}
          type="bar"
          height={160}
          width="100%"
        />
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Implementar `GrafanaBoard`**

`src/components/sections/grafana-board.tsx`:

```tsx
import type { ReactNode } from "react";
import type { CaseChapter, GrafanaStats } from "@/domain";
import type { Locale } from "@/content";
import { linkchartsActivity } from "@/content/linkcharts-activity";
import { GrafanaBars } from "./grafana-bars";

type GrafanaChapter = Extract<CaseChapter, { kind: "grafana" }>;

// Paleta dark do Grafana, aplicada localmente: o board deve parecer um
// dashboard Grafana de verdade, não um card do site.
const G = {
  board: "#111217",
  panel: "#181b1f",
  border: "#2c3235",
  text: "#ccccdc",
  dim: "#8e8e9a",
  green: "#73bf69",
  yellow: "#f2cc0c",
  red: "#f2495c",
} as const;

const uptimeColor = (v: number) => (v >= 99 ? G.green : v >= 95 ? G.yellow : G.red);
const p95Color = (v: number) => (v <= 300 ? G.green : v <= 800 ? G.yellow : G.red);
const errorColor = (v: number) => (v < 1 ? G.green : v < 5 ? G.yellow : G.red);

function fmt(locale: Locale, value: number, digits: number): string {
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function SnapshotBadge({ label }: { label: string }) {
  return (
    <span
      className="rounded border px-1 py-px font-mono text-[10px] leading-none"
      style={{ color: G.dim, borderColor: G.border }}
    >
      {label}
    </span>
  );
}

function Panel({
  title,
  sub,
  badge,
  className,
  children,
}: {
  title: string;
  sub: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-sm border ${className ?? ""}`}
      style={{ backgroundColor: G.panel, borderColor: G.border }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-1.5"
        style={{ borderColor: G.border }}
      >
        <span className="truncate text-xs font-medium" style={{ color: G.text }}>
          {title}
        </span>
        {badge}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        {children}
        <span className="text-[11px] leading-snug" style={{ color: G.dim }}>
          {sub}
        </span>
      </div>
    </div>
  );
}

function StatValue({ text, color }: { text: string; color: string }) {
  return (
    <span className="font-mono text-2xl leading-none tracking-tight" style={{ color }}>
      {text}
    </span>
  );
}

function UptimeGauge({ pct, label, color, text }: { pct: number; label: string; color: string; text: string }) {
  const r = 54;
  const arc = Math.PI * r;
  const filled = (Math.min(Math.max(pct, 0), 100) / 100) * arc;
  return (
    <svg viewBox="0 0 140 84" role="img" aria-label={label} className="w-full max-w-45 self-center">
      <path
        d="M 16 74 A 54 54 0 0 1 124 74"
        fill="none"
        stroke={G.border}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 16 74 A 54 54 0 0 1 124 74"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arc}`}
      />
      <text
        x="70"
        y="68"
        textAnchor="middle"
        fontSize="19"
        fontFamily="var(--font-geist-mono, monospace)"
        fill={color}
      >
        {text}
      </text>
    </svg>
  );
}

export function GrafanaBoard({
  chapter,
  stats,
  locale,
}: {
  chapter: GrafanaChapter;
  stats: GrafanaStats;
  locale: Locale;
}) {
  const { board, panels } = chapter;
  const badge = (key: keyof GrafanaStats["live"]) =>
    stats.live[key] ? undefined : <SnapshotBadge label={board.snapshotLabel} />;
  const updatedAt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(stats.fetchedAt));

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ backgroundColor: G.board, borderColor: G.border }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-4 py-2"
        style={{ borderColor: G.border }}
      >
        <span className="font-mono text-xs font-medium" style={{ color: G.text }}>
          {board.title}
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: G.dim }}>
          <span
            className="rounded border px-1.5 py-0.5 font-mono"
            style={{ borderColor: G.border }}
          >
            {board.timeRange}
          </span>
          <span>
            {board.updatedLabel} {updatedAt} UTC
          </span>
          <span style={{ color: G.text }}>{board.attribution}</span>
        </span>
      </div>

      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
        <Panel title={panels.uptime.title} sub={panels.uptime.sub} badge={badge("uptime30dPct")}>
          <UptimeGauge
            pct={stats.uptime30dPct}
            label={`${panels.uptime.title}: ${fmt(locale, stats.uptime30dPct, 1)}%`}
            color={uptimeColor(stats.uptime30dPct)}
            text={`${fmt(locale, stats.uptime30dPct, 1)}%`}
          />
        </Panel>
        <Panel title={panels.p95.title} sub={panels.p95.sub} badge={badge("p95RedirectMs")}>
          <StatValue
            text={`${fmt(locale, Math.round(stats.p95RedirectMs), 0)} ms`}
            color={p95Color(stats.p95RedirectMs)}
          />
        </Panel>
        <Panel title={panels.errors.title} sub={panels.errors.sub} badge={badge("errorRate5xxPct")}>
          <StatValue
            text={`${fmt(locale, stats.errorRate5xxPct, 1)}%`}
            color={errorColor(stats.errorRate5xxPct)}
          />
        </Panel>
        <Panel title={panels.reqRate.title} sub={panels.reqRate.sub} badge={badge("reqPerMin")}>
          <StatValue text={fmt(locale, stats.reqPerMin, 1)} color={G.green} />
        </Panel>
        <Panel
          title={panels.activity.title}
          sub={panels.activity.sub}
          className="sm:col-span-2 lg:col-span-4"
        >
          <GrafanaBars
            categories={linkchartsActivity.months}
            values={linkchartsActivity.values}
            label={panels.activity.title}
          />
        </Panel>
      </div>

      <div className="border-t px-4 py-2 text-[11px]" style={{ borderColor: G.border, color: G.dim }}>
        {board.footer}
      </div>
    </div>
  );
}
```

Nota: `0,4%` no teste vem de `fmt("pt", 0.4, 1)` → `"0,4"` + `"%"`. O `getByText("180 ms")`/`"950 ms"` vem do `StatValue` do p95.

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run src/components/sections/grafana-board.test.tsx`
Expected: PASS (3 testes)

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/grafana-bars.tsx src/components/sections/grafana-board.tsx src/components/sections/grafana-board.test.tsx
git commit -m "feat(link-charts): add grafana-style board components"
```

---

### Task 7: Integração na página + remoção do kind `dashboard`

**Files:**
- Modify: `src/components/sections/case-chapter.tsx` (case `grafana`, remover case `dashboard`, novas props)
- Modify: `src/app/[locale]/link-charts/page.tsx` (buscar stats, passar props)
- Delete: `src/components/sections/dashboard-panel.tsx`
- Modify: `src/components/sections/case-chapter.test.tsx` (cobrir o case `grafana`)

**Interfaces:**
- Consumes: `GrafanaBoard` (Task 6), `getGrafanaStats` (Task 4), `grafanaSnapshot` (Task 2).
- Produces: `CaseChapter({ chapter, grafanaStats?, locale? })` — `grafanaStats` e `locale` opcionais (default: snapshot e `"pt"`), para os testes existentes continuarem chamando só com `chapter`.

- [ ] **Step 1: Atualizar `case-chapter.tsx`**

Trocar o import de `DashboardPanel` e a assinatura/switch:

```tsx
import type { CaseChapter as CaseChapterType, GrafanaStats } from "@/domain";
import type { Locale } from "@/content";
import { PipelineDiagramLazy } from "@/components/terminal/pipeline-diagram-lazy";
import { GrafanaBoard } from "@/components/sections/grafana-board";
import { grafanaSnapshot } from "@/content/grafana-snapshot";
import { Badge } from "@/components/ui/badge";

export function CaseChapter({
  chapter,
  grafanaStats,
  locale = "pt",
}: {
  chapter: CaseChapterType;
  grafanaStats?: GrafanaStats;
  locale?: Locale;
}) {
  switch (chapter.kind) {
    // ... cases prose/terminal/tags/stats inalterados ...
    case "grafana":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <p className="mt-4 text-muted">{chapter.intro}</p>
          <div className="mt-6">
            <GrafanaBoard chapter={chapter} stats={grafanaStats ?? grafanaSnapshot} locale={locale} />
          </div>
        </section>
      );
  }
}
```

Remover o `case "dashboard"` inteiro. No comentário do case `prose` que menciona "dashboard-panel.tsx", trocar a referência por "grafana-board" não é preciso — o padrão citado (tabIndex/role em região com scroll) deixa de ter par; reescrever o comentário para: `// tabIndex/role: região com scroll horizontal precisa ser alcançável por teclado (axe scrollable-region-focusable em viewports estreitos).`

- [ ] **Step 2: Deletar `dashboard-panel.tsx`**

```bash
git rm src/components/sections/dashboard-panel.tsx
```

- [ ] **Step 3: Atualizar a página**

Em `src/app/[locale]/link-charts/page.tsx`:

```tsx
import { getGrafanaStats } from "@/services/grafana";
```

Trocar a busca de dados:

```tsx
const [showcase, grafanaStats] = await Promise.all([getGithubShowcase(), getGrafanaStats()]);
```

E o map de capítulos:

```tsx
{caseStudy.chapters.map((chapter) => (
  <Reveal key={chapter.id}>
    <CaseChapter chapter={chapter} grafanaStats={grafanaStats} locale={locale} />
  </Reveal>
))}
```

- [ ] **Step 4: Cobrir o case `grafana` no teste do `CaseChapter`**

Adicionar a `src/components/sections/case-chapter.test.tsx`:

```tsx
it("renderiza capítulo grafana com o board (snapshot por default)", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "grafana",
        id: "operations",
        title: "Operação em números",
        intro: "intro",
        board: {
          title: "linkcharts · produção",
          timeRange: "Últimos 30 dias",
          attribution: "dados via Grafana Cloud · Prometheus",
          snapshotLabel: "snapshot",
          updatedLabel: "atualizado",
          footer: "rodapé",
        },
        panels: {
          uptime: { title: "uptime · 30d", sub: "probe" },
          p95: { title: "latência p95 · redirect", sub: "rota" },
          errors: { title: "erros 5xx", sub: "pct" },
          reqRate: { title: "requisições/min", sub: "média" },
          activity: { title: "commits por mês", sub: "git" },
        },
      }}
    />,
  );
  expect(screen.getByRole("heading", { name: "Operação em números" })).toBeInTheDocument();
  expect(screen.getByText("linkcharts · produção")).toBeInTheDocument();
  // sem stats injetados, tudo vem do snapshot → 4 badges
  expect(screen.getAllByText("snapshot")).toHaveLength(4);
});
```

- [ ] **Step 5: Verificação completa**

Run: `npm run typecheck && npm run lint && npm test && npm run format:check`
Expected: tudo PASS, 0 warnings. Se o prettier reclamar, rodar `npm run format` e conferir o diff antes de commitar (apenas nos arquivos deste trabalho).

- [ ] **Step 6: Verificar a página no app real**

Run: `npm run build`
Expected: build passa; rota `/[locale]/link-charts` gera sem erro (snapshot puro, sem envs). Opcional: `npm run dev` e abrir `http://localhost:3000/pt/link-charts` para conferir o board visualmente (chrome, painéis, gauge, barras ao rolar até elas).

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/case-chapter.tsx src/components/sections/case-chapter.test.tsx src/app/[locale]/link-charts/page.tsx
git commit -m "feat(link-charts): render grafana board and drop dashboard panel"
```

(O `git rm` do Step 2 já deixou a deleção staged; conferir com `git status --short` que **nada** de `experiences.ts`/`mobprobe.mjs`/`mobshot.mjs` está staged antes de commitar.)

---

## Pós-implementação (fora do código)

- Bruno cria no Grafana Cloud um token read-only de Prometheus e configura `GRAFANA_PROM_URL`, `GRAFANA_PROM_USER`, `GRAFANA_PROM_TOKEN` no ambiente de produção (Vercel).
- Ajustar os nomes de métrica em `QUERIES` (`src/services/grafana/core.ts`) conforme o workspace real (testar no Grafana Explore).
- Conferir/atualizar os valores do `grafana-snapshot.ts` com números reais exportados do Grafana antes do deploy (p95, erro 5xx, req/min são estimativas iniciais).
- `curl -X POST "https://brunocordeiro.dev/api/revalidate?tag=grafana&secret=..."` para forçar refresh quando quiser.
