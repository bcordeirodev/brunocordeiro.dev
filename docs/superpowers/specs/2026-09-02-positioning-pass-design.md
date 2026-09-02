# Positioning pass — English-first hero, section order and identity

**Date:** 2026-09-02
**Status:** approved (pending spec review)

## Problem

The site was reviewed against a concrete goal: land interviews for
mid-level, remote, international roles. Against that goal the current home
page has five gaps:

1. **It lands in Portuguese.** `defaultLocale` is `pt` with browser detection
   off (`src/i18n/routing.ts`), so an international recruiter who types the
   domain gets Portuguese and has to find the locale switcher.
2. **"Senior" is still the indexed identity.** The hero says "Full Stack
   Engineer", but `profile.role` is "Senior Full Stack Engineer" and feeds the
   tab title, OG image, JSON-LD `jobTitle`, manifest and CV PDF. Bruno is
   applying without the "Senior" marker; the site contradicts that.
3. **The hero does not say what he is looking for.** No availability line, no
   "open to remote international roles". The recruiter has to guess.
4. **Inventory comes before proof.** Order today is Hero → Stack → Link Charts
   card → Experience → Education → AI → GitHub → Contact. The strongest
   evidence (a production system he operates alone, public code) sits below
   ~70 skill entries.
5. **GitHub is a text link.** Public code plus a product in production is the
   differentiator; the hero shows "GitHub" as a plain mono link.

This slice fixes those five. Skill-proof rewrites, the "engineering problems"
section, experience contributions, AI-section demotion and case-study changes
are later slices with their own specs.

## Decisions (approved by Bruno on 2026-09-02)

- International reader is the primary audience; Portuguese stays as the
  secondary locale with full content parity.
- English becomes the default (landing) locale.
- "Senior"/"Sênior" leaves `profile.role` and the meta descriptions in both
  locales. Role becomes **"Full Stack Engineer"** (same string as the
  standardized timeline title, not "Full Stack Software Engineer").
- English level is published as **B1, approaching B2** — not B2.

## Design

### 1. Default locale → `en`

| File                  | Change                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/i18n/routing.ts` | `defaultLocale: "en"`. Keep `localePrefix: "always"` and `localeDetection: false`, so `/pt/...` URLs keep working unchanged and `/` redirects to `/en`.      |
| `src/lib/site.ts`     | `defaultLocale = "en"` → `x-default` hreflang points to `/en...`. `sitemap.ts` reads `lastModified` from the default locale content; no change needed there. |
| `src/app/page.tsx`    | `redirect("/en")`.                                                                                                                                           |
| `src/app/manifest.ts` | `start_url: "/en"`, `name: "Bruno Cordeiro — Full Stack Engineer"`.                                                                                          |

Tests to update: `src/lib/site.test.ts` (x-default), `src/app/sitemap.test.ts`
(entries still contain both locales; assertions that name `/pt` as the "home"
entry move to `/en`), `e2e/home.spec.ts` (root redirect → `/en`; page entry
`/en`), `e2e/case-study.spec.ts` (entry `/en`, expect `/en/link-charts`),
`e2e/a11y.spec.ts` (list becomes `/en`, `/pt`, `/en/link-charts`, `/en/cv`).

### 2. Identity without "Senior"

`src/content/{pt,en}/profile.ts`:

| Field             | en                                                                                                                                                               | pt                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `role`            | Full Stack Engineer                                                                                                                                              | Full Stack Engineer                                                                                                                                                |
| `headline`        | Full Stack Engineer (unchanged)                                                                                                                                  | Full Stack Engineer (unchanged)                                                                                                                                    |
| `metaDescription` | Full Stack Engineer in Brazil — 10+ years building and operating production systems with TypeScript, Node.js, React, CI/CD and Kubernetes. Open to remote roles. | Full Stack Engineer em Brasília — 10+ anos construindo e operando sistemas em produção com TypeScript, Node.js, React, CI/CD e Kubernetes. Aberto a vagas remotas. |

Both descriptions must stay within the 80–170 character budget enforced by
`content.test.ts` (verify at implementation time; trim if needed).

`profile.role` propagates to: `[locale]/layout.tsx` title,
`opengraph-image.tsx`, `person-json-ld.tsx`, `cv-document.tsx`,
`cv-preview.tsx`. No component change required.

**Pre-existing working-tree change (not part of this slice):** three CV files
(`cv-document.tsx`, `cv-preview.tsx`, `cv-preview.test.tsx`) currently swap
`profile.role` for `profile.headline` to hide "Senior" in the PDF. With this
slice `role === headline`, so the swap becomes redundant. Those files are left
untouched and out of this slice's commits; Bruno decides whether to commit or
drop them.

### 3. Hero

New `Profile` fields (zod, `src/domain/profile.ts`):

```ts
pitch: z.string().min(1),        // one-paragraph positioning statement
availability: z.string().min(1), // "10+ years · Brasília, Brazil (UTC−3) · Open to remote international roles"
```

`subheadline` is replaced by `pitch` (rename, not addition — one positioning
sentence, not two). Consumers to update: `hero.tsx`, `lib/cv/build-cv-data.ts`
(the CV summary section reads it) and its test.

Content:

| Field          | en                                                                                                                                                                               | pt                                                                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pitch`        | I build and operate production systems from the first commit to deployment — backend architecture, reliable APIs and zero-downtime delivery, mostly with TypeScript and Node.js. | Construo e opero sistemas em produção do primeiro commit ao deploy — arquitetura de backend, APIs confiáveis e entregas sem downtime, principalmente com TypeScript e Node.js. |
| `availability` | 10+ years of experience · Brasília, Brazil (UTC−3) · Open to remote international roles                                                                                          | 10+ anos de experiência · Brasília, Brasil (UTC−3) · Aberto a vagas remotas internacionais                                                                                     |

Hero layout (`src/components/sections/hero.tsx`), top to bottom:

1. `h1` name — unchanged, stays outside `Reveal` (LCP).
2. Role line: `{profile.role} · {profile.location}` — mono, muted (as today).
3. Stack line: `profile.stackHighlights.join(" · ")` — mono, muted, directly
   under the role. The hardcoded ten-item `STACK_LINE` constant is deleted;
   the OG image and the hero now share one source (`stackHighlights`, max 6
   entries, ≤18 chars each, already enforced by the schema).
4. `pitch` — `text-lg`, `max-w-2xl`.
5. `availability` — mono, small, muted. This is the "open to" line.
6. Actions row: Download CV (primary button, unchanged) · **View my code on
   GitHub →** (secondary/outline button, new) · LinkedIn (existing mono link)
   · Copy email (unchanged).
7. Facts line: existing `profile.metrics` line + "data as of" — unchanged,
   moves below the actions so proof follows the pitch and the CTAs.

New message key `common.viewCode`: en "View my code on GitHub", pt "Ver meu
código no GitHub". `SocialLinks` stays as is for Contact; the hero renders the
GitHub button itself and passes only `linkedin` to a LinkedIn link (either a
new `linkedinOnly` usage or inline anchor — implementer's choice, keep it to
one component).

### 4. Languages line

`profile.languages`:

- en: `Portuguese — native · English — B1, approaching B2`
- pt: `Português — nativo · Inglês — B1, quase B2`

Consumers unchanged: `contact.tsx`, `cv-preview.tsx`, `cv-document.tsx`.
(`person-json-ld.tsx` does not map languages.)

### 5. Section order, anchors and nav

`src/app/[locale]/page.tsx` order:

1. Hero
2. Link Charts card (`CaseStudyCard`)
3. Featured projects (`RepoGrid`) — `id="projects"`
4. Experience (`Timeline`) — `id="experience"`
5. Stack (`SkillMatrix`) — `id="stack"`
6. Education & certifications
7. AI agent usage — `id="ai"` (content untouched in this slice)
8. Contact — `id="contact"`

Anchor ids move from Portuguese (`trajetoria`, `contato`, `ia`) to English
(`experience`, `contact`, `ai`). Known references: `site-header.tsx`,
`link-charts/page.tsx` ("back to contact" link → `/#contact`), and the
comment in `timeline.tsx`.

Header nav (`site-header.tsx`): Projects (`/#projects`) · Link Charts
(`/link-charts`) · Experience (`/#experience`) · Stack (`/#stack`) · Contact
(`/#contact`). New message key `nav.projects` (en "Projects", pt "Projetos").
`sections.githubProjects` heading becomes en "featured projects", pt
"projetos em destaque".

Featured projects grid (`src/services/github/core.ts`):

- Pinned repos are sliced to the first **3** (the GraphQL query can stay at
  `first: 6`; slice after fetch so the dialog logic is unaffected).
- `SHOWCASE_REPOS` fallback becomes `["medFlow", "lawyer-hero-envato",
"print-shop-manager"]`.
- `allRepos` and the "see all N projects" dialog are untouched.
- `src/content/github-snapshot.ts` `repos` trimmed to the same three (keep
  `allRepos` as is).

## Testing

- Unit: update `site.test.ts`, `sitemap.test.ts`, `content.test.ts` (schema
  now requires `pitch` and `availability`; `subheadline` removed), any hero
  or CV tests that reference `subheadline`, github core test for the slice
  to 3.
- E2E: `home.spec.ts`, `case-study.spec.ts`, `a11y.spec.ts` as listed in §1;
  add one assertion that the hero shows the availability line and the
  "View my code on GitHub" link.
- Gates before done: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
  `pnpm test`, `pnpm e2e` (dev server on a free port ≥ 3001, per project
  convention).

## Out of scope

- Any change to `skills.ts`, `experiences.ts`, `case-study.ts` content.
- The AI section's numbers and layout.
- Visual redesign of any component beyond the hero's button row.
- The uncommitted CV headline swap described in §2.
