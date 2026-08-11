import type { CaseStudy } from "@/domain";

export const caseStudy: CaseStudy = {
  slug: "link-charts",
  title: "Link Charts — engenharia de ponta a ponta em produção",
  tagline: "Um encurtador de URL com analytics avançado, 100% autoral, em produção desde 2025",
  productUrl: "https://linkcharts.com.br",
  chapters: [
    {
      kind: "prose",
      id: "product",
      title: "O produto",
      paragraphs: [
        "Link Charts (linkcharts.com.br) é um encurtador de URL com analytics avançado, em produção, que criei e mantenho 100% sozinho. Cada clique é enriquecido com dados geográficos, de dispositivo, temporais e de qualidade de tráfego, exibidos em 5 dashboards: geral, geográfico (mapa coroplético/heatmap), temporal, audiência e insights.",
        "Em produção: encurtamento autenticado e público, redirect de alta performance com preview Open Graph para bots (WhatsApp/Telegram), anti-fraude com quality score por clique, subdomínios personalizados + página link-in-bio, API pública com API keys, QR codes, tags, relatórios, export CSV, UTM builder, senha em link, expiração/agendamento/click limit, health check de links, e-mails de retenção e monetização via AdSense + Google Ads.",
        "~1.929 commits em 3 repositórios (backend, frontend, docs), 100% autorais, de mar/2025 a ago/2026 — atividade contínua, mantida em paralelo a um emprego em tempo integral. 50 tags de release com versionamento semver independente por repositório.",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Arquitetura",
      paragraphs: [
        "Backend: Laravel 12 / PHP 8.2, PostgreSQL 15, Redis 7. Camadas Controller → Service → Repository com injeção de dependência por interface, DTOs e ADRs. A rota crítica /r/{slug} serve HTML com Open Graph para bots e um redirect 302 para humanos; o tracking é 100% assíncrono via job idempotente (dedup_key UNIQUE); cache de link de 10 min; enriquecimento do clique em 3 fases (headers → inteligência server-side com viral rank/feriados → quality score anti-fraude).",
        "Frontend: Next.js 15 (App Router) / React 19 / TypeScript estrito, MUI 6 com design system próprio, TanStack Query 5, ISR com cache tags e revalidação sob demanda, i18n en/pt-BR, Auth0, CSP/HSTS em middleware, SEO completo (JSON-LD, sitemap, llms.txt), 30 componentes de gráfico ApexCharts e mapas Leaflet.",
        "Integração: proxy por rewrites (zero CORS), JWT em cookie httpOnly (nunca localStorage), X-Request-Id propagado do frontend ao worker de fila para correlação de logs ponta a ponta.",
      ],
    },
    {
      kind: "terminal",
      id: "pipeline",
      title: "Deploy blue/green — 0s de downtime",
      intro: "Cada release por tag executa este fluxo; downtime medido caiu de ~5min para 0s.",
      lines: [
        "$ git tag v1.50.0 && git push --tags",
        "▸ ci: 902 tests (sqlite + postgres 15) ......... ok",
        "▸ build: docker multi-stage → ghcr.io .......... ok",
        "▸ deploy: warm-up green ........................ ok",
        "▸ health-check: 200 em loop (12/12) ............ ok",
        "▸ nginx: cutover graceful → green .............. ok",
        "▸ drain blue (30s) → stop ...................... ok",
        "✔ release v1.50.0 em produção — downtime: 0s",
      ],
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observabilidade",
      paragraphs: [
        "OpenTelemetry (SDK 1.14, auto-instrumentação de Laravel/PDO/Guzzle, tail sampling: 100% dos erros + 100% das requisições lentas + 10% do restante) exporta traces, métricas e logs via Grafana Alloy para o Grafana Cloud.",
        "Faro RUM no frontend captura performance real de usuário; profiling contínuo com Pyroscope/Excimer identifica hot paths no backend. 4 dashboards e 9 alert rules versionados como código — não configurados manualmente na UI.",
        "Um uptime probe externo roda a cada 5 minutos e abre automaticamente uma issue de incidente quando o serviço cai — a operação começa antes de eu perceber o problema.",
      ],
    },
    {
      kind: "stats",
      id: "quality",
      title: "Qualidade",
      items: [
        { label: "Testes PHPUnit", value: "~902 (unit, feature, snapshot, characterization)" },
        { label: "Matriz de banco no CI", value: "SQLite em memória e PostgreSQL 15 real" },
        { label: "Análise estática", value: "PHPStan/Larastan nível 5 com baseline" },
        { label: "E2E", value: "Playwright multi-viewport (320/375/desktop, 6 projects)" },
        { label: "Lint frontend", value: "ESLint 9 flat config, --max-warnings=0 no gate" },
        { label: "Testes de segurança", value: "IP spoofing, rate limit, retry de fila" },
      ],
    },
    {
      kind: "prose",
      id: "postmortems",
      title: "Postmortems",
      paragraphs: [
        "918 respostas HTTP 502 durante deploys motivaram a reescrita do processo de release como blue/green zero-downtime — warm-up da cor nova, health check em loop, cutover gracioso no nginx, drenagem de 30s da cor antiga e abort automático em caso de falha.",
        "Um bug de --build-arg zerou silenciosamente as conversões de Google Ads em produção; o postmortem gerou um guard automatizado no CI (check-build-args.sh) que bloqueia releases com build args ausentes.",
        "O IP de cliente era forjável nos logs e nos rate limiters; a correção usa o cabeçalho real-ip do Cloudflare, com teste automatizado (ClientIpSpoofingTest) que garante que a falha não volte a passar despercebida.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "Como foi construído: IA com guardrails",
      paragraphs: [
        "O Link Charts foi construído com um fluxo de trabalho IA-first guiado por spec: brainstorm → design doc → plano → execução, com orquestração de múltiplos agentes e subagentes e execução por fases com relatórios de cada etapa.",
        "Contexto como artefato: um CLAUDE.md de 22KB versionado no repositório documenta a arquitetura para os agentes; ADRs e postmortems alimentam esse contexto ao longo do tempo; o frontend expõe llms.txt para conteúdo legível por LLMs.",
        "A tese: solo dev + IA + gates rigorosos produz output de nível empresa. A velocidade de ~1.929 commits solo em 17 meses — mantida em paralelo a um emprego em tempo integral — não veio às custas da qualidade: os mesmos ~902 testes, PHPStan e checks de zero-warnings continuaram bloqueando merges o tempo todo. IA amplifica; os guardrails garantem.",
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
