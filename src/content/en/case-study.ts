import type { CaseStudy } from "@/domain";

export const caseStudy: CaseStudy = {
  slug: "link-charts",
  title: "Link Charts — end-to-end engineering in production",
  tagline: "A URL shortener with advanced analytics, 100% authored solo, in production since 2025",
  productUrl: "https://linkcharts.com.br",
  chapters: [
    {
      kind: "prose",
      id: "product",
      title: "The product",
      paragraphs: [
        "Link Charts (linkcharts.com.br) is a URL shortener with advanced analytics, in production, built and maintained 100% solo by Bruno. Every click is enriched with geographic, device, temporal, and traffic-quality data, shown across 5 dashboards: overview, geographic (choropleth/heatmap map), temporal, audience, and insights.",
        "In production: authenticated and public shortening, high-performance redirects with Open Graph previews for bots (WhatsApp/Telegram), anti-fraud with a per-click quality score, custom subdomains + link-in-bio pages, a public API with API keys, QR codes, tags, reports, CSV export, a UTM builder, link passwords, expiration/scheduling/click limits, link health checks, retention emails, and monetization via AdSense + Google Ads.",
        "~1,929 commits across 3 repositories (backend, frontend, docs), 100% authored solo, from Mar/2025 to Aug/2026 — continuous activity, kept up alongside a full-time job. 50 release tags with independent semver versioning per repository.",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Architecture",
      paragraphs: [
        "Backend: Laravel 12 / PHP 8.2, PostgreSQL 15, Redis 7. Controller → Service → Repository layers with dependency injection by interface, DTOs, and ADRs. The critical /r/{slug} route serves Open Graph HTML to bots and a 302 redirect to humans; tracking is 100% asynchronous through an idempotent job (dedup_key UNIQUE); a 10-minute link cache; click enrichment in 3 phases (headers → server-side intelligence with viral rank/holidays → anti-fraud quality score).",
        "Frontend: Next.js 15 (App Router) / React 19 / strict TypeScript, MUI 6 with a custom design system, TanStack Query 5, ISR with cache tags and on-demand revalidation, en/pt-BR i18n, Auth0, CSP/HSTS in middleware, full SEO (JSON-LD, sitemap, llms.txt), 30 ApexCharts chart components and Leaflet maps.",
        "Integration: rewrite-based proxying (zero CORS), JWT in an httpOnly cookie (never localStorage), X-Request-Id propagated from the frontend to the queue worker for end-to-end log correlation.",
      ],
    },
    {
      kind: "terminal",
      id: "pipeline",
      title: "Blue/green deploy — 0s of downtime",
      intro: "Every tagged release runs this flow; measured downtime dropped from ~5min to 0s.",
      lines: [
        "$ git tag v1.50.0 && git push --tags",
        "▸ ci: 902 tests (sqlite + postgres 15) ......... ok",
        "▸ build: docker multi-stage → ghcr.io .......... ok",
        "▸ deploy: warm-up green ........................ ok",
        "▸ health-check: 200 in loop (12/12) ............ ok",
        "▸ nginx: graceful cutover → green .............. ok",
        "▸ drain blue (30s) → stop ...................... ok",
        "✔ release v1.50.0 in production — downtime: 0s",
      ],
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observability",
      paragraphs: [
        "OpenTelemetry (SDK 1.14, auto-instrumentation for Laravel/PDO/Guzzle, tail sampling: 100% of errors + 100% of slow requests + 10% of the rest) exports traces, metrics, and logs through Grafana Alloy to Grafana Cloud.",
        "Faro RUM on the frontend captures real user performance; continuous profiling with Pyroscope/Excimer identifies backend hot paths. 4 dashboards and 9 alert rules versioned as code — not configured by hand in the UI.",
        "An external uptime probe runs every 5 minutes and automatically opens an incident issue when the service goes down — operations start before Bruno notices the problem.",
      ],
    },
    {
      kind: "stats",
      id: "quality",
      title: "Quality",
      items: [
        { label: "PHPUnit tests", value: "~902 (unit, feature, snapshot, characterization)" },
        { label: "Database matrix in CI", value: "In-memory SQLite and real PostgreSQL 15" },
        { label: "Static analysis", value: "PHPStan/Larastan level 5 with baseline" },
        { label: "E2E", value: "Playwright multi-viewport (320/375/desktop, 6 projects)" },
        { label: "Frontend lint", value: "ESLint 9 flat config, --max-warnings=0 as a gate" },
        { label: "Security tests", value: "IP spoofing, rate limiting, queue retry" },
      ],
    },
    {
      kind: "prose",
      id: "postmortems",
      title: "Postmortems",
      paragraphs: [
        "918 HTTP 502 responses during deploys drove a rewrite of the release process into a zero-downtime blue/green flow — warm-up of the new color, health checks in a loop, graceful nginx cutover, a 30s drain of the old color, and automatic abort on failure.",
        "A --build-arg bug silently zeroed out Google Ads conversion tracking in production; the postmortem produced an automated CI guard (check-build-args.sh) that blocks releases with missing build args.",
        "Client IP was spoofable in logs and rate limiters; the fix uses Cloudflare's real-ip header, backed by an automated test (ClientIpSpoofingTest) that guarantees the gap never slips by unnoticed again.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "How it was built: AI with guardrails",
      paragraphs: [
        "Link Charts was built with an AI-first, spec-driven workflow: brainstorm → design doc → plan → execution, with orchestration of multiple agents and subagents and phased execution with a report at each step.",
        "Context as an artifact: a 22KB CLAUDE.md versioned in the repository documents the architecture for agents; ADRs and postmortems feed that context over time; the frontend exposes llms.txt for LLM-readable content.",
        "The thesis: solo dev + AI + strict gates produces enterprise-grade output. The pace of ~1,929 solo commits in 17 months — kept up alongside a full-time job — didn't come at the cost of quality: the same ~902 tests, PHPStan, and zero-warnings checks kept blocking merges the whole time. AI amplifies; the guardrails guarantee.",
      ],
    },
    {
      kind: "stats",
      id: "stack",
      title: "Full stack",
      items: [
        {
          label: "Frontend",
          value: "Next.js 15, React 19, strict TypeScript, MUI 6, TanStack Query 5",
        },
        { label: "Backend", value: "Laravel 12, PHP 8.2, PostgreSQL 15, Redis 7" },
        { label: "Infra", value: "Docker multi-stage, GHCR, nginx, DigitalOcean, Cloudflare" },
        { label: "Observability", value: "OpenTelemetry, Grafana Cloud, Faro RUM, Pyroscope" },
        { label: "CI/CD", value: "GitHub Actions, tag-based blue/green deploy" },
        { label: "Quality", value: "PHPUnit, PHPStan, ESLint, Playwright" },
      ],
    },
  ],
};
