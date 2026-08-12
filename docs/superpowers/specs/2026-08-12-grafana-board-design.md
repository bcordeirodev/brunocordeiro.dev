# Grafana board na página Link Charts — design

Data: 2026-08-12
Status: aprovado

## Objetivo

Fazer o capítulo "Operação em números" de `/[locale]/link-charts` consumir dados
reais do Grafana Cloud e apresentá-los num board com visual de dashboard Grafana,
para que o visitante entenda de imediato que os números vêm do monitoramento
real do produto.

## Decisões (com o usuário)

- **Fonte de dados**: live via API Prometheus do Grafana Cloud, com cache ISR e
  fallback para snapshot versionado (mesmo padrão do serviço GitHub).
- **Painéis**: stat panels + gauge de uptime + barras de atividade
  (commits/mês já existentes em `linkcharts-activity.ts`).
- **Tabela de workflows CI**: removida do board. Os números de CI permanecem
  apenas na prosa dos capítulos.
- Alternativas descartadas: snapshot-only (não consome Grafana de verdade) e
  iframe de dashboard público (pesado, sem controle de LCP/CSP, quebra a
  estética do site).

## Arquitetura

### 1. Domínio — `src/domain/grafana.ts`

```ts
grafanaStatsSchema = z.object({
  fetchedAt: z.string(),            // ISO; no fallback, data do snapshot
  uptime30dPct: z.number(),         // 0–100
  p95RedirectMs: z.number(),
  errorRate5xxPct: z.number(),      // 0–100
  reqPerMin: z.number(),
  live: z.object({                  // origem de cada valor (live vs snapshot)
    uptime30dPct: z.boolean(),
    p95RedirectMs: z.boolean(),
    errorRate5xxPct: z.boolean(),
    reqPerMin: z.boolean(),
  }),
});
```

Exportado por `src/domain/index.ts` como os demais.

### 2. Serviço — `src/services/grafana/`

- `core.ts`: `fetchGrafanaStats(fetchFn, { url, user, token }, snapshot)`.
  Roda 4 queries PromQL **instantâneas** em paralelo contra
  `${url}/api/v1/query` com Basic auth (`user:token`, token read-only):
  - uptime 30d — `100 * avg_over_time(probe_success[30d])`
  - p95 redirect 24h — `histogram_quantile(0.95, ...) * 1000`
  - taxa de erro 5xx 24h — `100 * (rate 5xx / rate total)`
  - req/min 24h — `60 * sum(rate(...))`

  As queries vivem em constantes nomeadas no topo do `core.ts` — os nomes
  exatos das métricas OTel no workspace são incerteza conhecida e serão
  ajustados lá quando o token for plugado.

  **Fallback por painel**: cada query que falhar (HTTP != 200, resultado vazio,
  valor não numérico) resolve para o valor do snapshot e marca `live: false`
  naquele campo. Sem credenciais nas envs, tudo vem do snapshot sem nenhuma
  chamada de rede.
- `index.ts`: `getGrafanaStats()` com `"use cache"`, `cacheLife("hours")`,
  `cacheTag("grafana")`. Lê `GRAFANA_PROM_URL`, `GRAFANA_PROM_USER`,
  `GRAFANA_PROM_TOKEN` das envs.
- Snapshot: `src/content/grafana-snapshot.ts` com números reais curados
  (uptime 99,0% etc.) e comentário de como regenerar.
- Rota `/api/revalidate` existente passa a aceitar a tag `grafana` além de
  `github`.

### 3. UI — `src/components/sections/grafana-board.tsx`

Substitui `DashboardPanel` no capítulo `operations`:

- **Chrome do board**: barra superior com título do dashboard
  (ex.: "linkcharts · produção"), pill de time range ("Últimos 30 dias"),
  timestamp do fetch e atribuição textual "dados via Grafana Cloud ·
  Prometheus" (sem logo — evita uso de marca).
- **Paleta Grafana dark**: board `#111217`, painel `#181b1f`, borda `#2c3235`,
  thresholds verde `#73bf69` / amarelo `#f2cc0c` / vermelho `#f2495c` —
  aplicada localmente no componente (o site é dark-only, sem conflito de tema).
- **Painéis** (grid responsivo, cada um com header próprio):
  - 3 stat panels: p95 redirect, erro 5xx, req/min — valor grande em mono,
    colorido por threshold configurado por painel.
  - 1 gauge SVG semicircular: uptime 30d, estilo gauge do Grafana.
  - 1 painel de barras: commits/mês de `linkcharts-activity.ts`, ApexCharts
    lazy com o mesmo padrão de in-view do `activity-sparkline.tsx`.
- Valores vindos do snapshot (`live: false`) exibem indicador discreto de
  snapshot no painel, para o board nunca mentir sobre a origem.
- Acessibilidade: gauge e barras com `role="img"` + `aria-label`; grid ok em
  320px (lição do stat tile atual).

### 4. Conteúdo e i18n

- Novo kind `grafana` no discriminated union de `src/domain/case-study.ts`:
  `id`, `title`, `intro`, labels dos painéis e do chrome (time range,
  atribuição, indicador de snapshot) — tudo vindo dos content files pt/en.
- O capítulo `operations` em `src/content/{pt,en}/case-study.ts` migra de
  `dashboard` para `grafana`; os 4 stats atuais são redistribuídos: uptime →
  gauge; "9 alert rules como código" e "4 dashboards Grafana" viram uma linha
  de rodapé do board (reforçam o monitoramento-como-código sem ocupar painel).
- O kind `dashboard` e o `DashboardPanel` são removidos se nenhum outro uso
  restar (verificar; hoje só o `operations` usa).
- `page.tsx` chama `getGrafanaStats()` e injeta no `CaseChapter`/board.

### 5. Erros e resiliência

- Nenhuma env → snapshot puro, zero rede (dev local funciona sem setup).
- API fora/lenta → fallback por painel; `AbortSignal.timeout` (~3s) por query.
- Falha de parse → mesmo caminho de fallback; nunca lança para a página.

### 6. Testes

- `src/services/grafana/core.test.ts`: parse de resposta Prometheus, fallback
  por painel (uma query falha, outras seguem live), sem credenciais → snapshot,
  timeout.
- Teste de componente do board: cor por threshold, indicador de snapshot,
  aria-labels.
- `src/domain/domain.test.ts`: novo schema coberto como os demais.
- Leak-check existente de content continua passando (novos labels pt/en).

## Fora de escopo

- Time series RED (linha de req/erros/latência) — não selecionado.
- Tabela de workflows CI no board — removida por decisão.
- Backfill de séries temporais do Prometheus (range queries) — só instantâneas.
