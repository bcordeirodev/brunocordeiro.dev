import type { CaseStudy } from "@/domain";

export const caseStudy: CaseStudy = {
  slug: "link-charts",
  title: "Link Charts — case study",
  tagline:
    "A URL shortener with click analytics that I run solo in production since 2025 — Laravel, Next.js and blue/green deploys by tag",
  productUrl: "https://linkcharts.com.br",
  chapters: [
    {
      kind: "prose",
      id: "product",
      title: "System scope",
      paragraphs: [
        "Every click is enriched with geography, device, time and traffic quality before it is stored, and feeds five analytics dashboards.",
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
      architecture: {
        caption: "The path of one request, from the browser to the queue worker.",
        bands: { clients: "clients", edge: "edge", app: "application", data: "data" },
        clients: {
          browser: { title: "Browser", sub: "dashboards · link-in-bio" },
          bots: { title: "Bots", sub: "WhatsApp · Telegram" },
        },
        edge: {
          cdn: { title: "Cloudflare", sub: "TLS · CDN · client real-ip" },
          proxy: { title: "nginx", sub: "blue/green upstream · zero-downtime cutover" },
        },
        web: {
          title: "Next.js 15 · React 19",
          lines: [
            "App Router · strict TypeScript",
            "ISR with cache tags · TanStack Query",
            "Auth0 · CSP/HSTS in middleware",
            "ApexCharts · Leaflet",
          ],
        },
        api: {
          title: "Laravel 12 · PHP 8.2",
          lines: ["Controller → Service → Repository", "dependency injection · API keys"],
        },
        host: "DigitalOcean · one droplet",
        link: { top: "proxy via rewrites", bottom: "JWT httpOnly · no CORS" },
        hotPath: {
          route: "/r/{slug}",
          sub: "responds before it tracks",
          human: "302 · human",
          bot: "HTML + OG · bot",
        },
        data: {
          db: { title: "PostgreSQL 15", sub: "links · clicks · rollups" },
          cache: { title: "Redis 7", sub: "cache · job queue" },
          worker: { title: "Click worker", sub: "dedup_key with a unique index" },
          writeback: "writes the click — a retry never duplicates",
        },
        trace: "X-Request-Id — propagated from the browser to the queue worker",
        legend: { sync: "synchronous", async: "asynchronous, after the response" },
        scrollHint: "drag sideways to see the whole diagram",
      },
    },
    {
      kind: "terminal",
      id: "workflow",
      title: "CI checks before merge",
      intro:
        "Before integrating, every push goes through a local hook and CI, with the suite running twice on two different databases. A merge publishes nothing: only a tag produces a deploy.",
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
      title: "Blue/green deploy by tag",
      intro:
        "Publishing takes a tag push. The image builds on the GitHub runner in 2m03s, never on the server, and the colour swap happens without dropping a request: measured downtime went from ~5min to 0s.",
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
      deploy: {
        caption: "From branch to colour swap — and why each step works this way.",
        bands: {
          integration: "integration",
          publication: "publication",
          cutover: "cutover",
          decisions: "decisions",
        },
        integration: ["branch", "commit", "push", "CI", "merge"],
        gate: "publication starts here — the trigger is the tag",
        steps: [
          { title: "tag", sub: "v2.16.0, by hand" },
          { title: "build", sub: "GitHub runner · 2m03s" },
          { title: "ghcr", sub: "versioned image" },
          { title: "rsync", sub: "deploy artefacts only" },
        ],
        proxy: { title: "nginx", sub: "graceful upstream cutover" },
        blue: {
          title: "blue · previous version",
          lines: ["stops taking new requests", "finishes the ones still in flight"],
          edge: "drain 30s → stop",
        },
        green: {
          title: "green · new version",
          lines: [
            "warm-up: backward-compatible migrate + caches",
            "/health in a loop, up to 30× every 2s",
          ],
          edge: "fails? it aborts and blue stays up",
        },
        verdict: "1,035/1,035 samples returned HTTP 200 during the cutover — measured downtime: 0s",
        decisions: [
          "build runs on the GitHub runner: the droplet has 2 vCPU and 3.8 GB — compiling there would starve live traffic",
          "rsync ships composes, scripts and config only — source and toolchain never reach the server",
          "the infra stack (postgres, redis, alloy) is left alone: the old deploy took the database down with the app",
          "an online migrate must be backward-compatible; a destructive one goes offline, ~20s, flagged by a test",
          "the health check hits nginx and a Laravel route — a 200 from nginx does not prove PHP-FPM came up",
          "rollback is the same pipeline with the older tag — a separate emergency path would be the least-tested code",
        ],
        legend: { live: "live", draining: "draining" },
        scrollHint: "drag sideways to see the whole diagram",
      },
    },
    {
      kind: "prose",
      id: "observability",
      title: "Observability",
      paragraphs: [
        "OpenTelemetry exports traces, metrics and logs to Grafana Cloud through Grafana Alloy, with tail sampling that keeps 100% of errors and slow requests. Every trace carries the deploy SHA, so a regression points straight at the release that introduced it.",
        "Logs are split into 8 per-domain channels with automatic PII redaction. Faro RUM covers the frontend and Pyroscope continuously profiles the PHP. The 4 dashboards and 9 alert rules live as JSON in the repository; nothing is configured by hand in the UI.",
        "Outside the infrastructure, a probe runs every 5 minutes and opens an incident issue on its own if the service goes down — it covers the total outage, where internal alerts would have nothing left to report from.",
      ],
    },
    {
      kind: "grafana",
      id: "operations",
      title: "Production metrics",
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
      title: "Tests and static analysis",
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
        "A deploy broke mid-pipeline while an external meter hit the site every 2 seconds: 156 out of 156 samples answered 200 — a failing release aborts before the cutover, so the running version is never touched.",
      ],
    },
    {
      kind: "prose",
      id: "ai-guardrails",
      title: "Development with AI agents",
      paragraphs: [
        "I built Link Charts in a spec-driven flow — brainstorm, design doc, plan, execution — using AI agents to write most of the code. A versioned architecture context file guides the agents, and ADRs and postmortems feed that context back over time.",
        "The /ship command goes from commit to deploy with at most two self-correction attempts per step; if that fails, it stops and hands control back to me. A rule that has to hold becomes a CI test, not a wiki page.",
        "That is about 1,929 solo commits in 17 months under the same gates: the 902 tests, PHPStan and the zero-warning limit blocked merges the whole way.",
      ],
    },
    {
      kind: "tags",
      id: "stack",
      title: "Stack",
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
