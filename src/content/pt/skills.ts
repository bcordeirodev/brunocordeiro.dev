import type { SkillCategory } from "@/domain";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      {
        name: "Next.js 15",
        proof:
          "App Router, Server Components, ISR + cache tags, Turbopack; desde as versões 13/14 com React 17/18",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "React 19",
        proof: "Base de todo o frontend, com Server Components",
        tags: ["Link Charts"],
      },
      {
        name: "TypeScript · JavaScript",
        proof:
          "Strict mode + noUncheckedIndexedAccess em ~570 arquivos; ES6+ desde 2016, TS de ponta a ponta desde 2020",
        tags: ["Link Charts"],
      },
      {
        name: "HTML · CSS",
        proof:
          "Markup semântico e CSS moderno (SASS/SCSS, LESS, Tailwind, CSS-in-JS), também em sites de clientes",
        tags: ["Link Charts"],
      },
      {
        name: "Modos de renderização",
        proof:
          "CSR, SSR, SSG, ISR, PPR — de rotas SPA, SSG e SSR corporativas a ISR 300s + revalidateTag",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Arquitetura feature-based",
        proof: "10 features em produção",
        tags: ["Link Charts"],
      },
      {
        name: "MUI 6 + Emotion",
        proof: "SSR, temas claro/escuro, design system próprio",
        tags: ["Link Charts"],
      },
      {
        name: "TanStack Query · SWR",
        proof:
          "36 call sites e query keys centralizadas na v5 (ex-React Query); SWR em sistema consular de grande porte",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "react-hook-form + Zod",
        proof: "Validação de formulários em camadas no frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Data viz",
        proof:
          "30 componentes de gráfico ApexCharts, mapas coroplético/heatmap com Leaflet, tabelas com material-react-table",
        tags: ["Link Charts"],
      },
      {
        name: "i18n",
        proof: "Biblioteca i18next — 13 namespaces em produção; produto corporativo multi-idioma",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "SEO técnico",
        proof: "Metadata API, JSON-LD, sitemap/robots programáticos, llms.txt",
        tags: ["Link Charts"],
      },
      {
        name: "Performance frontend",
        proof: "next/font, optimizePackageImports, dynamic imports",
        tags: ["Link Charts"],
      },
      {
        name: "Acessibilidade",
        proof: "312 usos de aria-*, prefers-reduced-motion, layout validado a 320px",
        tags: ["Link Charts"],
      },
      {
        name: "Redux · Context API",
        proof: "Gerenciamento de estado em projetos corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Styled Components · SASS/SCSS",
        proof: "CSS-in-JS e SASS em interfaces de sistemas corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Design System gov.br",
        proof: "GOVBR-DS e jsx-a11y em produto público federal multi-idioma",
        tags: ["G4F"],
      },
      {
        name: "Vue.js · Bootstrap · LESS",
        proof:
          "Componentes reativos Vue.js com Bootstrap/LESS em telas de gestão sobre Laravel — SPAs legadas por ~3 anos",
        tags: ["Ordem Social"],
      },
      {
        name: "Tailwind CSS",
        proof: "CSS utility-first com tokens e tema próprio — landing pages responsivas publicadas",
        tags: ["projetos pessoais", "este site"],
      },
      {
        name: "Framer Motion",
        proof: "Animações declarativas de entrada e scroll numa landing page autoral publicada",
        tags: ["projetos pessoais"],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Dados",
    skills: [
      {
        name: "Laravel 12",
        proof: "PHP 8.2, em produção desde 2025",
        tags: ["Link Charts"],
      },
      {
        name: "PHP 5.6 → 8.2",
        proof:
          "10 anos acompanhando a evolução da linguagem — Propel, Swagger e PSRs desde 2016; do Laravel 8 em sistemas internos ao Laravel 12 em produção",
        tags: ["Link Charts", "Basis", "Ordem Social", "Plug Digital"],
      },
      {
        name: "NestJS",
        proof:
          "Microsserviços no setor público com SSO gov.br (OIDC) e Prisma 6; TypeORM e Passport/JWT em projeto autoral",
        tags: ["G4F", "projetos pessoais"],
      },
      {
        name: "Arquitetura em camadas",
        proof:
          "Controller → Service → Repository — DI por interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs; 145 arquivos PHP, ~28k linhas",
        tags: ["Link Charts"],
      },
      {
        name: "REST + OpenAPI",
        proof:
          "Rotas /api/v1 com Scramble e Swagger; semântica HTTP correta e versionamento consistente",
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "ORMs — 6 em 3 runtimes",
        proof:
          "Eloquent (observers, factories, seeders), TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — a categoria como conceito, não uma lib decorada",
        tags: ["Link Charts", "G4F", "Basis", "Ordem Social"],
      },
      {
        name: "Autenticação & SSO",
        proof:
          "JWT httpOnly, Sanctum e Auth0 de ponta a ponta (front+back); Login Único gov.br (SSO/OIDC federal)",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Segurança aplicada (OWASP)",
        proof:
          "JWT httpOnly, hash_equals, 16 rate limiters, anti-spoofing (Cloudflare), anti-fraude; CSP por request, HSTS, DOMPurify e hCaptcha em sistema público de grande porte",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Caching e padrões assíncronos",
        proof:
          "Redis, ISR/cache tags, idempotência (dedup_key), filas, webhooks assinados (hash_equals)",
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "Rate limiting",
        proof: "16 rate limiters nomeados",
        tags: ["Link Charts"],
      },
      {
        name: "Filas e jobs idempotentes",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        tags: ["Link Charts"],
      },
      {
        name: "Scheduler",
        proof: "5 tarefas com withoutOverlapping",
        tags: ["Link Charts"],
      },
      {
        name: "Logging estruturado com PII redaction",
        proof: "8 canais, request_id propagado aos workers",
        tags: ["Link Charts"],
      },
      {
        name: "Integrações de terceiros",
        proof: "Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi integrados no backend",
        tags: ["Link Charts"],
      },
      {
        name: "LGPD aplicada",
        proof: "Anonimização de IPs, exclusão de conta, unsubscribe assinado",
        tags: ["Link Charts"],
      },
      {
        name: "WebSockets",
        proof:
          "@nestjs/websockets + socket.io em sistema consular de grande porte no setor público",
        tags: ["G4F"],
      },
      {
        name: "Microsserviços",
        proof: "Serviço de autenticação separado do core em sistema consular de grande porte",
        tags: ["G4F"],
      },
      {
        name: "Express · AdonisJS",
        proof: "APIs REST com Express e AdonisJS (Lucid ORM) em serviços corporativos",
        tags: ["G4F"],
      },
      {
        name: "Deno",
        proof: "Runtime Deno com OAK para rotas e DenoDB como ORM em serviço corporativo",
        tags: ["G4F"],
      },
      {
        name: "Fundamentos de projeto",
        proof: "POO, SOLID, PSRs, MVC — a base teórica por trás da arquitetura em camadas",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "PostgreSQL 15",
        proof: "56 migrations, índices de performance, backfill, UNIQUE para idempotência",
        tags: ["Link Charts"],
      },
      {
        name: "Redis 7",
        proof: "Cache, filas, sliding-window para viral rank",
        tags: ["Link Charts"],
      },
      {
        name: "SQL multi-dialeto",
        proof: "Camada própria de dialetos (SqlDateExpr) para SQLite e PostgreSQL",
        tags: ["Link Charts"],
      },
      {
        name: "Oracle",
        proof: "PL/SQL e modelagem em bancos corporativos de sistemas internos de grande porte",
        tags: ["Basis", "Transoft"],
      },
      {
        name: "MySQL",
        proof: "Modelagem relacional e queries em sistemas de gestão partidária e jurídica",
        tags: ["Ordem Social"],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Infra",
    skills: [
      {
        name: "Deploy blue/green",
        proof:
          "Downtime medido: ~5min → 0s; scripts bash próprios (176 linhas): warm-up, health check, cutover nginx graceful, drenagem, abort",
        tags: ["Link Charts"],
      },
      {
        name: "Docker",
        proof: "Multi-stage, Alpine + extensões compiladas, 3 stacks compose por ciclo de vida",
        tags: ["Link Charts"],
      },
      {
        name: "GitHub Actions",
        proof: "CI ≠ Release, deploy por tag, rollback via workflow_dispatch, concurrency groups",
        tags: ["Link Charts"],
      },
      {
        name: "OpenTelemetry",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules versionados, uptime probe que abre issue",
        tags: ["Link Charts"],
      },
      {
        name: "Registry GHCR",
        proof: "Imagens imutáveis, retenção para rollback",
        tags: ["Link Charts"],
      },
      {
        name: "VPS Linux",
        proof: "DigitalOcean — nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        tags: ["Link Charts"],
      },
      {
        name: "Supervisor",
        proof: "Process manager dos workers de fila",
        tags: ["Link Charts"],
      },
      {
        name: "Migrations expand/contract",
        proof: "Guard automatizado (MigrationSafetyTest) no CI",
        tags: ["Link Charts"],
      },
      {
        name: "Postmortems",
        proof:
          "918 respostas 502 → blue/green; bug de --build-arg → guard no CI; IP forjável → Cloudflare real-ip",
        tags: ["Link Charts"],
      },
      {
        name: "Bash",
        proof: "Scripts de deploy blue/green (176 linhas) e operação",
        tags: ["Link Charts"],
      },
      {
        name: "Kubernetes",
        proof: "Orquestração de contêineres em sistema consular de grande porte no setor público",
        tags: ["G4F"],
      },
      {
        name: "Jenkins · Bamboo · GitLab CI",
        proof: "Esteiras corporativas de build e deploy",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Rancher · Harbor",
        proof: "Orquestração de contêineres e registry privado em ambiente corporativo",
        tags: ["Basis"],
      },
      {
        name: "Apache · Nginx · Ubuntu",
        proof: "Operação de servidores web Linux, de VPS próprio a infra corporativa",
        tags: ["Link Charts", "Ordem Social"],
      },
      {
        name: "Azure DevOps",
        proof: "Boards e pipelines de CI/CD da Microsoft em projeto frontend",
        tags: ["VegaIT"],
      },
    ],
  },
  {
    id: "quality",
    title: "Qualidade & Testes",
    skills: [
      {
        name: "PHPUnit",
        proof: "PHPUnit 11 — ~902 testes: unit, feature, snapshot, characterization",
        tags: ["Link Charts"],
      },
      {
        name: "Matriz de banco no CI",
        proof: "Suíte inteira em SQLite E contra PostgreSQL 15 real",
        tags: ["Link Charts"],
      },
      {
        name: "PHPStan nível 5",
        proof: "Larastan sobre Laravel, com baseline versionado",
        tags: ["Link Charts"],
      },
      {
        name: "Playwright",
        proof: "E2E multi-viewport: 320/375/desktop, 6 projects, storage state autenticado",
        tags: ["Link Charts"],
      },
      {
        name: "Testes de segurança",
        proof: "IP spoofing, rate limit, retry de fila",
        tags: ["Link Charts"],
      },
      {
        name: "Lint como gate",
        proof: "ESLint --max-warnings=0, Prettier e Laravel Pint bloqueando o CI",
        tags: ["Link Charts", "este site"],
      },
      {
        name: "SonarQube",
        proof: "Gate de qualidade estática nas esteiras corporativas",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Jest · Testing Library · MSW",
        proof: "Testes unitários e mock de API, do corporativo ao projeto autoral",
        tags: ["G4F", "Basis", "projetos pessoais"],
      },
    ],
  },
  {
    id: "ai",
    title: "IA & Metodologias",
    skills: [
      {
        name: "IA-first com guardrails",
        proof:
          "Dev guiado por spec, orquestração de agentes — ~1.929 commits solo/17 meses, mantendo 902 testes, PHPStan, E2E",
        tags: ["Link Charts"],
      },
      {
        name: "Contexto como artefato",
        proof:
          "Arquivo de contexto de 22KB versionado no repo (onboarding para agentes), ADRs e postmortems que alimentam o contexto, llms.txt no frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Ecossistema de tooling de agentes",
        proof:
          "MCP servers configurados (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees para execução isolada de agentes",
        tags: ["Link Charts"],
      },
      {
        name: "Workflow git",
        proof:
          "Husky, commitlint/commitizen, hooks versionados no repo e Conventional Commits em todos os projetos",
        tags: ["Link Charts", "projetos pessoais"],
      },
      {
        name: "ADRs + Mermaid",
        proof:
          "Formato MADR; decisões de arquitetura documentadas em docs/adr/, com diagramas versionados",
        tags: ["Link Charts"],
      },
      {
        name: "Monetização web",
        proof: "AdSense Consent Mode v2, Google Ads com tracking de conversão, GA4",
        tags: ["Link Charts"],
      },
      {
        name: "E-mail transacional/lifecycle",
        proof: "Brevo/SendGrid — digest semanal, milestone, winback, onboarding",
        tags: ["Link Charts"],
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        proof: "Cerimônias Scrum, quadros Kanban e backlog no Jira em times corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Levantamento de requisitos e documentação",
        proof:
          "Entrevistas com stakeholders e especificação funcional para sistemas de gestão partidária",
        tags: ["Ordem Social"],
      },
    ],
  },
];
