# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary readers, with equal priority (confirmed by Bruno on 2026-11-22; this widens the 2026-09-02 decision that put the international recruiter alone in first place). Both work at international companies hiring for a remote full stack role.

- **The recruiter** does a first-pass screen. They need role, stack, availability and a way to make contact, without reading the technical depth.
- **The tech lead** evaluates the engineering. They read code and architecture decisions, and they check claims against the public repositories before they believe them.

Every page has to work for both: a quick scan that answers the recruiter, and depth that holds up when the tech lead looks closer.

Portuguese-speaking readers are served by the `pt` locale, which has full content parity with `en`.

## Product Purpose

brunocordeiro.dev is the personal site of Bruno Cordeiro, a Full Stack Engineer in Brasília, Brazil. It exists to land interviews for remote international roles.

The site worked when the visitor contacts him, by LinkedIn or email. LinkedIn is the primary action in the hero (Bruno's choice, 2026-11-22). Downloading the CV and reading the case study are steps toward that, not the goal.

## Positioning

A full stack engineer with 10+ years in production, across this stack, in this order of emphasis (confirmed by Bruno on 2026-11-22):

1. Laravel (PHP)
2. Node.js with NestJS
3. React and Next.js
4. Angular 22, with less focus than before

Facts that support it:

- Laravel applications kept in production since 2017.
- A large-scale public-sector platform used across 90+ service units.
- Link Charts, a product he builds and operates alone, with public source code.
- Range from application code to CI/CD pipelines and infrastructure with Docker and Kubernetes.

The site copy follows this order since 2026-11-22: hero stack chips, `pitch`, meta description and Open Graph image. The `pitch` is Bruno's own first-person text, so he decides its wording.

## Operating Context

- `/en` (default) and `/pt`: the home page. Section order since 2026-09-18: hero, experience, featured projects, stack, Link Charts case study card, education and certifications, AI-assisted engineering, contact.
- `/[locale]/link-charts`: the Link Charts case study, with architecture, pipeline and deploy diagrams.
- `/[locale]/cv`: a CV builder that lets the visitor select content and export a PDF.
- GitHub data is fetched live with caching and falls back to a static snapshot. The Grafana board is a snapshot, not live.
- Deployed on Vercel. CI runs typecheck, lint, format check, unit tests, build, end-to-end tests and a Lighthouse budget on every push and pull request to `main`.

## Capabilities and Constraints

- **Bilingual with parity.** `en` and `pt` keep the same structure and counts; tests enforce it. Edit both locales together.
- **Typed content.** All copy lives in `src/content/{en,pt}` and is validated against `src/domain`. Several fields have character budgets enforced by tests (for example the meta description, 80 to 170 characters).
- **Role is exactly "Full Stack Engineer"** in both locales. No "Senior" label anywhere; a test guards it.
- **Public-sector client work is confidential.** Projects for that client are never named; only generic descriptions are used. A leak check in the tests enforces it.
- **Private data stays private.** Phone number and home address are never published.
- **English level** is stated once, as a fact, in `profile.languages`. It is not repeated in the pitch or hero.
- **Link Charts claims are checked at the source.** Any step, number or justification about its pipeline or deploy is verified against the workflows and scripts in the public `linkchart-backend` and `linkchart-frontend` repositories before it is published.
- **Undecided:** more detailed contributions for the public-sector role are not published until confidentiality is confirmed.

## Brand Commitments

- Name: Bruno Cordeiro. Domain: brunocordeiro.dev.
- Voice: first person, factual, plain. The `pitch` is written by Bruno and his voice is preserved when it is edited.
- Seniority appears as a fact ("10+ years"), never as a label. The hiring company decides the level.
- Availability line: "Open to remote international roles · UTC−3". It does not repeat facts the hero already shows.

## Evidence on Hand

- Profile, experience, skills, education and certifications: `src/content/{en,pt}/`.
- Link Charts case study: `src/content/{en,pt}/case-study.ts`, with live repository numbers and a snapshot fallback in `src/content/linkcharts-stats-snapshot.ts`.
- Public code: the GitHub profile `bcordeirodev`, including this site's repository and the two Link Charts repositories.
- GitHub activity and Grafana snapshots: `src/content/github-snapshot.ts`, `src/content/grafana-snapshot.ts`.
- AI-assisted engineering statistics: `src/content/ai-stats.ts`.
- A generated CV in PDF: `src/components/cv/`.

Not available, and not to be invented: testimonials, client names or logos, a portrait photo, salary or rate information, and any metric that cannot be traced to a source above.

## Product Principles

1. **Proof before inventory.** Show work that can be checked before listing technologies.
2. **Every claim is verifiable.** A number or a step is published only when a reader could confirm it in public code or a cited source.
3. **Facts, not labels.** Years, systems and scale describe the engineer; adjectives and titles do not.
4. **One clear next step.** Every page makes it easy to contact him.
5. **Confidentiality outranks detail.** When a fact about client work is in doubt, it stays out.

## Accessibility & Inclusion

- CI gate: Lighthouse accessibility and best practices at 95 or above.
- End-to-end accessibility scans with axe-core on mobile, tablet and desktop viewports.
- Motion respects `prefers-reduced-motion`.
- No formal WCAG conformance level has been declared.
