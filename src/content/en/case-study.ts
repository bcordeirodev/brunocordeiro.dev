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
        "Link Charts is a URL shortener with analytics that I have run alone in production since 2025. Every click is enriched with geography, device, time and traffic-quality data, feeding five analytics dashboards.",
        "Beyond shortening, the product has redirects with Open Graph previews for WhatsApp and Telegram bots, an anti-fraud quality score per click, custom subdomains with a link-in-bio page, a public API, QR codes, reports with CSV export, and link passwords, expiration and scheduling. Monetization comes from AdSense and Google Ads.",
        "That adds up to about 1,929 commits of mine across 3 repositories between March 2025 and August 2026, alongside a full-time job, with 50 releases under independent semver per repository (backend at v2.16.0, frontend at v1.19.0).",
      ],
    },
    {
      kind: "prose",
      id: "architecture",
      title: "Architecture",
      paragraphs: [
        "The backend is Laravel 12 with PostgreSQL 15 and Redis 7, layered into Controller, Service and Repository with dependency injection. The critical /r/{slug} route answers HTML with Open Graph for bots and a 302 for humans; tracking runs afterwards in an idempotent async job, where a dedup_key column with a unique index guarantees a retry never duplicates a click.",
        "The frontend is Next.js 15 with React 19 and strict TypeScript, TanStack Query, ISR with cache tags, two-language i18n, Auth0 and CSP/HSTS in middleware. Charts use ApexCharts; maps use Leaflet.",
        "Integration goes through rewrite proxying, with no CORS, JWT in an httpOnly cookie and X-Request-Id propagated from the browser to the queue worker to correlate logs end to end.",
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
        "OpenTelemetry exports traces, metrics and logs to Grafana Cloud through Grafana Alloy, with tail sampling that keeps 100% of errors and slow requests. Every trace carries the deploy SHA, so a regression points straight at the release that introduced it.",
        "Logs are split into 8 per-domain channels with automatic PII redaction. Faro RUM covers the frontend and Pyroscope continuously profiles the PHP. The 4 dashboards and 9 alert rules live as JSON in the repository; nothing is configured by hand in the UI.",
        "Outside the infrastructure, a probe runs every 5 minutes and opens an incident issue on its own if the service goes down — the safety net for the outage internal alerts would never see.",
      ],
    },
    {
      kind: "grafana",
      id: "operations",
      title: "Operations in numbers — straight from Grafana",
      intro:
        "The panels below consume the Prometheus API of my Grafana Cloud workspace, the same one monitoring Link Charts in production. When the API is unreachable, a panel degrades to a versioned snapshot and says so in its badge. Uptime comes from the external GitHub Actions probe.",
      board: {
        title: "Grafana · linkcharts · production",
        timeRange: "Last 30 days",
        attribution: "data via Grafana Cloud · Prometheus",
        snapshotLabel: "snapshot",
        liveLabel: "live · Prometheus",
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
          source: "git log",
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
        "In July 2026, a deploy under the old model, built on the server itself, returned 918 HTTP 502 responses — one of them to a real visitor. That was the trigger to rewrite releases as tag-driven blue/green, with warm-up, health checks in a loop and automatic abort on failure.",
        "A missing build-arg in the Dockerfile compiled the Google Ads conversion labels as empty strings, and campaigns ran for weeks without registering a conversion. The fix became a CI gate: a script compares the NEXT_PUBLIC_* used in code against the Dockerfile's ARGs and blocks the build if any is missing.",
        "The client IP was spoofable in logs and rate limiters. I fixed it with Cloudflare's real-ip and left an automated test so the flaw can't slip back in unnoticed.",
        "The best evidence for blue/green came from a deploy that broke mid-pipeline while an external meter hit the site every 2 seconds: 156 out of 156 samples answered 200. A broken release doesn't take the site down; it just never happens.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "How it was built: AI with guardrails",
      paragraphs: [
        "I built Link Charts in a spec-driven flow — brainstorm, design doc, plan, execution — using AI agents to write most of the code. A versioned architecture context file guides the agents, and ADRs and postmortems feed that context back over time.",
        "The automation has brakes: the /ship command goes from commit to deploy with at most two self-correction attempts per step; if that fails, it stops and hands control back to me. Important rules become CI tests instead of wiki pages.",
        "The result is about 1,929 solo commits in 17 months without trading away quality: the same 902 tests, PHPStan and zero warnings gated every merge.",
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
