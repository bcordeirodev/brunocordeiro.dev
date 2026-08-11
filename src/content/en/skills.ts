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
      },
      {
        name: "JavaScript (ES6+)",
        evidence: "production",
        proof: "Since 2016 — promises, async/await, closures",
        highlight: false,
      },
      {
        name: "PHP 5.6 → 8.2",
        evidence: "production",
        proof: "10 years following the language's evolution; Laravel 12 in production",
        highlight: false,
      },
      {
        name: "Multi-dialect SQL",
        evidence: "production",
        proof: "PostgreSQL, MySQL, Oracle, SQLite — a custom dialect layer in Link Charts",
        highlight: false,
      },
      {
        name: "Bash",
        evidence: "production",
        proof: "Blue/green deploy scripts (176 lines) and operations",
        highlight: false,
      },
      {
        name: "Semantic HTML",
        evidence: "production",
        proof: "Semantic markup in production on Link Charts and client sites",
        highlight: false,
      },
      {
        name: "Modern CSS",
        evidence: "production",
        proof: "SASS/SCSS, LESS, Tailwind, CSS-in-JS (Emotion, Styled Components) in production",
        highlight: false,
      },
      {
        name: "Swift",
        evidence: "academic",
        proof: "Graduate degree in Mobile Device Development (IESB)",
        highlight: false,
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture & Patterns",
    skills: [
      {
        name: "Rendering modes (CSR, SSR, SSG, ISR, PPR)",
        evidence: "production",
        proof:
          "Applied in corporate systems (G4F: SPA, SSG and SSR routes) and in Link Charts (ISR 300s + revalidateTag)",
        highlight: false,
      },
      {
        name: "REST/RESTful",
        evidence: "production",
        proof:
          "Versioned APIs (/api/v1), correct HTTP semantics, OpenAPI/Swagger (Scramble at Link Charts; Swagger at Basis)",
        highlight: false,
      },
      {
        name: "DTOs and data contracts",
        evidence: "production",
        proof:
          "DTOs on the backend (Laravel and NestJS), API Resources, layered validation (Zod on the front, FormRequests on the back)",
        highlight: false,
      },
      {
        name: "ORMs — 6 across 3 runtimes",
        evidence: "production",
        proof:
          "Eloquent, TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — the category as a concept, not a memorized library",
        highlight: false,
      },
      {
        name: "OOP, SOLID, PSRs, MVC, layered architecture",
        evidence: "production",
        proof:
          "Controller → Service → Repository, dependency injection by interface, named Design Patterns: Singleton, Strategy, Registry, Observer, Orchestrator, Repository",
        highlight: false,
      },
      {
        name: "Caching and async patterns",
        evidence: "production",
        proof:
          "Redis, ISR/cache tags, HTTP; idempotency (dedup_key + insertOrIgnore); queues, middlewares, signed webhooks (hash_equals); auth flows (JWT httpOnly, ACL, OAuth/Auth0, Sanctum); i18n as architecture",
        highlight: false,
      },
      {
        name: "Application security — OWASP Top 10 in practice",
        evidence: "production",
        proof:
          "JWT in an httpOnly cookie (XSS), hash_equals comparison (timing attack), 16 rate limiters (brute force/DoS), IP spoofing protection (Cloudflare real-ip + automated test), layered input validation, secrets kept out of code, PII redaction in logs, anti-fraud quality score, Google Safe Browsing, LGPD compliance",
        highlight: true,
      },
      {
        name: "SSO / OIDC (gov.br Login Único)",
        evidence: "professional",
        proof:
          "Integration with gov.br's Login Único (federal SSO/OIDC) in a large-scale public-sector consular system (G4F)",
        highlight: false,
      },
      {
        name: "Microservices architecture",
        evidence: "professional",
        proof:
          "Auth service separated from the core in a large-scale public-sector consular system (G4F)",
        highlight: false,
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
          "App Router, Server Components, ISR + cache tags, middleware, route handlers, Turbopack — in production at Link Charts",
        highlight: true,
      },
      {
        name: "React 19",
        evidence: "production",
        proof: "Foundation of the entire Link Charts frontend, with Server Components",
        highlight: true,
      },
      {
        name: "Strict TypeScript (noUncheckedIndexedAccess)",
        evidence: "production",
        proof: "strict mode with noUncheckedIndexedAccess enabled in production at Link Charts",
        highlight: false,
      },
      {
        name: "Feature-based architecture at scale",
        evidence: "production",
        proof: "10 features in production at Link Charts",
        highlight: false,
      },
      {
        name: "MUI 6 + Emotion",
        evidence: "production",
        proof: "SSR, light/dark themes, custom design system",
        highlight: false,
      },
      {
        name: "TanStack Query v5 (React Query)",
        evidence: "production",
        proof: "36 call sites, centralized query keys at Link Charts",
        highlight: true,
      },
      {
        name: "react-hook-form + Zod",
        evidence: "production",
        proof: "Layered form validation across the Link Charts frontend",
        highlight: false,
      },
      {
        name: "Data viz (ApexCharts, Leaflet, material-react-table)",
        evidence: "production",
        proof:
          "30 ApexCharts chart components, choropleth/heatmap maps with Leaflet, tables with material-react-table",
        highlight: false,
      },
      {
        name: "i18n (i18next)",
        evidence: "production",
        proof: "13 namespaces in production at Link Charts",
        highlight: false,
      },
      {
        name: "Technical SEO",
        evidence: "production",
        proof: "Metadata API, JSON-LD, programmatic sitemap/robots, llms.txt",
        highlight: false,
      },
      {
        name: "Frontend performance",
        evidence: "production",
        proof: "next/font, optimizePackageImports, dynamic imports",
        highlight: false,
      },
      {
        name: "Accessibility",
        evidence: "production",
        proof: "312 uses of aria-*, prefers-reduced-motion, layout validated at 320px",
        highlight: false,
      },
      {
        name: "Next.js 13/14 and React 17/18 (corporate)",
        evidence: "professional",
        proof: "Corporate SPA/SSG/SSR systems at G4F",
        highlight: false,
      },
      {
        name: "Redux · Context API",
        evidence: "professional",
        proof: "State management in corporate projects (G4F, Basis)",
        highlight: false,
      },
      { name: "React Query and SWR", evidence: "professional", proof: "G4F", highlight: false },
      {
        name: "Styled Components · SASS/SCSS",
        evidence: "professional",
        proof: "G4F, Basis",
        highlight: false,
      },
      {
        name: "MSW",
        evidence: "professional",
        proof: "API mocking in corporate test suites (G4F, VegaIT)",
        highlight: false,
      },
      { name: "i18n (corporate)", evidence: "professional", proof: "G4F", highlight: false },
      {
        name: "Webpack · jQuery",
        evidence: "professional",
        proof: "Corporate legacy stack",
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
        name: "Vue.js · Bootstrap · LESS (legacy)",
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
        proof: "In production at Link Charts since 2025",
        highlight: true,
      },
      {
        name: "Layered architecture (Controller → Service → Repository)",
        evidence: "production",
        proof:
          "DI by interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs — 145 PHP files, ~28k lines at Link Charts",
        highlight: false,
      },
      {
        name: "Versioned REST API + OpenAPI (Scramble)",
        evidence: "production",
        proof: "/api/v1 routes auto-documented at Link Charts",
        highlight: false,
      },
      {
        name: "Multi-mechanism authentication",
        evidence: "production",
        proof: "JWT httpOnly, Sanctum, Auth0 token exchange",
        highlight: false,
      },
      {
        name: "Threat-sized rate limiting",
        evidence: "production",
        proof: "16 named rate limiters",
        highlight: false,
      },
      {
        name: "Idempotent queues and jobs",
        evidence: "production",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        highlight: false,
      },
      {
        name: "Scheduler",
        evidence: "production",
        proof: "5 tasks with withoutOverlapping",
        highlight: false,
      },
      {
        name: "Structured logging with PII redaction",
        evidence: "production",
        proof: "8 channels, request_id propagated to workers",
        highlight: false,
      },
      {
        name: "Integrations (Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi)",
        evidence: "production",
        proof: "Third-party services integrated into the Link Charts backend",
        highlight: false,
      },
      {
        name: "LGPD compliance",
        evidence: "production",
        proof: "IP anonymization, account deletion, signed unsubscribe",
        highlight: false,
      },
      {
        name: "NestJS 11 + Passport/JWT",
        evidence: "professional",
        proof:
          "Large-scale public-sector production (G4F): microservices, gov.br SSO (Login Único/OIDC), Prisma 6",
        highlight: false,
      },
      {
        name: "WebSockets (socket.io)",
        evidence: "professional",
        proof:
          "@nestjs/websockets + socket.io in a large-scale public-sector consular system (G4F)",
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
          "Professional PHP since 2016 — Basis, Partido Republicano da Ordem Social, Transoft, Plug Digital",
        highlight: false,
      },
      {
        name: "JSNSD — OpenJS Node.js Services Developer",
        evidence: "certified",
        proof: "The Linux Foundation, Feb/2025",
        highlight: false,
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
      },
      {
        name: "GHCR registry",
        evidence: "production",
        proof: "Immutable images, retention for rollback",
        highlight: false,
      },
      {
        name: "Zero-downtime blue/green deploy",
        evidence: "production",
        proof:
          "Measured downtime: ~5min → 0s; custom bash scripts (176 lines): warm-up, health check, graceful nginx cutover, drain, abort",
        highlight: true,
      },
      {
        name: "Advanced Docker",
        evidence: "production",
        proof: "Multi-stage, Alpine with compiled extensions, 3 compose stacks by lifecycle",
        highlight: true,
      },
      {
        name: "Supervisor",
        evidence: "production",
        proof: "Worker process manager at Link Charts",
        highlight: false,
      },
      {
        name: "Linux VPS (DigitalOcean)",
        evidence: "production",
        proof: "nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        highlight: false,
      },
      {
        name: "Expand/contract migrations",
        evidence: "production",
        proof: "Automated guard (MigrationSafetyTest) in CI",
        highlight: false,
      },
      {
        name: "OpenTelemetry",
        evidence: "production",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules as code, uptime probe that opens an issue",
        highlight: true,
      },
      {
        name: "Postmortem-driven engineering",
        evidence: "production",
        proof:
          "918 502 responses → blue/green; --build-arg bug → CI guard; spoofable IP → Cloudflare real-ip",
        highlight: false,
      },
      {
        name: "Kubernetes",
        evidence: "professional",
        proof:
          "k8s/ manifests for the frontend of a large-scale public-sector consular system (G4F)",
        highlight: true,
      },
      {
        name: "Jenkins · Bamboo · GitLab CI · SonarQube · Rancher · Harbor · Apache · Ubuntu",
        evidence: "professional",
        proof: "G4F and Basis",
        highlight: false,
      },
      {
        name: "Bitbucket (incl. Pipelines)",
        evidence: "declared",
        proof: "Bitbucket / Bitbucket Pipelines",
        highlight: false,
      },
      { name: "Azure DevOps", evidence: "professional", proof: "VegaIT", highlight: false },
    ],
  },
  {
    id: "quality",
    title: "Quality & Testing",
    skills: [
      {
        name: "PHPUnit 11 at scale",
        evidence: "production",
        proof: "~902 tests: unit, feature, snapshot, characterization",
        highlight: false,
      },
      {
        name: "Database matrix in CI",
        evidence: "production",
        proof: "Full suite run on SQLite AND against real PostgreSQL 15",
        highlight: false,
      },
      {
        name: "PHPStan/Larastan level 5",
        evidence: "production",
        proof: "With a versioned baseline",
        highlight: false,
      },
      {
        name: "Playwright multi-viewport E2E",
        evidence: "production",
        proof: "320/375/desktop, 6 projects, authenticated storage state",
        highlight: false,
      },
      {
        name: "Security tests",
        evidence: "production",
        proof: "IP spoofing, rate limiting, queue retry",
        highlight: false,
      },
      {
        name: "ESLint",
        evidence: "production",
        proof:
          "v9 flat config, --max-warnings=0 as a gate; professional use since ~2019 across companies",
        highlight: false,
      },
      {
        name: "Prettier",
        evidence: "production",
        proof: "Automated formatting in the CI gate",
        highlight: false,
      },
      {
        name: "Laravel Pint",
        evidence: "production",
        proof: "PHP formatting at Link Charts",
        highlight: false,
      },
      {
        name: "Husky/commitlint/commitizen",
        evidence: "production",
        proof: "Versioned git hooks in the repository",
        highlight: false,
      },
      {
        name: "Versioned git hooks",
        evidence: "production",
        proof: "Pre-push runs the suite in Docker",
        highlight: false,
      },
      {
        name: "Conventional Commits",
        evidence: "production",
        proof: "Git history of the Link Charts repositories",
        highlight: false,
      },
      {
        name: "ADRs (MADR)",
        evidence: "production",
        proof: "Architecture decisions documented in docs/adr/",
        highlight: false,
      },
      {
        name: "Mermaid",
        evidence: "production",
        proof: "Diagrams versioned in the documentation",
        highlight: false,
      },
      {
        name: "Jest · Testing Library · MSW",
        evidence: "professional",
        proof: "G4F, Basis; also used in the authored project hotel",
        highlight: false,
      },
      {
        name: "Standards culture/mentoring",
        evidence: "academic",
        proof:
          "Authored 22-rule guide (80% coverage, commitlint, rebase-only) — README of the hotel repo",
        highlight: false,
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
      },
      {
        name: "Redis 7",
        evidence: "production",
        proof: "Cache, queues, sliding-window for viral rank",
        highlight: false,
      },
      {
        name: "Eloquent",
        evidence: "production",
        proof: "Observers, factories, seeders at Link Charts",
        highlight: false,
      },
      {
        name: "Multi-dialect SQL",
        evidence: "production",
        proof: "Custom dialect layer (SqlDateExpr) for SQLite and PostgreSQL",
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
    title: "AI-Assisted Engineering",
    skills: [
      {
        name: "AI-first workflow with engineering guardrails",
        evidence: "production",
        proof:
          "Spec-driven development (brainstorm → design doc → plan → execution), orchestration of multiple agents and subagents, phased execution with reports — proven by the pace of Link Charts (~1,929 solo commits in 17 months, alongside a full-time job) without giving up the gates (902 tests, PHPStan, E2E, zero-warnings)",
        highlight: false,
      },
      {
        name: "Context as an artifact",
        evidence: "production",
        proof:
          "A 22KB CLAUDE.md versioned in the repo (agent onboarding), ADRs and postmortems that feed that context, llms.txt on the frontend",
        highlight: false,
      },
      {
        name: "Agent tooling ecosystem",
        evidence: "production",
        proof:
          "Configured MCP servers (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees for isolated agent execution",
        highlight: false,
      },
    ],
  },
  {
    id: "tools",
    title: "Tools & Methodologies",
    skills: [
      {
        name: "Full-stack Auth0",
        evidence: "production",
        proof: "Complete front+back flow at Link Charts",
        highlight: false,
      },
      {
        name: "Web monetization",
        evidence: "production",
        proof: "AdSense Consent Mode v2, Google Ads with conversion tracking, GA4",
        highlight: false,
      },
      {
        name: "Transactional/lifecycle email",
        evidence: "production",
        proof: "Brevo/SendGrid — weekly digest, milestone, winback, onboarding",
        highlight: false,
      },
      {
        name: "PSM I — Professional Scrum Master",
        evidence: "certified",
        proof: "Scrum.org, Jan/2024",
        highlight: false,
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        evidence: "professional",
        proof: "G4F, Basis",
        highlight: false,
      },
      {
        name: "Requirements gathering and documentation",
        evidence: "professional",
        proof: "Partido Republicano da Ordem Social",
        highlight: false,
      },
      {
        name: "freeCodeCamp — JavaScript Algorithms and Data Structures",
        evidence: "certified",
        proof: "Oct/2024",
        highlight: false,
      },
      {
        name: "Swift/UIKit/MVVM",
        evidence: "academic",
        proof: "Graduate degree in Mobile Device Development (IESB)",
        highlight: false,
      },
    ],
  },
];
