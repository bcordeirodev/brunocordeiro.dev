import type { CaseStudy } from "@/domain";

export const caseStudy: CaseStudy = {
  slug: "link-charts",
  title: "Link Charts — end-to-end engineering in production",
  tagline:
    "A URL shortener with advanced analytics that I built and maintain solo, in production since 2025",
  productUrl: "https://linkcharts.com.br",
  chapters: [
    {
      kind: "prose",
      id: "product",
      title: "The product",
      paragraphs: [
        "Link Charts (linkcharts.com.br) is a URL shortener with advanced analytics, in production, that I created and maintain 100% solo. Every click is enriched with geographic, device, temporal and traffic-quality data, shown across 5 dashboards: overview, geographic (choropleth/heatmap), temporal, audience and insights.",
        "In production: authenticated and public shortening, high-performance redirect with Open Graph previews for bots (WhatsApp/Telegram), anti-fraud with a per-click quality score, custom subdomains + link-in-bio page, public API with API keys, QR codes, tags, reports, CSV export, UTM builder, link passwords, expiration/scheduling/click limits, link health checks, retention e-mails and monetization via AdSense + Google Ads.",
        "~1,929 commits across 3 repositories (725 backend, 1,029 frontend, the rest in docs), all mine, from Mar 2025 to Aug 2026 — kept up in concentrated bursts, alongside a full-time job. 50 release tags with independent semver per repository (backend at v2.16.0, frontend at v1.19.0).",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Architecture",
      paragraphs: [
        "Backend: Laravel 12 / PHP 8.2, PostgreSQL 15, Redis 7. Controller → Service → Repository layers with interface-based dependency injection, DTOs and ADRs. The critical /r/{slug} route serves HTML with Open Graph for bots and a 302 redirect for humans; tracking is 100% asynchronous via an idempotent job — no distributed lock: a dedup_key column with a UNIQUE index + insertOrIgnore guarantees a retry never duplicates a click. 10-min link cache; click enrichment in 3 phases (headers → server-side intelligence with viral rank/holidays → anti-fraud quality score).",
        "Frontend: Next.js 15 (App Router) / React 19 / strict TypeScript, MUI 6 with an in-house design system, TanStack Query 5, ISR with cache tags and on-demand revalidation, en/pt-BR i18n, Auth0, CSP/HSTS in middleware, full SEO (JSON-LD, sitemap, llms.txt), 30 ApexCharts chart components and Leaflet maps.",
        "Integration: proxy via rewrites (zero CORS), JWT in an httpOnly cookie (never localStorage), X-Request-Id propagated from the browser all the way to the queue worker for end-to-end log correlation. An in-house SQL dialect layer (SqlDateExpr) centralizes driver-dependent fragments so the test suite runs identically on SQLite and PostgreSQL.",
      ],
      diagram: [
        "Next.js 15 · React 19 · TypeScript",
        "⇅  proxy via rewrites · JWT httpOnly · X-Request-Id",
        "Laravel 12 · PHP 8.2",
        "⇅  async jobs · cache · Redis queue",
        "PostgreSQL 15 · Redis 7",
      ],
    },
    {
      kind: "terminal",
      id: "workflow",
      title: "From commit to merge — the quality gate",
      intro:
        "No merge publishes anything. Before integrating, every push goes through this funnel: local hook + CI running the whole suite twice, on two databases.",
      lines: [
        "$ git checkout -b feat/quality-score",
        '$ git commit -m "feat(analytics): per-click quality score"',
        "$ git push  # pre-push hook: 902 tests in the container, before leaving the machine",
        "▸ ci/validate: pint + phpunit (sqlite :memory:) ........ ok",
        "▸ ci/tests-postgres: the same suite on real postgres 15  ok",
        "▸ ci/quality (front): tsc + eslint 0 warnings + prettier ok",
        "▸ check-build-args: NEXT_PUBLIC_* × Dockerfile ......... ok",
        "✔ merge to main — integrating ≠ publishing; only a tag triggers a deploy",
      ],
    },
    {
      kind: "terminal",
      id: "pipeline",
      title: "Blue/green deploy — 0s of downtime",
      intro:
        "Publishing is an explicit act: pushing a tag. The image builds on the GitHub runner (2m03s — never on the server) and the color swap happens without dropping a request; measured downtime went from ~5min to 0s.",
      lines: [
        "$ git tag v2.16.0 && git push --tags",
        "▸ build: docker multi-stage → ghcr (gha cache) ......... ok",
        "▸ rsync: deploy artifacts only — source never hits the server",
        "▸ warm-up green: backward-compatible migrate + caches .. ok",
        "▸ local health: /health in a loop (up to 30×, 2s) ...... ok",
        "▸ nginx: graceful upstream cutover → green ............. ok",
        "▸ drain blue: 30s of keep-alive → stop ................. ok",
        "▸ public health: 200 measured from the outside (5×) .... ok",
        "✔ v2.16.0 in production — downtime: 0s · rollback = same pipeline, older tag",
      ],
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observability",
      paragraphs: [
        "OpenTelemetry with tail sampling (100% of errors + 100% of slow requests + 10% of the rest) exports traces, metrics and logs through Grafana Alloy — configured as code — to Grafana Cloud. Every trace carries service_version with the deploy SHA: a regression points straight at the release that introduced it.",
        "8 per-domain log channels (redirect, tracking, jobs, auth, http, audit...) with automatic PII redaction and a request_id propagated from the browser to the queue worker. Faro RUM on the frontend mirrors the same build SHA; continuous profiling with Pyroscope/Excimer surfaces hot paths in PHP. 4 dashboards and 9 alert rules versioned as JSON in the repository — nothing hand-configured in the UI.",
        "An external uptime probe runs every 5 minutes outside my own infrastructure and automatically opens a deduplicated incident issue when the service goes down — the safety net for the total outage that internal alerts, by definition, would never see.",
      ],
    },
    {
      kind: "grafana",
      id: "operations",
      title: "Operations in numbers — straight from Grafana",
      intro:
        "A Grafana-style dashboard fed by Grafana Cloud itself: the panels below query the Prometheus API of Link Charts' production monitoring (uptime comes from the external GitHub Actions probe) — no vanity metrics.",
      board: {
        title: "Grafana · linkcharts · production",
        timeRange: "Last 30 days",
        attribution: "data via Grafana Cloud · Prometheus",
        snapshotLabel: "snapshot",
        updatedLabel: "updated",
        footer:
          "1,035/1,035 deploy samples with HTTP 200 · 9 alert rules and 4 dashboards versioned as JSON in the repository — zero UI config",
      },
      panels: {
        uptime: {
          title: "uptime 30d",
          sub: "external probe every 5 min — opens an incident issue on its own",
          source: "GitHub Actions",
        },
        p95: {
          title: "p95 · redirect",
          sub: "critical route /r/{slug}, last 24h",
        },
        errors: {
          title: "5xx errors",
          sub: "share of requests, last 24h",
        },
        reqRate: {
          title: "requests/min",
          sub: "average over the last 24h",
        },
        activity: {
          title: "commits per month",
          sub: "real git history of the Link Charts repositories, Mar 2025–Aug 2026",
        },
      },
    },
    {
      kind: "stats",
      id: "quality",
      title: "Quality",
      items: [
        { label: "PHPUnit tests", value: "902 methods across 133 files (36 unit, 97 feature)" },
        {
          label: "CI database matrix",
          value: "the suite runs 2× per push: SQLite and real PostgreSQL 15",
        },
        {
          label: "Migrations",
          value: "56, zero destructive — MigrationSafetyTest rejects dropColumn in up()",
        },
        { label: "Static analysis", value: "PHPStan/Larastan level 5 with baseline" },
        { label: "E2E", value: "Playwright, 6 projects (320/375/desktop × public/authenticated)" },
        {
          label: "Abuse & resilience",
          value: "16 named rate limiters + IP spoofing and queue retry tests",
        },
      ],
    },
    {
      kind: "prose",
      id: "postmortems",
      title: "Postmortems",
      paragraphs: [
        "Jul 13, 2026: 918 HTTP 502 responses during a deploy under the old model (merge published, build ran on the server itself) — including a real visitor coming from Facebook. That was the trigger to rewrite releases as tag-driven blue/green: warm up the new color, health-check it in a loop, graceful nginx cutover, drain the old color, abort automatically on failure.",
        "A missing build-arg in the Dockerfile compiled the Google Ads conversion labels as empty strings — campaigns ran for weeks spending real money without registering a single conversion, invisible in dev because local builds read .env normally. The answer became a gate: check-build-args.sh compares every NEXT_PUBLIC_* referenced in code against the Dockerfile's ARGs and fails CI if any is missing.",
        "The client IP was spoofable in logs and rate limiters; I fixed it with Cloudflare's real-ip and an automated test (ClientIpSpoofingTest) that keeps the flaw from slipping back in unnoticed.",
        "The best evidence that blue/green works came from a deploy that failed: frontend v1.0.0 broke mid-pipeline (an rsync bug) while an external probe hit the site every 2s — 156 out of 156 samples answered 200. A broken release takes nothing down; it simply never happens.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "How it was built: AI with guardrails",
      paragraphs: [
        "I built Link Charts with a spec-driven, AI-first workflow: brainstorm → design doc → plan → execution, orchestrating multiple agents and subagents in phased runs with a report at every step.",
        "Context as an artifact: a 22KB agent-context file (architecture guide) versioned in the repository guides the agents; ADRs and postmortems feed that context back over time; the frontend publishes llms.txt for LLM-readable content.",
        "Automation with a human in the loop: an in-house command (/ship) automates commit → PR → CI → merge → deploy → health check, with at most 2 self-correction attempts per step — if that doesn't resolve it, it stops with an explicit warning and hands control back to me. The safe-migration rule also stopped being a wiki page and became a test that fails CI.",
        "My thesis: solo dev + AI + strict gates produces company-grade output. The ~1,929 solo commits over 17 months, alongside a full-time job, didn't come at quality's expense: the same 902 tests, PHPStan and zero-warning checks blocked merges the whole time. AI amplifies; the guardrails decide.",
      ],
    },
    {
      kind: "tags",
      id: "stack",
      title: "Full stack",
      groups: [
        {
          label: "Frontend",
          items: [
            "Next.js 15 (App Router)",
            "React 19",
            "strict TypeScript",
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
            "async queues",
            "public API with API keys",
          ],
        },
        {
          label: "Infra",
          items: ["Docker multi-stage", "GHCR", "nginx", "DigitalOcean", "Cloudflare"],
        },
        {
          label: "Observability",
          items: [
            "OpenTelemetry",
            "Grafana Cloud",
            "Grafana Alloy",
            "Faro RUM",
            "Pyroscope",
            "alerts as code",
          ],
        },
        {
          label: "CI/CD",
          items: [
            "GitHub Actions",
            "tag-driven blue/green deploys",
            "rollback via the same pipeline",
          ],
        },
        {
          label: "Quality",
          items: [
            "PHPUnit (902 tests)",
            "PHPStan level 5",
            "Laravel Pint",
            "ESLint 0 warnings",
            "Playwright (6 projects)",
          ],
        },
      ],
    },
  ],
};
