import type { CaseStudy } from "@/domain";

export const caseStudy: CaseStudy = {
  slug: "link-charts",
  title: "Link Charts — engenharia de ponta a ponta em produção",
  tagline:
    "Um encurtador de URL com analytics avançado que criei e mantenho sozinho, em produção desde 2025",
  productUrl: "https://linkcharts.com.br",
  chapters: [
    {
      kind: "prose",
      id: "product",
      title: "O produto",
      paragraphs: [
        "Link Charts (linkcharts.com.br) é um encurtador de URL com analytics avançado, em produção, que criei e mantenho 100% sozinho. Cada clique é enriquecido com dados geográficos, de dispositivo, temporais e de qualidade de tráfego, exibidos em 5 dashboards: geral, geográfico (mapa coroplético/heatmap), temporal, audiência e insights.",
        "Em produção: encurtamento autenticado e público, redirect de alta performance com preview Open Graph para bots (WhatsApp/Telegram), anti-fraude com quality score por clique, subdomínios personalizados + página link-in-bio, API pública com API keys, QR codes, tags, relatórios, export CSV, UTM builder, senha em link, expiração/agendamento/click limit, health check de links, e-mails de retenção e monetização via AdSense + Google Ads.",
        "~1.929 commits em 3 repositórios (725 no backend, 1.029 no frontend, o restante em docs), todos meus, de mar/2025 a ago/2026 — mantenho essa atividade contínua em paralelo a um emprego em tempo integral. 50 tags de release com semver independente por repositório (backend em v2.16.0, frontend em v1.19.0).",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Arquitetura",
      paragraphs: [
        "Backend: Laravel 12 / PHP 8.2, PostgreSQL 15, Redis 7. Camadas Controller → Service → Repository com injeção de dependência por interface, DTOs e ADRs. A rota crítica /r/{slug} serve HTML com Open Graph para bots e um redirect 302 para humanos; o tracking é 100% assíncrono via job idempotente — sem lock distribuído: uma coluna dedup_key com índice UNIQUE + insertOrIgnore garante que retry nunca duplica clique. Cache de link de 10 min; enriquecimento em 3 fases (headers → inteligência server-side com viral rank/feriados → quality score anti-fraude).",
        "Frontend: Next.js 15 (App Router) / React 19 / TypeScript estrito, MUI 6 com design system próprio, TanStack Query 5, ISR com cache tags e revalidação sob demanda, i18n en/pt-BR, Auth0, CSP/HSTS em middleware, SEO completo (JSON-LD, sitemap, llms.txt), 30 componentes de gráfico ApexCharts e mapas Leaflet.",
        "Integração: proxy por rewrites (zero CORS), JWT em cookie httpOnly (nunca localStorage), X-Request-Id propagado do navegador ao worker de fila para correlação de logs ponta a ponta. Uma camada própria de dialetos SQL (SqlDateExpr) centraliza os fragmentos dependentes de driver para a suíte rodar idêntica em SQLite e PostgreSQL.",
      ],
    },
    {
      kind: "terminal",
      id: "workflow",
      title: "Do commit ao merge — o gate de qualidade",
      intro:
        "Nenhum merge publica nada. Antes de integrar, cada push passa por este funil: hook local + CI com a suíte rodando duas vezes, em dois bancos.",
      lines: [
        "$ git checkout -b feat/quality-score",
        '$ git commit -m "feat(analytics): quality score por clique"',
        "$ git push  # hook pre-push: 902 testes no container, antes de sair da máquina",
        "▸ ci/validate: pint + phpunit (sqlite :memory:) ........ ok",
        "▸ ci/tests-postgres: a mesma suíte em postgres 15 real . ok",
        "▸ ci/quality (front): tsc + eslint 0 warnings + prettier ok",
        "▸ check-build-args: NEXT_PUBLIC_* × Dockerfile ......... ok",
        "✔ merge em main — integrar ≠ publicar; deploy só nasce de tag",
      ],
    },
    {
      kind: "terminal",
      id: "pipeline",
      title: "Deploy blue/green — 0s de downtime",
      intro:
        "Publicar é um ato explícito: push de tag. A imagem builda no runner do GitHub (2m03s — nunca no servidor) e a troca de cor acontece sem derrubar uma request; downtime medido caiu de ~5min para 0s.",
      lines: [
        "$ git tag v2.16.0 && git push --tags",
        "▸ build: docker multi-stage → ghcr (cache gha) ......... ok",
        "▸ rsync: só artefatos de deploy — código não vai ao servidor",
        "▸ warm-up green: migrate retrocompatível + caches ...... ok",
        "▸ health local: /health em loop (até 30×, 2s) .......... ok",
        "▸ nginx: cutover graceful do upstream → green .......... ok",
        "▸ drain blue: 30s de keep-alive → stop ................. ok",
        "▸ health público: 200 medido do lado de fora (5×) ...... ok",
        "✔ v2.16.0 em produção — downtime: 0s · rollback = mesma esteira, tag antiga",
      ],
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observabilidade",
      paragraphs: [
        "OpenTelemetry com tail sampling (100% dos erros + 100% das requisições lentas + 10% do restante) exporta traces, métricas e logs via Grafana Alloy — configurado como código — para o Grafana Cloud. Cada trace carrega service_version com o SHA do deploy: uma regressão aponta direto para a release que a introduziu.",
        "8 canais de log por domínio (redirect, tracking, jobs, auth, http, audit...) com redação automática de PII e request_id propagado do navegador ao worker de fila. Faro RUM no frontend espelha o mesmo SHA de build; profiling contínuo com Pyroscope/Excimer identifica hot paths no PHP. 4 dashboards e 9 alert rules versionados como JSON no repositório — nada configurado à mão na UI.",
        "Um uptime probe externo roda a cada 5 minutos fora da minha infra e abre sozinho uma issue de incidente deduplicada quando o serviço cai — a rede de segurança para o outage total que os alertas internos, por definição, não veriam.",
      ],
    },
    {
      kind: "dashboard",
      id: "operations",
      title: "Operação em números",
      intro:
        "O retrato que o Grafana e o GitHub Actions medem de verdade: agregados do histórico real de execuções e do monitoramento como código — nenhum número de vitrine.",
      asOf: "dados de ago/2026 · fonte: histórico de execuções + config versionada",
      okLabel: "tudo verde",
      stats: [
        {
          label: "uptime probe (5 em 5 min)",
          value: "99,0%",
          sub: "820 execuções, 8 falhas — abre issue de incidente sozinho",
        },
        {
          label: "amostras de deploy",
          value: "1.035/1.035",
          sub: "HTTP 200 medidos de fora durante releases blue/green",
        },
        {
          label: "alert rules como código",
          value: "9",
          sub: "versionadas em JSON no repositório, zero config na UI",
        },
        {
          label: "dashboards Grafana",
          value: "4",
          sub: "visão geral · app (RED) · infra · observability",
        },
      ],
      columns: { workflow: "workflow", runs: "execuções", failures: "falhas", success: "sucesso" },
      rows: [
        { label: "ci (backend)", runs: 124, failures: 6 },
        { label: "ci (frontend)", runs: 63, failures: 1 },
        { label: "release (backend)", runs: 24, failures: 0 },
        { label: "release (frontend)", runs: 28, failures: 1 },
        { label: "uptime", runs: 820, failures: 8 },
      ],
    },
    {
      kind: "stats",
      id: "quality",
      title: "Qualidade",
      items: [
        { label: "Testes PHPUnit", value: "902 métodos em 133 arquivos (36 unit, 97 feature)" },
        {
          label: "Matriz de banco no CI",
          value: "a suíte roda 2× por push: SQLite e PostgreSQL 15 real",
        },
        {
          label: "Migrations",
          value: "56, zero destrutivas — MigrationSafetyTest reprova dropColumn no up()",
        },
        { label: "Análise estática", value: "PHPStan/Larastan nível 5 com baseline" },
        { label: "E2E", value: "Playwright, 6 projects (320/375/desktop × público/autenticado)" },
        {
          label: "Abuso e resiliência",
          value: "16 rate limiters nomeados + testes de IP spoofing e retry de fila",
        },
      ],
    },
    {
      kind: "prose",
      id: "postmortems",
      title: "Postmortems",
      paragraphs: [
        "13/07/2026: 918 respostas HTTP 502 durante um deploy do modelo antigo (merge publicava, build no próprio servidor) — incluindo um visitante real vindo do Facebook. Foi o gatilho para reescrever o release como blue/green por tag: warm-up da cor nova, health check em loop, cutover gracioso no nginx, drenagem da cor antiga e abort automático em falha.",
        "Um build-arg ausente no Dockerfile compilou as conversões do Google Ads como string vazia — campanhas rodaram semanas gastando dinheiro real sem registrar uma conversão, invisível em dev porque o build local lê o .env normalmente. A resposta virou gate: check-build-args.sh compara todo NEXT_PUBLIC_* referenciado no código com os ARG do Dockerfile e bloqueia o CI se faltar algum.",
        "O IP de cliente era forjável nos logs e nos rate limiters; corrigi com o real-ip do Cloudflare e um teste automatizado (ClientIpSpoofingTest) que garante que a falha não volta despercebida.",
        "A melhor evidência de que o blue/green funciona veio de um deploy que falhou: o v1.0.0 do frontend quebrou no meio da esteira (bug de rsync) enquanto um medidor externo batia no site a cada 2s — 156 de 156 amostras responderam 200. Um release quebrado não derruba nada; ele simplesmente não acontece.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "Como foi construído: IA com guardrails",
      paragraphs: [
        "Construí o Link Charts com um fluxo de trabalho IA-first guiado por spec: brainstorm → design doc → plano → execução, orquestrando múltiplos agentes e subagentes em execução por fases com relatório de cada etapa.",
        "Contexto como artefato: um arquivo de contexto de arquitetura (22KB) versionado no repositório orienta os agentes; ADRs e postmortems realimentam esse contexto ao longo do tempo; o frontend publica llms.txt para conteúdo legível por LLMs.",
        "Automação com freio humano: um comando próprio (/ship) automatiza commit → PR → CI → merge → deploy → health check, com no máximo 2 tentativas de autocorreção por etapa — se não resolver, para com um aviso explícito e devolve o controle para mim. A regra de migration segura também deixou de ser wiki e virou teste que reprova o CI.",
        "Minha tese: solo dev + IA + gates rigorosos produz output de nível empresa. Os ~1.929 commits solo em 17 meses, em paralelo a um emprego em tempo integral, não vieram às custas da qualidade: os mesmos 902 testes, PHPStan e zero-warnings bloquearam merges o tempo todo. IA amplifica; os guardrails decidem.",
      ],
    },
    {
      kind: "stats",
      id: "stack",
      title: "Stack completa",
      items: [
        {
          label: "Frontend",
          value: "Next.js 15, React 19, TypeScript estrito, MUI 6, TanStack Query 5",
        },
        { label: "Backend", value: "Laravel 12, PHP 8.2, PostgreSQL 15, Redis 7" },
        { label: "Infra", value: "Docker multi-stage, GHCR, nginx, DigitalOcean, Cloudflare" },
        { label: "Observabilidade", value: "OpenTelemetry, Grafana Cloud, Faro RUM, Pyroscope" },
        { label: "CI/CD", value: "GitHub Actions, deploy blue/green por tag" },
        { label: "Qualidade", value: "PHPUnit, PHPStan, ESLint, Playwright" },
      ],
    },
  ],
};
