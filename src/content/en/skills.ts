import type { SkillCategory } from "@/domain";

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages & Fundamentals",
    skills: [
      {
        name: "TypeScript",
        evidence: "production",
        proof:
          "strict mode + noUncheckedIndexedAccess across ~570 files in Link Charts; TS end to end since 2020",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "JavaScript",
        evidence: "production",
        proof: "ES6+ since 2016 — promises, async/await, closures",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "PHP 5.6 → 8.2",
        evidence: "production",
        proof: "10 years following the language's evolution; Laravel 12 in production",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Bash",
        evidence: "production",
        proof: "Blue/green deploy scripts (176 lines) and operations",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "HTML · CSS",
        evidence: "production",
        proof:
          "Semantic markup and modern CSS (SASS/SCSS, LESS, Tailwind, CSS-in-JS) in production at Link Charts and on client sites",
        highlight: false,
        tags: ["Link Charts"],
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture & Patterns",
    skills: [
      {
        name: "Rendering modes",
        evidence: "production",
        proof:
          "CSR, SSR, SSG, ISR, PPR — applied in corporate systems (G4F: SPA, SSG and SSR routes) and in Link Charts (ISR 300s + revalidateTag)",
        highlight: false,
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Layered architecture",
        evidence: "production",
        proof:
          "Controller → Service → Repository — DI by interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs; 145 PHP files, ~28k lines at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "REST + OpenAPI",
        evidence: "production",
        proof:
          "/api/v1 routes with Scramble at Link Charts and Swagger at Basis; correct HTTP semantics and consistent versioning",
        highlight: false,
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "ORMs — 6 across 3 runtimes",
        evidence: "production",
        proof:
          "Eloquent, TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — the category as a concept, not a memorized library",
        highlight: false,
        tags: ["Link Charts", "G4F", "Basis", "Ordem Social"],
      },
      {
        name: "Design fundamentals",
        evidence: "production",
        proof:
          "OOP, SOLID, PSRs, MVC — DI by interface, DTOs (Laravel/NestJS), Strategy, Registry, Observer, Orchestrator",
        highlight: false,
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Caching and async patterns",
        evidence: "production",
        proof:
          "Redis, ISR/cache tags, idempotency (dedup_key), queues, signed webhooks (hash_equals), auth (JWT, OAuth/Auth0), i18n",
        highlight: false,
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "OWASP Top 10",
        evidence: "production",
        proof:
          "JWT httpOnly, hash_equals, 16 rate limiters, anti-spoofing (Cloudflare), PII redaction, anti-fraud scoring, LGPD",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "SSO / OIDC",
        evidence: "professional",
        proof:
          "Integration with gov.br's Login Único (federal SSO/OIDC) in a large-scale public-sector consular system (G4F)",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Microservices",
        evidence: "professional",
        proof:
          "Auth service separated from the core in a large-scale public-sector consular system (G4F)",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Applied web security",
        evidence: "professional",
        proof:
          "Per-request CSP, HSTS, DOMPurify and hCaptcha on a large-scale public-sector system",
        highlight: false,
        tags: ["G4F"],
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
          "App Router, Server Components, ISR + cache tags, Turbopack at Link Charts; 13/14 and React 17/18 in production at G4F",
        highlight: true,
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "React 19",
        evidence: "production",
        proof: "Foundation of the entire Link Charts frontend, with Server Components",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Strict TypeScript",
        evidence: "production",
        proof: "strict mode with noUncheckedIndexedAccess enabled in production at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Feature-based architecture",
        evidence: "production",
        proof: "10 features in production at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "MUI 6 + Emotion",
        evidence: "production",
        proof: "SSR, light/dark themes, custom design system",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "TanStack Query v5",
        evidence: "production",
        proof: "Formerly React Query — 36 call sites, centralized query keys at Link Charts",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "react-hook-form + Zod",
        evidence: "production",
        proof: "Layered form validation across the Link Charts frontend",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Data viz",
        evidence: "production",
        proof:
          "30 ApexCharts chart components, choropleth/heatmap maps with Leaflet, tables with material-react-table",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "i18n",
        evidence: "production",
        proof:
          "i18next library — 13 namespaces in production at Link Charts; corporate multi-language i18n at G4F",
        highlight: false,
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Technical SEO",
        evidence: "production",
        proof: "Metadata API, JSON-LD, programmatic sitemap/robots, llms.txt",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Frontend performance",
        evidence: "production",
        proof: "next/font, optimizePackageImports, dynamic imports",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Accessibility",
        evidence: "production",
        proof: "312 uses of aria-*, prefers-reduced-motion, layout validated at 320px",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Redux · Context API",
        evidence: "professional",
        proof: "State management in corporate projects (G4F, Basis)",
        highlight: false,
        tags: ["G4F", "Basis"],
      },
      {
        name: "React Query and SWR",
        evidence: "professional",
        proof: "Data fetching and async state sync for the G4F consular system",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Styled Components · SASS/SCSS",
        evidence: "professional",
        proof: "CSS-in-JS (Styled Components) and SASS across corporate interfaces (G4F, Basis)",
        highlight: false,
        tags: ["G4F", "Basis"],
      },
      {
        name: "gov.br Design System",
        evidence: "professional",
        proof: "GOVBR-DS and jsx-a11y on a multi-language federal public product",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Vue.js · Bootstrap · LESS",
        evidence: "professional",
        proof:
          "Reactive Vue.js components with Bootstrap/LESS in Laravel admin screens — maintained legacy SPAs for ~3 years",
        highlight: false,
        tags: ["Ordem Social"],
      },
      {
        name: "Tailwind CSS",
        evidence: "project",
        proof: "Utility-first CSS with custom tokens and theme — shipped responsive landing pages",
        highlight: false,
        tags: ["side projects", "this site"],
      },
      {
        name: "Framer Motion",
        evidence: "project",
        proof: "Declarative entrance and scroll animations on a published solo landing page",
        highlight: false,
        tags: ["side projects"],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      {
        name: "Laravel 12",
        evidence: "production",
        proof: "PHP 8.2, in production at Link Charts since 2025",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Multi-mechanism authentication",
        evidence: "production",
        proof: "JWT httpOnly, Sanctum, Auth0 token exchange",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Rate limiting",
        evidence: "production",
        proof: "16 named rate limiters",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Idempotent queues and jobs",
        evidence: "production",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Eloquent",
        evidence: "production",
        proof: "Observers, factories, seeders at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Scheduler",
        evidence: "production",
        proof: "5 tasks with withoutOverlapping",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Structured logging with PII redaction",
        evidence: "production",
        proof: "8 channels, request_id propagated to workers",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Third-party integrations",
        evidence: "production",
        proof:
          "Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi — third-party services integrated into the Link Charts backend",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "LGPD compliance",
        evidence: "production",
        proof: "IP anonymization, account deletion, signed unsubscribe",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Full-stack Auth0",
        evidence: "production",
        proof: "Complete front+back flow at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "NestJS",
        evidence: "professional",
        proof:
          "Public sector (G4F): microservices, gov.br SSO (OIDC), Prisma 6; TypeORM and Passport/JWT in the hotel project backend",
        highlight: true,
        tags: ["G4F", "side projects"],
      },
      {
        name: "WebSockets",
        evidence: "professional",
        proof:
          "@nestjs/websockets + socket.io in a large-scale public-sector consular system (G4F)",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Express · AdonisJS",
        evidence: "professional",
        proof: "REST APIs with Express and AdonisJS (Lucid ORM) for corporate services at G4F",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Prisma ORM",
        evidence: "professional",
        proof: "Type-safe modeling and migrations with Prisma in a NestJS microservice at G4F",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "Deno",
        evidence: "professional",
        proof: "Deno runtime with OAK for routing and DenoDB as ORM in a corporate service at G4F",
        highlight: false,
        tags: ["G4F"],
      },
      {
        name: "PHP 5.6–8.1",
        evidence: "professional",
        proof:
          "Eloquent and Propel ORMs, Swagger docs and PSR standards since 2016; Laravel 8.1 MVC for an internal Basis system",
        highlight: false,
        tags: ["Basis", "Ordem Social", "Plug Digital"],
      },
    ],
  },
  {
    id: "devops",
    title: "CI/CD & Server",
    skills: [
      {
        name: "GitHub Actions",
        evidence: "production",
        proof: "CI ≠ Release, tag-based deploy, rollback via workflow_dispatch, concurrency groups",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "GHCR registry",
        evidence: "production",
        proof: "Immutable images, retention for rollback",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Blue/green deploy",
        evidence: "production",
        proof:
          "Measured downtime: ~5min → 0s; custom bash scripts (176 lines): warm-up, health check, graceful nginx cutover, drain, abort",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Docker",
        evidence: "production",
        proof: "Multi-stage, Alpine with compiled extensions, 3 compose stacks by lifecycle",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Supervisor",
        evidence: "production",
        proof: "Worker process manager at Link Charts",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Linux VPS",
        evidence: "production",
        proof: "DigitalOcean — nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Expand/contract migrations",
        evidence: "production",
        proof: "Automated guard (MigrationSafetyTest) in CI",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "OpenTelemetry",
        evidence: "production",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules as code, uptime probe that opens an issue",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Postmortems",
        evidence: "production",
        proof:
          "918 502 responses → blue/green; --build-arg bug → CI guard; spoofable IP → Cloudflare real-ip",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Kubernetes",
        evidence: "professional",
        proof: "Container orchestration on a large-scale public-sector consular system",
        highlight: true,
        tags: ["G4F"],
      },
      {
        name: "Jenkins · Bamboo · GitLab CI",
        evidence: "professional",
        proof: "Corporate build and deploy pipelines (Basis, G4F)",
        highlight: false,
        tags: ["G4F", "Basis"],
      },
      {
        name: "Rancher · Harbor",
        evidence: "professional",
        proof: "Container orchestration and private registry in corporate environments",
        highlight: false,
        tags: ["Basis"],
      },
      {
        name: "Apache · Nginx · Ubuntu",
        evidence: "professional",
        proof: "Linux web server operations, from my own VPS to corporate infra",
        highlight: false,
        tags: ["Link Charts", "Ordem Social"],
      },
      {
        name: "Azure DevOps",
        evidence: "professional",
        proof: "Microsoft's boards and CI/CD pipelines on a frontend project at VegaIT",
        highlight: false,
        tags: ["VegaIT"],
      },
    ],
  },
  {
    id: "quality",
    title: "Quality & Testing",
    skills: [
      {
        name: "PHPUnit",
        evidence: "production",
        proof: "PHPUnit 11 — ~902 tests: unit, feature, snapshot, characterization",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Database matrix in CI",
        evidence: "production",
        proof: "Full suite run on SQLite AND against real PostgreSQL 15",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "PHPStan level 5",
        evidence: "production",
        proof: "Larastan on Laravel, with a versioned baseline",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Playwright",
        evidence: "production",
        proof: "Multi-viewport E2E: 320/375/desktop, 6 projects, authenticated storage state",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Security tests",
        evidence: "production",
        proof: "IP spoofing, rate limiting, queue retry",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Lint as a gate",
        evidence: "production",
        proof:
          "ESLint --max-warnings=0, Prettier and Laravel Pint blocking CI on Link Charts and on this site",
        highlight: false,
        tags: ["Link Charts", "this site"],
      },
      {
        name: "SonarQube",
        evidence: "professional",
        proof: "Static quality gate in corporate pipelines (Basis, G4F)",
        highlight: false,
        tags: ["G4F", "Basis"],
      },
      {
        name: "Jest · Testing Library · MSW",
        evidence: "professional",
        proof: "Unit tests and API mocking across corporate projects and the solo hotel project",
        highlight: false,
        tags: ["G4F", "Basis", "side projects"],
      },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      {
        name: "PostgreSQL 15",
        evidence: "production",
        proof: "56 migrations, performance indexes, backfill, UNIQUE for idempotency",
        highlight: true,
        tags: ["Link Charts"],
      },
      {
        name: "Redis 7",
        evidence: "production",
        proof: "Cache, queues, sliding-window for viral rank",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Multi-dialect SQL",
        evidence: "production",
        proof: "Custom dialect layer (SqlDateExpr) for SQLite and PostgreSQL",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Oracle",
        evidence: "professional",
        proof: "PL/SQL and schema design for corporate databases behind large internal systems",
        highlight: false,
        tags: ["Basis", "Transoft"],
      },
      {
        name: "MySQL",
        evidence: "professional",
        proof: "Relational modeling and queries for party-management and legal-case systems",
        highlight: false,
        tags: ["Ordem Social"],
      },
    ],
  },
  {
    id: "ai",
    title: "AI-Assisted Engineering",
    skills: [
      {
        name: "AI-first with guardrails",
        evidence: "production",
        proof:
          "Spec-driven dev, multi-agent orchestration — ~1,929 solo commits/17 months, keeping 902 tests, PHPStan, E2E gates",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Context as an artifact",
        evidence: "production",
        proof:
          "A 22KB CLAUDE.md versioned in the repo (agent onboarding), ADRs and postmortems that feed that context, llms.txt on the frontend",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Agent tooling ecosystem",
        evidence: "production",
        proof:
          "Configured MCP servers (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees for isolated agent execution",
        highlight: false,
        tags: ["Link Charts"],
      },
    ],
  },
  {
    id: "tools",
    title: "Tools & Methodologies",
    skills: [
      {
        name: "Git workflow",
        evidence: "production",
        proof:
          "Husky, commitlint/commitizen, repo-versioned hooks and Conventional Commits across all projects",
        highlight: false,
        tags: ["Link Charts", "side projects"],
      },
      {
        name: "ADRs + Mermaid",
        evidence: "production",
        proof:
          "MADR format; architecture decisions documented in docs/adr/, with versioned diagrams",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Web monetization",
        evidence: "production",
        proof: "AdSense Consent Mode v2, Google Ads with conversion tracking, GA4",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "Transactional/lifecycle email",
        evidence: "production",
        proof: "Brevo/SendGrid — weekly digest, milestone, winback, onboarding",
        highlight: false,
        tags: ["Link Charts"],
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        evidence: "professional",
        proof:
          "Scrum ceremonies, Kanban boards, and Jira backlog management in corporate teams (G4F, Basis)",
        highlight: false,
        tags: ["G4F", "Basis"],
      },
      {
        name: "Requirements gathering and documentation",
        evidence: "professional",
        proof: "Stakeholder interviews and functional specs for party-management systems",
        highlight: false,
        tags: ["Ordem Social"],
      },
    ],
  },
];
