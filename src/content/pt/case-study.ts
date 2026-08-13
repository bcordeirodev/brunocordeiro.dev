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
        "O Link Charts é um encurtador de URL com analytics que mantenho sozinho em produção desde 2025. Cada clique é enriquecido com dados de geografia, dispositivo, horário e qualidade de tráfego, e alimenta cinco dashboards de análise.",
        "Além do encurtamento, o produto tem redirect com preview Open Graph para os bots do WhatsApp e do Telegram, quality score anti-fraude por clique, subdomínios personalizados com página link-in-bio, API pública, QR codes, relatórios com export CSV e senha, expiração e agendamento de links. A monetização vem de AdSense e Google Ads.",
        "São cerca de 1.929 commits meus em 3 repositórios entre março de 2025 e agosto de 2026, em paralelo a um emprego em tempo integral, com 50 releases sob semver independente por repositório (backend em v2.16.0, frontend em v1.19.0).",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Arquitetura",
      paragraphs: [
        "O backend é Laravel 12 com PostgreSQL 15 e Redis 7, em camadas Controller, Service e Repository com injeção de dependência. A rota crítica /r/{slug} responde HTML com Open Graph para bots e um 302 para humanos; o tracking roda depois, num job assíncrono idempotente em que uma coluna dedup_key com índice único garante que retry não duplica clique.",
        "O frontend é Next.js 15 com React 19 e TypeScript estrito, TanStack Query, ISR com cache tags, i18n em dois idiomas, Auth0 e CSP/HSTS em middleware. Os gráficos usam ApexCharts e os mapas, Leaflet.",
        "A integração passa por proxy de rewrites, sem CORS, com JWT em cookie httpOnly e X-Request-Id propagado do navegador até o worker de fila para correlacionar logs de ponta a ponta.",
      ],
      architecture: {
        caption: "O caminho de uma request, do navegador até o worker de fila.",
        bands: { clients: "clientes", edge: "borda", app: "aplicação", data: "dados" },
        clients: {
          browser: { title: "Navegador", sub: "dashboards · link-in-bio" },
          bots: { title: "Bots", sub: "WhatsApp · Telegram" },
        },
        edge: {
          cdn: { title: "Cloudflare", sub: "TLS · CDN · real-ip do cliente" },
          proxy: { title: "nginx", sub: "upstream blue/green · cutover sem downtime" },
        },
        web: {
          title: "Next.js 15 · React 19",
          lines: [
            "App Router · TypeScript estrito",
            "ISR com cache tags · TanStack Query",
            "Auth0 · CSP/HSTS no middleware",
            "ApexCharts · Leaflet",
          ],
        },
        api: {
          title: "Laravel 12 · PHP 8.2",
          lines: ["Controller → Service → Repository", "injeção de dependência · API keys"],
        },
        host: "DigitalOcean · um droplet",
        link: { top: "proxy por rewrites", bottom: "JWT httpOnly · sem CORS" },
        hotPath: {
          route: "/r/{slug}",
          sub: "responde antes de rastrear",
          human: "302 · humano",
          bot: "HTML + OG · bot",
        },
        data: {
          db: { title: "PostgreSQL 15", sub: "links · cliques · agregações" },
          cache: { title: "Redis 7", sub: "cache · fila de jobs" },
          worker: { title: "Worker de cliques", sub: "dedup_key com índice único" },
          writeback: "grava o clique — retry não duplica",
        },
        trace: "X-Request-Id — propagado do navegador até o worker de fila",
        legend: { sync: "síncrono", async: "assíncrono, depois da resposta" },
        scrollHint: "arraste na horizontal para ver o diagrama inteiro",
      },
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
      deploy: {
        caption: "A esteira de release e a troca de cor atrás do nginx.",
        bands: { pipeline: "esteira", cutover: "cutover", check: "verificação" },
        steps: [
          { title: "tag", sub: "git push --tags" },
          { title: "build", sub: "runner GitHub · 2m03s" },
          { title: "ghcr", sub: "imagem + cache gha" },
          { title: "rsync", sub: "só artefatos, não o código" },
        ],
        proxy: { title: "nginx", sub: "cutover graceful do upstream" },
        blue: {
          title: "blue · versão anterior",
          lines: ["deixa de receber requisições novas", "termina as que já estavam em voo"],
          edge: "drain 30s → stop",
        },
        green: {
          title: "green · versão nova",
          lines: [
            "warm-up: migrate retrocompatível + caches",
            "/health em loop, até 30× a cada 2s",
          ],
          edge: "falhou? aborta e blue segue no ar",
        },
        verdict: "1.035/1.035 amostras com HTTP 200 durante o cutover — downtime medido: 0s",
        rollback: "rollback é a mesma esteira, com a tag anterior — nada de caminho de emergência",
        legend: { live: "no ar", draining: "drenando" },
        scrollHint: "arraste na horizontal para ver o diagrama inteiro",
      },
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observabilidade",
      paragraphs: [
        "O OpenTelemetry exporta traces, métricas e logs para o Grafana Cloud via Grafana Alloy, com tail sampling que guarda 100% dos erros e das requisições lentas. Cada trace carrega o SHA do deploy, então uma regressão aponta direto para a release que a introduziu.",
        "Os logs saem em 8 canais por domínio, com redação automática de PII. Faro RUM cobre o frontend e o Pyroscope faz profiling contínuo do PHP. Os 4 dashboards e as 9 alert rules vivem como JSON no repositório; nada é configurado à mão na UI.",
        "Fora da infra, um probe roda a cada 5 minutos e abre sozinho uma issue de incidente se o serviço cair — a rede de segurança para o outage que os alertas internos não veriam.",
      ],
    },
    {
      kind: "grafana",
      id: "operations",
      title: "Operação em números — direto do Grafana",
      intro:
        "Os painéis abaixo consomem a API Prometheus do meu workspace no Grafana Cloud, o mesmo que monitora o Link Charts em produção. Quando a API não responde, o painel degrada para um snapshot versionado e indica isso no badge. O uptime vem do probe externo no GitHub Actions.",
      board: {
        title: "Grafana · linkcharts · produção",
        timeRange: "Últimos 30 dias",
        attribution: "dados via Grafana Cloud · Prometheus",
        snapshotLabel: "snapshot",
        liveLabel: "live · Prometheus",
        updatedLabel: "atualizado",
        footer:
          "1.035/1.035 amostras de deploy com HTTP 200 · 9 alert rules e 4 dashboards versionados como JSON no repositório — zero config na UI",
      },
      panels: {
        uptime: {
          title: "uptime 30d",
          sub: "probe externo a cada 5 min — abre issue de incidente sozinho",
          source: "GitHub Actions",
        },
        p95: {
          title: "p95 · redirect",
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
          source: "git log",
        },
      },
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
        "Em julho de 2026, um deploy do modelo antigo, com build no próprio servidor, devolveu 918 respostas HTTP 502 — uma delas para um visitante real. Foi o gatilho para reescrever o release como blue/green por tag, com warm-up, health check em loop e abort automático em falha.",
        "Um build-arg ausente no Dockerfile compilou as conversões do Google Ads como string vazia, e campanhas rodaram semanas sem registrar conversão. A correção virou gate de CI: um script compara os NEXT_PUBLIC_* usados no código com os ARG do Dockerfile e bloqueia o build se faltar algum.",
        "O IP do cliente era forjável nos logs e nos rate limiters. Corrigi com o real-ip do Cloudflare e deixei um teste automatizado para a falha não voltar despercebida.",
        "A melhor evidência do blue/green veio de um deploy que quebrou no meio da esteira enquanto um medidor externo batia no site a cada 2 segundos: 156 de 156 amostras responderam 200. Release quebrado não derruba o site; ele só não acontece.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "Como foi construído: IA com guardrails",
      paragraphs: [
        "Construí o Link Charts num fluxo guiado por spec — brainstorm, design doc, plano, execução — usando agentes de IA para escrever a maior parte do código. Um arquivo de contexto de arquitetura versionado no repositório orienta os agentes, e ADRs e postmortems realimentam esse contexto ao longo do tempo.",
        "A automação tem freio: o comando /ship leva do commit ao deploy com no máximo duas tentativas de autocorreção por etapa; se não resolver, para e devolve o controle para mim. Regras importantes viram teste de CI em vez de página de wiki.",
        "O resultado são cerca de 1.929 commits solo em 17 meses sem abrir mão de qualidade: os mesmos 902 testes, PHPStan e zero warnings bloquearam merges o tempo todo.",
      ],
    },
    {
      kind: "tags",
      id: "stack",
      title: "Stack completa",
      groups: [
        {
          label: "Frontend",
          items: [
            "Next.js 15 (App Router)",
            "React 19",
            "TypeScript estrito",
            "MUI 6",
            "TanStack Query 5",
            "ApexCharts",
            "Leaflet",
            "Auth0",
          ],
        },
        {
          label: "Backend",
          items: [
            "Laravel 12",
            "PHP 8.2",
            "PostgreSQL 15",
            "Redis 7",
            "filas assíncronas",
            "API pública com API keys",
          ],
        },
        {
          label: "Infra",
          items: ["Docker multi-stage", "GHCR", "nginx", "DigitalOcean", "Cloudflare"],
        },
        {
          label: "Observabilidade",
          items: [
            "OpenTelemetry",
            "Grafana Cloud",
            "Grafana Alloy",
            "Faro RUM",
            "Pyroscope",
            "alertas como código",
          ],
        },
        {
          label: "CI/CD",
          items: ["GitHub Actions", "deploy blue/green por tag", "rollback pela mesma esteira"],
        },
        {
          label: "Qualidade",
          items: [
            "PHPUnit (902 testes)",
            "PHPStan nível 5",
            "Laravel Pint",
            "ESLint 0 warnings",
            "Playwright (6 projects)",
          ],
        },
      ],
    },
  ],
};
