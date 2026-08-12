import type { SkillCategory } from "@/domain";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      {
        name: "Next.js 15",
        proof:
          "App Router, Server Components, ISR + cache tags, Turbopack; since versions 13/14 with React 17/18",
        tags: ["Link Charts", "G4F"],
        links: [{ label: "Next.js", url: "https://nextjs.org" }],
      },
      {
        name: "React 19",
        proof: "Foundation of the entire frontend, with Server Components",
        tags: ["Link Charts"],
        links: [{ label: "React", url: "https://react.dev" }],
      },
      {
        name: "TypeScript · JavaScript",
        proof:
          "strict mode + noUncheckedIndexedAccess across ~570 files; ES6+ since 2016, TS end to end since 2020",
        tags: ["Link Charts"],
        links: [
          { label: "TypeScript", url: "https://www.typescriptlang.org" },
          { label: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
        ],
      },
      {
        name: "HTML · CSS",
        proof:
          "Semantic markup and modern CSS (SASS/SCSS, LESS, Tailwind, CSS-in-JS), including client sites",
        tags: ["Link Charts"],
        links: [
          { label: "HTML", url: "https://developer.mozilla.org/docs/Web/HTML" },
          { label: "CSS", url: "https://developer.mozilla.org/docs/Web/CSS" },
        ],
      },
      {
        name: "Rendering modes",
        proof:
          "CSR, SSR, SSG, ISR, PPR — from corporate SPA, SSG and SSR routes to ISR 300s + revalidateTag",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Feature-based architecture",
        proof: "10 features in production",
        tags: ["Link Charts"],
      },
      {
        name: "MUI 6 + Emotion",
        proof: "SSR, light/dark themes, custom design system",
        tags: ["Link Charts"],
        links: [
          { label: "MUI", url: "https://mui.com" },
          { label: "Emotion", url: "https://emotion.sh" },
        ],
      },
      {
        name: "TanStack Query · SWR",
        proof:
          "36 call sites and centralized query keys on v5 (formerly React Query); SWR on a large-scale consular system",
        tags: ["Link Charts", "G4F"],
        links: [
          { label: "TanStack Query", url: "https://tanstack.com/query" },
          { label: "SWR", url: "https://vercel.com/oss/swr" },
        ],
      },
      {
        name: "react-hook-form + Zod",
        proof: "Layered form validation on the frontend",
        tags: ["Link Charts"],
        links: [
          { label: "React Hook Form", url: "https://react-hook-form.com" },
          { label: "Zod", url: "https://zod.dev" },
        ],
      },
      {
        name: "Data viz",
        proof:
          "30 ApexCharts chart components, choropleth/heatmap maps with Leaflet, tables with material-react-table",
        tags: ["Link Charts"],
        links: [
          { label: "ApexCharts", url: "https://apexcharts.com" },
          { label: "Leaflet", url: "https://leafletjs.com" },
          { label: "material-react-table", url: "https://www.material-react-table.com" },
        ],
      },
      {
        name: "i18n",
        proof: "i18next — 13 namespaces in production; multi-language corporate product",
        tags: ["Link Charts", "G4F"],
        links: [{ label: "i18next", url: "https://www.i18next.com" }],
      },
      {
        name: "Technical SEO",
        proof: "Metadata API, JSON-LD, programmatic sitemap/robots, llms.txt",
        tags: ["Link Charts"],
      },
      {
        name: "Frontend performance",
        proof: "next/font, optimizePackageImports, dynamic imports",
        tags: ["Link Charts"],
      },
      {
        name: "Accessibility",
        proof: "312 uses of aria-*, prefers-reduced-motion, layout validated at 320px",
        tags: ["Link Charts"],
      },
      {
        name: "Redux · Context API",
        proof: "State management in corporate projects",
        tags: ["G4F", "Basis"],
        links: [{ label: "Redux", url: "https://redux.js.org" }],
      },
      {
        name: "Styled Components · SASS/SCSS",
        proof: "CSS-in-JS and SASS across corporate interfaces",
        tags: ["G4F", "Basis"],
        links: [
          { label: "styled-components", url: "https://styled-components.com" },
          { label: "Sass", url: "https://sass-lang.com" },
        ],
      },
      {
        name: "gov.br Design System",
        proof: "GOVBR-DS and jsx-a11y on a multi-language federal public product",
        tags: ["G4F"],
        links: [{ label: "gov.br DS", url: "https://www.gov.br/ds/" }],
      },
      {
        name: "Vue.js · Bootstrap · LESS",
        proof:
          "Reactive Vue.js components with Bootstrap/LESS in Laravel admin screens — maintained legacy SPAs for ~3 years",
        tags: ["Ordem Social"],
        links: [
          { label: "Vue.js", url: "https://vuejs.org" },
          { label: "Bootstrap", url: "https://getbootstrap.com" },
          { label: "Less", url: "https://lesscss.org" },
        ],
      },
      {
        name: "jQuery",
        proof:
          "DOM manipulation and plugins (datepicker, carousel, charts) — production interfaces on PHP systems for ~5 years",
        tags: ["Ordem Social", "Transoft", "Plug Digital"],
        links: [{ label: "jQuery", url: "https://jquery.com" }],
      },
      {
        name: "Tailwind CSS",
        proof: "Utility-first CSS with custom tokens and theme — shipped responsive landing pages",
        tags: ["side projects", "this site"],
        links: [{ label: "Tailwind CSS", url: "https://tailwindcss.com" }],
      },
      {
        name: "Framer Motion",
        proof: "Declarative entrance and scroll animations on a published solo landing page",
        tags: ["side projects"],
        links: [{ label: "Motion", url: "https://motion.dev" }],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Data",
    skills: [
      {
        name: "Laravel 12",
        proof: "PHP 8.2, in production since 2025",
        tags: ["Link Charts"],
        links: [{ label: "Laravel", url: "https://laravel.com" }],
      },
      {
        name: "PHP 5.6 → 8.2",
        proof:
          "10 years following the language's evolution — Propel, Swagger and PSRs since 2016; from Laravel 8 on internal systems to Laravel 12 in production",
        tags: ["Link Charts", "Basis", "Ordem Social", "Plug Digital"],
        links: [{ label: "PHP", url: "https://www.php.net" }],
      },
      {
        name: "NestJS",
        proof:
          "Public-sector microservices with gov.br SSO (OIDC) and Prisma 6; TypeORM and Passport/JWT on a solo project",
        tags: ["G4F", "side projects"],
        links: [{ label: "NestJS", url: "https://nestjs.com" }],
      },
      {
        name: "Layered architecture",
        proof:
          "Controller → Service → Repository — DI by interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs; 145 PHP files, ~28k lines",
        tags: ["Link Charts"],
      },
      {
        name: "REST + OpenAPI",
        proof:
          "/api/v1 routes documented with Scramble; Swagger on a corporate system — correct HTTP semantics and consistent versioning",
        tags: ["Link Charts", "Basis"],
        links: [{ label: "OpenAPI", url: "https://www.openapis.org" }],
      },
      {
        name: "ORMs — 6 across 3 runtimes",
        proof:
          "Eloquent (observers, factories, seeders), TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — the pattern, not one library learned by rote",
        tags: ["Link Charts", "G4F", "Basis", "Ordem Social"],
      },
      {
        name: "Authentication & SSO",
        proof:
          "JWT httpOnly, Sanctum and Auth0 end to end (front+back); gov.br Login Único (federal SSO/OIDC)",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Applied security (OWASP)",
        proof:
          "JWT httpOnly, hash_equals, 16 rate limiters, anti-spoofing (Cloudflare), anti-fraud scoring; per-request CSP, HSTS, DOMPurify and hCaptcha on a large-scale public system",
        tags: ["Link Charts", "G4F"],
        links: [{ label: "OWASP", url: "https://owasp.org" }],
      },
      {
        name: "Caching and async patterns",
        proof:
          "Redis, ISR/cache tags, idempotency (dedup_key), queues, signed webhooks (hash_equals)",
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "Rate limiting",
        proof: "16 named rate limiters",
        tags: ["Link Charts"],
      },
      {
        name: "Idempotent queues and jobs",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        tags: ["Link Charts"],
      },
      {
        name: "Scheduler",
        proof: "5 tasks with withoutOverlapping",
        tags: ["Link Charts"],
      },
      {
        name: "Structured logging with PII redaction",
        proof: "8 channels, request_id propagated to workers",
        tags: ["Link Charts"],
      },
      {
        name: "Third-party integrations",
        proof:
          "Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi integrated in the backend",
        tags: ["Link Charts"],
      },
      {
        name: "LGPD (Brazilian GDPR) compliance",
        proof: "IP anonymization, account deletion, signed unsubscribe",
        tags: ["Link Charts"],
      },
      {
        name: "WebSockets",
        proof: "@nestjs/websockets + socket.io in a large-scale public-sector consular system",
        tags: ["G4F"],
        links: [{ label: "Socket.IO", url: "https://socket.io" }],
      },
      {
        name: "Microservices",
        proof: "Auth service separated from the core in a large-scale consular system",
        tags: ["G4F"],
      },
      {
        name: "Express · AdonisJS",
        proof: "REST APIs with Express and AdonisJS (Lucid ORM) for corporate services",
        tags: ["G4F"],
        links: [
          { label: "Express", url: "https://expressjs.com" },
          { label: "AdonisJS", url: "https://adonisjs.com" },
        ],
      },
      {
        name: "Deno",
        proof: "Deno runtime with OAK for routing and DenoDB as ORM in a corporate service",
        tags: ["G4F"],
        links: [{ label: "Deno", url: "https://deno.com" }],
      },
      {
        name: "Design fundamentals",
        proof: "OOP, SOLID, PSRs, MVC — the theoretical foundation behind the layered architecture",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "PostgreSQL 15",
        proof: "56 migrations, performance indexes, backfill, UNIQUE for idempotency",
        tags: ["Link Charts"],
        links: [{ label: "PostgreSQL", url: "https://www.postgresql.org" }],
      },
      {
        name: "Redis 7",
        proof: "Cache, queues, sliding-window for viral rank",
        tags: ["Link Charts"],
        links: [{ label: "Redis", url: "https://redis.io" }],
      },
      {
        name: "Multi-dialect SQL",
        proof: "Custom dialect layer (SqlDateExpr) for SQLite and PostgreSQL",
        tags: ["Link Charts"],
      },
      {
        name: "Oracle",
        proof: "PL/SQL and schema design for corporate databases behind large internal systems",
        tags: ["Basis", "Transoft"],
        links: [{ label: "Oracle Database", url: "https://www.oracle.com/database/" }],
      },
      {
        name: "MySQL",
        proof: "Relational modeling and queries for party-management and legal-case systems",
        tags: ["Ordem Social"],
        links: [{ label: "MySQL", url: "https://www.mysql.com" }],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Infra",
    skills: [
      {
        name: "Blue/green deploy",
        proof:
          "Measured downtime: ~5min → 0s; custom bash scripts (176 lines): warm-up, health check, graceful nginx cutover, drain, abort",
        tags: ["Link Charts"],
      },
      {
        name: "Docker",
        proof: "Multi-stage, Alpine with compiled extensions, 3 compose stacks by lifecycle",
        tags: ["Link Charts"],
        links: [{ label: "Docker", url: "https://www.docker.com" }],
      },
      {
        name: "GitHub Actions",
        proof: "CI ≠ Release, tag-based deploy, rollback via workflow_dispatch, concurrency groups",
        tags: ["Link Charts"],
        links: [{ label: "GitHub Actions", url: "https://github.com/features/actions" }],
      },
      {
        name: "OpenTelemetry",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules as code, uptime probe that opens an issue",
        tags: ["Link Charts"],
        links: [{ label: "OpenTelemetry", url: "https://opentelemetry.io" }],
      },
      {
        name: "GHCR registry",
        proof: "Immutable images, retention for rollback",
        tags: ["Link Charts"],
      },
      {
        name: "Linux VPS",
        proof: "DigitalOcean — nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        tags: ["Link Charts"],
      },
      {
        name: "Supervisor",
        proof: "Process manager for the queue workers",
        tags: ["Link Charts"],
        links: [{ label: "Supervisor", url: "https://supervisord.org" }],
      },
      {
        name: "Expand/contract migrations",
        proof: "Automated guard (MigrationSafetyTest) in CI",
        tags: ["Link Charts"],
      },
      {
        name: "Postmortems",
        proof:
          "918 HTTP 502s → blue/green; --build-arg bug → CI guard; spoofable IP → Cloudflare real-ip",
        tags: ["Link Charts"],
      },
      {
        name: "Bash",
        proof: "Blue/green deploy scripts (176 lines) and operations",
        tags: ["Link Charts"],
        links: [{ label: "GNU Bash", url: "https://www.gnu.org/software/bash/" }],
      },
      {
        name: "Kubernetes",
        proof: "Container orchestration on a large-scale public-sector consular system",
        tags: ["G4F"],
        links: [{ label: "Kubernetes", url: "https://kubernetes.io" }],
      },
      {
        name: "Jenkins · Bamboo · GitLab CI",
        proof: "Corporate build and deploy pipelines",
        tags: ["G4F", "Basis"],
        links: [
          { label: "Jenkins", url: "https://www.jenkins.io" },
          { label: "Bamboo", url: "https://www.atlassian.com/software/bamboo" },
          { label: "GitLab CI", url: "https://about.gitlab.com/solutions/continuous-integration/" },
        ],
      },
      {
        name: "Rancher · Harbor",
        proof: "Container orchestration and private registry in corporate environments",
        tags: ["Basis"],
        links: [
          { label: "Rancher", url: "https://www.rancher.com" },
          { label: "Harbor", url: "https://goharbor.io" },
        ],
      },
      {
        name: "Apache · Nginx · Ubuntu",
        proof: "Linux web server operations, from my own VPS to corporate infra",
        tags: ["Link Charts", "Ordem Social"],
        links: [
          { label: "Apache HTTP Server", url: "https://httpd.apache.org" },
          { label: "nginx", url: "https://nginx.org" },
          { label: "Ubuntu", url: "https://ubuntu.com" },
        ],
      },
      {
        name: "Azure DevOps",
        proof: "Microsoft's boards and CI/CD pipelines on a frontend project",
        tags: ["VegaIT"],
        links: [{ label: "Azure DevOps", url: "https://azure.microsoft.com/products/devops" }],
      },
    ],
  },
  {
    id: "quality",
    title: "Quality & Testing",
    skills: [
      {
        name: "PHPUnit",
        proof: "PHPUnit 11 — ~902 tests: unit, feature, snapshot, characterization",
        tags: ["Link Charts"],
        links: [{ label: "PHPUnit", url: "https://phpunit.de" }],
      },
      {
        name: "Database matrix in CI",
        proof: "Full suite run on SQLite AND against real PostgreSQL 15",
        tags: ["Link Charts"],
      },
      {
        name: "PHPStan level 5",
        proof: "Larastan on Laravel, with a versioned baseline",
        tags: ["Link Charts"],
        links: [{ label: "PHPStan", url: "https://phpstan.org" }],
      },
      {
        name: "Playwright",
        proof: "Multi-viewport E2E: 320/375/desktop, 6 projects, authenticated storage state",
        tags: ["Link Charts"],
        links: [{ label: "Playwright", url: "https://playwright.dev" }],
      },
      {
        name: "Security tests",
        proof: "IP spoofing, rate limiting, queue retry",
        tags: ["Link Charts"],
      },
      {
        name: "Lint as a gate",
        proof: "ESLint --max-warnings=0, Prettier and Laravel Pint blocking CI",
        tags: ["Link Charts", "this site"],
        links: [
          { label: "ESLint", url: "https://eslint.org" },
          { label: "Prettier", url: "https://prettier.io" },
        ],
      },
      {
        name: "SonarQube",
        proof: "Static quality gate in corporate pipelines",
        tags: ["G4F", "Basis"],
        links: [{ label: "SonarQube", url: "https://www.sonarsource.com/products/sonarqube/" }],
      },
      {
        name: "Jest · Testing Library · MSW",
        proof: "Unit tests and API mocking, from corporate work to a solo project",
        tags: ["G4F", "Basis", "side projects"],
        links: [
          { label: "Jest", url: "https://jestjs.io" },
          { label: "Testing Library", url: "https://testing-library.com" },
          { label: "MSW", url: "https://mswjs.io" },
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "AI & Methods",
    skills: [
      {
        name: "AI-first with guardrails",
        proof:
          "Spec-driven dev, multi-agent orchestration — ~1,929 solo commits/17 months, keeping 902 tests, PHPStan, E2E gates",
        tags: ["Link Charts"],
      },
      {
        name: "Context as an artifact",
        proof:
          "A 22KB agent-context file versioned in the repo (agent onboarding), ADRs and postmortems that feed that context, llms.txt on the frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Agent tooling ecosystem",
        proof:
          "Configured MCP servers (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees for isolated agent execution",
        tags: ["Link Charts"],
        links: [{ label: "Model Context Protocol", url: "https://modelcontextprotocol.io" }],
      },
      {
        name: "Git workflow",
        proof:
          "Husky, commitlint/commitizen, repo-versioned hooks and Conventional Commits across all projects",
        tags: ["Link Charts", "side projects"],
        links: [
          { label: "Git", url: "https://git-scm.com" },
          { label: "Conventional Commits", url: "https://www.conventionalcommits.org" },
        ],
      },
      {
        name: "ADRs + Mermaid",
        proof:
          "MADR format; architecture decisions documented in docs/adr/, with versioned diagrams",
        tags: ["Link Charts"],
        links: [
          { label: "ADR", url: "https://adr.github.io" },
          { label: "Mermaid", url: "https://mermaid.js.org" },
        ],
      },
      {
        name: "Web monetization",
        proof: "AdSense Consent Mode v2, Google Ads with conversion tracking, GA4",
        tags: ["Link Charts"],
      },
      {
        name: "Transactional/lifecycle email",
        proof: "Brevo/SendGrid — weekly digest, milestone, winback, onboarding",
        tags: ["Link Charts"],
        links: [
          { label: "Brevo", url: "https://www.brevo.com" },
          { label: "SendGrid", url: "https://www.twilio.com/en-us/sendgrid" },
        ],
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        proof: "Scrum ceremonies, Kanban boards, and Jira backlog management in corporate teams",
        tags: ["G4F", "Basis"],
        links: [
          { label: "Scrum Guide", url: "https://scrumguides.org" },
          { label: "Jira", url: "https://www.atlassian.com/software/jira" },
        ],
      },
      {
        name: "Requirements gathering and documentation",
        proof: "Stakeholder interviews and functional specs for party-management systems",
        tags: ["Ordem Social"],
      },
    ],
  },
];
