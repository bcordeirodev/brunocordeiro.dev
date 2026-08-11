import type { SkillCategory } from "@/domain";

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Linguagens & Fundamentos",
    skills: [
      {
        name: "TypeScript",
        evidence: "production",
        proof:
          "Modo strict + noUncheckedIndexedAccess em ~570 arquivos no Link Charts; TS de ponta a ponta desde 2020",
        highlight: true,
      },
      {
        name: "JavaScript (ES6+)",
        evidence: "production",
        proof: "Desde 2016 — promises, async/await, closures",
        highlight: false,
      },
      {
        name: "PHP 5.6 → 8.2",
        evidence: "production",
        proof: "10 anos acompanhando a evolução da linguagem; Laravel 12 em produção",
        highlight: false,
      },
      {
        name: "SQL multi-dialeto",
        evidence: "production",
        proof: "PostgreSQL, MySQL, Oracle, SQLite — camada própria de dialetos no Link Charts",
        highlight: false,
      },
      {
        name: "Bash",
        evidence: "production",
        proof: "Scripts de deploy blue/green (176 linhas) e operação",
        highlight: false,
      },
      {
        name: "HTML semântico",
        evidence: "production",
        proof: "Markup semântico em produção no Link Charts e nos sites de clientes",
        highlight: false,
      },
      {
        name: "CSS moderno",
        evidence: "production",
        proof: "SASS/SCSS, LESS, Tailwind, CSS-in-JS (Emotion, Styled Components) em produção",
        highlight: false,
      },
      {
        name: "Swift",
        evidence: "academic",
        proof:
          "Pós-graduação em Dispositivos Móveis (IESB) — exibido apenas como formação, não como produção",
        highlight: false,
      },
    ],
  },
  {
    id: "architecture",
    title: "Arquitetura & Padrões",
    skills: [
      {
        name: "Modos de renderização (CSR, SSR, SSG, ISR, PPR)",
        evidence: "production",
        proof:
          "Aplicados em sistemas corporativos (G4F: rotas SPA, SSG e SSR) e no Link Charts (ISR 300s + revalidateTag)",
        highlight: false,
      },
      {
        name: "REST/RESTful",
        evidence: "production",
        proof:
          "APIs versionadas (/api/v1), semântica HTTP correta, OpenAPI/Swagger (Scramble no Link Charts; Swagger na Basis)",
        highlight: false,
      },
      {
        name: "DTOs e contratos de dados",
        evidence: "production",
        proof:
          "DTOs no back (Laravel e NestJS), API Resources, validação em camadas (Zod no front, FormRequests no back)",
        highlight: false,
      },
      {
        name: "ORMs — 6 em 3 runtimes",
        evidence: "production",
        proof:
          "Eloquent, TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — a categoria como conceito, não uma lib decorada",
        highlight: false,
      },
      {
        name: "POO, SOLID, PSRs, MVC, arquitetura em camadas",
        evidence: "production",
        proof:
          "Controller → Service → Repository, injeção de dependência por interface, Design Patterns nomeados: Singleton, Strategy, Registry, Observer, Orchestrator, Repository",
        highlight: false,
      },
      {
        name: "Caching e padrões assíncronos",
        evidence: "production",
        proof:
          "Redis, ISR/cache tags, HTTP; idempotência (dedup_key + insertOrIgnore); filas, middlewares, webhooks assinados (hash_equals); fluxos de auth (JWT httpOnly, ACL, OAuth/Auth0, Sanctum); i18n como arquitetura",
        highlight: false,
      },
      {
        name: "Segurança de aplicações — OWASP Top 10 na prática",
        evidence: "production",
        proof:
          "JWT em cookie httpOnly (XSS), comparação hash_equals (timing attack), 16 rate limiters (brute force/DoS), proteção contra IP spoofing (Cloudflare real-ip + teste automatizado), validação em camadas, secrets fora do código, PII redaction em logs, anti-fraude com quality score, Google Safe Browsing, LGPD aplicada",
        highlight: true,
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      {
        name: "Next.js 15",
        evidence: "production",
        proof:
          "App Router, Server Components, ISR + cache tags, middleware, route handlers, Turbopack — produção no Link Charts",
        highlight: true,
      },
      {
        name: "React 19",
        evidence: "production",
        proof: "Base de todo o frontend do Link Charts, com Server Components",
        highlight: true,
      },
      {
        name: "TypeScript estrito (noUncheckedIndexedAccess)",
        evidence: "production",
        proof: "Modo strict com noUncheckedIndexedAccess ativo em produção no Link Charts",
        highlight: false,
      },
      {
        name: "Arquitetura feature-based em escala",
        evidence: "production",
        proof: "10 features em produção no Link Charts",
        highlight: false,
      },
      {
        name: "MUI 6 + Emotion",
        evidence: "production",
        proof: "SSR, temas claro/escuro, design system próprio",
        highlight: false,
      },
      {
        name: "TanStack Query v5 (React Query)",
        evidence: "production",
        proof: "36 call sites, query keys centralizadas no Link Charts",
        highlight: true,
      },
      {
        name: "react-hook-form + Zod",
        evidence: "production",
        proof: "Validação de formulários em camadas no frontend do Link Charts",
        highlight: false,
      },
      {
        name: "Data viz (ApexCharts, Leaflet, material-react-table)",
        evidence: "production",
        proof:
          "30 componentes de gráfico ApexCharts, mapas coroplético/heatmap com Leaflet, tabelas com material-react-table",
        highlight: false,
      },
      {
        name: "i18n (i18next)",
        evidence: "production",
        proof: "13 namespaces em produção no Link Charts",
        highlight: false,
      },
      {
        name: "SEO técnico",
        evidence: "production",
        proof: "Metadata API, JSON-LD, sitemap/robots programáticos, llms.txt",
        highlight: false,
      },
      {
        name: "Performance frontend",
        evidence: "production",
        proof: "next/font, optimizePackageImports, dynamic imports",
        highlight: false,
      },
      {
        name: "Acessibilidade",
        evidence: "production",
        proof: "312 usos de aria-*, prefers-reduced-motion, layout validado a 320px",
        highlight: false,
      },
      {
        name: "Next.js 13/14 e React 17/18 (corporativo)",
        evidence: "professional",
        proof: "Sistemas corporativos SPA/SSG/SSR na G4F",
        highlight: false,
      },
      {
        name: "Redux · Context API",
        evidence: "professional",
        proof: "Gerenciamento de estado em projetos corporativos (G4F, Basis)",
        highlight: false,
      },
      { name: "React Query e SWR", evidence: "professional", proof: "G4F", highlight: false },
      {
        name: "Styled Components · SASS/SCSS",
        evidence: "professional",
        proof: "G4F, Basis",
        highlight: false,
      },
      {
        name: "MSW",
        evidence: "professional",
        proof: "Mock de API em testes corporativos (G4F, VegaIT)",
        highlight: false,
      },
      { name: "i18n (corporativo)", evidence: "professional", proof: "G4F", highlight: false },
      {
        name: "Webpack · jQuery",
        evidence: "professional",
        proof: "Legado corporativo",
        highlight: false,
      },
      {
        name: "Tailwind CSS",
        evidence: "project",
        proof: "lawyer-hero-envato, rent-landingpage",
        highlight: false,
      },
      { name: "Framer Motion", evidence: "project", proof: "lawyer-hero-envato", highlight: false },
      { name: "CVA", evidence: "project", proof: "lawyer-hero-envato", highlight: false },
      { name: "Atomic Design", evidence: "project", proof: "rent-landingpage", highlight: false },
      {
        name: "Vue.js · Bootstrap · LESS (legado)",
        evidence: "professional",
        proof: "Partido Republicano da Ordem Social, Transoft",
        highlight: false,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      {
        name: "PHP 8.2 + Laravel 12",
        evidence: "production",
        proof: "Em produção no Link Charts desde 2025",
        highlight: true,
      },
      {
        name: "Arquitetura em camadas (Controller → Service → Repository)",
        evidence: "production",
        proof:
          "DI por interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs — 145 arquivos PHP, ~28k linhas no Link Charts",
        highlight: false,
      },
      {
        name: "API REST versionada + OpenAPI (Scramble)",
        evidence: "production",
        proof: "Rotas /api/v1 documentadas automaticamente no Link Charts",
        highlight: false,
      },
      {
        name: "Autenticação multi-mecanismo",
        evidence: "production",
        proof: "JWT httpOnly, Sanctum, Auth0 token exchange",
        highlight: false,
      },
      {
        name: "Rate limiting dimensionado por ameaça",
        evidence: "production",
        proof: "16 rate limiters nomeados",
        highlight: false,
      },
      {
        name: "Filas e jobs idempotentes",
        evidence: "production",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        highlight: false,
      },
      {
        name: "Scheduler",
        evidence: "production",
        proof: "5 tarefas com withoutOverlapping",
        highlight: false,
      },
      {
        name: "Logging estruturado com PII redaction",
        evidence: "production",
        proof: "8 canais, request_id propagado aos workers",
        highlight: false,
      },
      {
        name: "Integrações (Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi)",
        evidence: "production",
        proof: "Serviços de terceiros integrados no backend do Link Charts",
        highlight: false,
      },
      {
        name: "LGPD aplicada",
        evidence: "production",
        proof: "Anonimização de IPs, exclusão de conta, unsubscribe assinado",
        highlight: false,
      },
      {
        name: "NestJS + TypeORM + Passport/JWT",
        evidence: "project",
        proof: "Projeto autoral medFlow; também usado em contexto corporativo na G4F",
        highlight: false,
      },
      {
        name: "Express · AdonisJS (Lucid)",
        evidence: "professional",
        proof: "G4F",
        highlight: false,
      },
      { name: "Prisma ORM", evidence: "professional", proof: "G4F", highlight: false },
      { name: "Deno (OAK, DenoDB)", evidence: "professional", proof: "G4F", highlight: false },
      {
        name: "Laravel 8.1",
        evidence: "professional",
        proof: "Basis Tecnologia",
        highlight: false,
      },
      {
        name: "PHP 5.6–7.4 (Eloquent, Propel, Swagger, PSRs)",
        evidence: "professional",
        proof:
          "PHP profissional desde 2016 — Basis, Partido Republicano da Ordem Social, Transoft, Plug Digital",
        highlight: false,
      },
      {
        name: "JSNSD — OpenJS Node.js Services Developer",
        evidence: "certified",
        proof: "The Linux Foundation, fev/2025",
        highlight: false,
      },
    ],
  },
  {
    id: "devops",
    title: "CI/CD & Servidor",
    skills: [
      {
        name: "GitHub Actions",
        evidence: "production",
        proof: "CI ≠ Release, deploy por tag, rollback via workflow_dispatch, concurrency groups",
        highlight: false,
      },
      {
        name: "Registry GHCR",
        evidence: "production",
        proof: "Imagens imutáveis, retenção para rollback",
        highlight: false,
      },
      {
        name: "Deploy blue/green zero-downtime",
        evidence: "production",
        proof:
          "Downtime medido: ~5min → 0s; scripts bash próprios (176 linhas): warm-up, health check, cutover nginx graceful, drenagem, abort",
        highlight: true,
      },
      {
        name: "Docker avançado",
        evidence: "production",
        proof: "Multi-stage, Alpine + extensões compiladas, 3 stacks compose por ciclo de vida",
        highlight: true,
      },
      {
        name: "Supervisor",
        evidence: "production",
        proof: "Process manager de workers no Link Charts",
        highlight: false,
      },
      {
        name: "VPS Linux (DigitalOcean)",
        evidence: "production",
        proof: "nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        highlight: false,
      },
      {
        name: "Migrations expand/contract",
        evidence: "production",
        proof: "Guard automatizado (MigrationSafetyTest) no CI",
        highlight: false,
      },
      {
        name: "OpenTelemetry",
        evidence: "production",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules versionados, uptime probe que abre issue",
        highlight: true,
      },
      {
        name: "Engenharia guiada por postmortem",
        evidence: "production",
        proof:
          "918 respostas 502 → blue/green; bug de --build-arg → guard no CI; IP forjável → Cloudflare real-ip",
        highlight: false,
      },
      {
        name: "Jenkins · Bamboo · GitLab CI · SonarQube · Rancher · Harbor · Apache · Ubuntu",
        evidence: "professional",
        proof: "G4F e Basis",
        highlight: false,
      },
      {
        name: "Bitbucket (incl. Pipelines)",
        evidence: "declared",
        proof: "Declarada, sem evidência de código coletada",
        highlight: false,
      },
      { name: "Azure DevOps", evidence: "professional", proof: "VegaIT", highlight: false },
    ],
  },
  {
    id: "quality",
    title: "Qualidade & Testes",
    skills: [
      {
        name: "PHPUnit 11 em escala",
        evidence: "production",
        proof: "~902 testes: unit, feature, snapshot, characterization",
        highlight: false,
      },
      {
        name: "Matriz de banco no CI",
        evidence: "production",
        proof: "Suíte inteira em SQLite E contra PostgreSQL 15 real",
        highlight: false,
      },
      {
        name: "PHPStan/Larastan nível 5",
        evidence: "production",
        proof: "Com baseline versionado",
        highlight: false,
      },
      {
        name: "Playwright E2E multi-viewport",
        evidence: "production",
        proof: "320/375/desktop, 6 projects, storage state autenticado",
        highlight: false,
      },
      {
        name: "Testes de segurança",
        evidence: "production",
        proof: "IP spoofing, rate limit, retry de fila",
        highlight: false,
      },
      {
        name: "ESLint",
        evidence: "production",
        proof:
          "v9 flat config, --max-warnings=0 no gate; uso profissional desde ~2019 nas empresas",
        highlight: false,
      },
      {
        name: "Prettier",
        evidence: "production",
        proof: "Formatação automatizada no gate de CI",
        highlight: false,
      },
      {
        name: "Laravel Pint",
        evidence: "production",
        proof: "Formatação PHP no Link Charts",
        highlight: false,
      },
      {
        name: "Husky/commitlint/commitizen",
        evidence: "production",
        proof: "Git hooks versionados no repositório",
        highlight: false,
      },
      {
        name: "Git hooks versionados",
        evidence: "production",
        proof: "Pre-push roda a suíte no Docker",
        highlight: false,
      },
      {
        name: "Conventional Commits",
        evidence: "production",
        proof: "Histórico git dos repositórios Link Charts",
        highlight: false,
      },
      {
        name: "ADRs (MADR)",
        evidence: "production",
        proof: "Decisões de arquitetura documentadas em docs/adr/",
        highlight: false,
      },
      {
        name: "Mermaid",
        evidence: "production",
        proof: "Diagramas versionados na documentação",
        highlight: false,
      },
      {
        name: "Jest · Testing Library · MSW",
        evidence: "professional",
        proof: "G4F, Basis; também no projeto autoral hotel",
        highlight: false,
      },
      {
        name: "Cultura de padrões/mentoria",
        evidence: "academic",
        proof:
          "Guia autoral de 22 regras (coverage 80%, commitlint, rebase-only) — README do repo hotel",
        highlight: false,
      },
    ],
  },
  {
    id: "databases",
    title: "Bancos de dados",
    skills: [
      {
        name: "PostgreSQL 15",
        evidence: "production",
        proof: "56 migrations, índices de performance, backfill, UNIQUE para idempotência",
        highlight: true,
      },
      {
        name: "Redis 7",
        evidence: "production",
        proof: "Cache, filas, sliding-window para viral rank",
        highlight: false,
      },
      {
        name: "Eloquent",
        evidence: "production",
        proof: "Observers, factories, seeders no Link Charts",
        highlight: false,
      },
      {
        name: "SQL multi-dialeto",
        evidence: "production",
        proof: "Camada própria de dialetos (SqlDateExpr) para SQLite e PostgreSQL",
        highlight: false,
      },
      {
        name: "Oracle",
        evidence: "professional",
        proof: "Basis Tecnologia, Transoft",
        highlight: false,
      },
      {
        name: "MySQL",
        evidence: "professional",
        proof: "Partido Republicano da Ordem Social",
        highlight: false,
      },
    ],
  },
  {
    id: "ai",
    title: "Engenharia com IA",
    skills: [
      {
        name: "Fluxo de trabalho IA-first com guardrails de engenharia",
        evidence: "production",
        proof:
          "Desenvolvimento guiado por spec (brainstorm → design doc → plano → execução), orquestração de múltiplos agentes e subagentes, execução por fases com relatórios — comprovado pela velocidade do Link Charts (~1.929 commits solo em 17 meses, com emprego em tempo integral) sem abrir mão dos gates (902 testes, PHPStan, E2E, zero-warnings)",
        highlight: false,
      },
      {
        name: "Contexto como artefato",
        evidence: "production",
        proof:
          "CLAUDE.md de 22KB versionado no repo (onboarding para agentes), ADRs e postmortems que alimentam o contexto, llms.txt no frontend",
        highlight: false,
      },
      {
        name: "Ecossistema de tooling de agentes",
        evidence: "production",
        proof:
          "MCP servers configurados (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees para execução isolada de agentes",
        highlight: false,
      },
    ],
  },
  {
    id: "tools",
    title: "Ferramentas & Metodologias",
    skills: [
      {
        name: "Auth0 full-stack",
        evidence: "production",
        proof: "Fluxo completo front+back no Link Charts",
        highlight: false,
      },
      {
        name: "Monetização web",
        evidence: "production",
        proof: "AdSense Consent Mode v2, Google Ads com tracking de conversão, GA4",
        highlight: false,
      },
      {
        name: "E-mail transacional/lifecycle",
        evidence: "production",
        proof: "Brevo/SendGrid — digest semanal, milestone, winback, onboarding",
        highlight: false,
      },
      {
        name: "PSM I — Professional Scrum Master",
        evidence: "certified",
        proof: "Scrum.org, jan/2024",
        highlight: false,
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        evidence: "professional",
        proof: "G4F, Basis",
        highlight: false,
      },
      {
        name: "Levantamento de requisitos e documentação",
        evidence: "professional",
        proof: "Partido Republicano da Ordem Social",
        highlight: false,
      },
      {
        name: "freeCodeCamp — JavaScript Algorithms and Data Structures",
        evidence: "certified",
        proof: "out/2024",
        highlight: false,
      },
      {
        name: "Swift/UIKit/MVVM",
        evidence: "academic",
        proof: "Pós IESB — exibido só na formação, não como projeto",
        highlight: false,
      },
    ],
  },
];
