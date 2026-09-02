# Positioning Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home page land in English, drop "Senior" from the indexed identity, rewrite the hero around a pitch + availability line + GitHub CTA, and put proof (Link Charts, featured repos) before the stack inventory.

**Architecture:** Content-first: the `Profile` zod schema gains `pitch` and `availability` (replacing `subheadline`); pt/en content files change together (parity is test-enforced); components read the new fields. The locale flip is three constants plus tests. Section order is a reorder inside `src/app/[locale]/page.tsx` with English anchor ids. Featured repos shrink to three in the GitHub service.

**Tech Stack:** Next.js 16 App Router, next-intl 4, zod 4, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-02-positioning-pass-design.md`

## Global Constraints

- Conversation with the user is in English; **code comments, commit messages and product copy follow project convention**. Existing comments and test names are in Portuguese — keep writing them in Portuguese.
- Commit messages: Conventional Commits, lowercase imperative subject under 72 chars, no period, **no AI/Claude/Anthropic references and no Co-Authored-By trailer**.
- pt and en content must stay in structural parity (`src/content/content.test.ts` enforces it). Every content change is made in both `src/content/pt/*.ts` and `src/content/en/*.ts`.
- `profile.role` must be exactly `Full Stack Engineer` in both locales (no "Senior"/"Sênior").
- `profile.languages`: en `Portuguese — native · English — B1, approaching B2`; pt `Português — nativo · Inglês — B1, quase B2`.
- `metaDescription` length must stay within 80–170 characters (test-enforced).
- Never run `git add .` / `git add -A`. Stage explicit paths only. **Do not stage or modify** `src/components/cv/cv-document.tsx`, `src/components/cv/cv-preview.tsx`, `src/components/cv/cv-preview.test.tsx` — they carry a pre-existing, uncommitted change that is not part of this slice.
- Known side effect of the above: the uncommitted `cv-preview.test.tsx` asserts `queryByText(content.profile.role)` is absent. After Task 2 (`role === headline`), that one assertion fails. It is not a regression from this plan; report it, do not "fix" it by editing that file.
- Dev/e2e server: never port 3000. `playwright.config.ts` already uses 3001 locally.
- Before each `pnpm test` / `pnpm e2e`, run `git status --short` and confirm only the files of the current task (plus the three pre-existing CV files) are modified.

---

### Task 1: English becomes the default locale

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/lib/site.ts:6`
- Modify: `src/app/page.tsx`
- Modify: `src/app/manifest.ts`
- Modify: `playwright.config.ts` (webServer url)
- Test: `src/lib/site.test.ts`, `src/app/sitemap.test.ts`, `e2e/home.spec.ts`, `e2e/case-study.spec.ts`, `e2e/a11y.spec.ts`

**Interfaces:**
- Produces: `defaultLocale` in `src/lib/site.ts` is `"en"`; root `/` redirects to `/en`.

- [ ] **Step 1: Update the unit tests to expect `en` as x-default and home entry**

In `src/lib/site.test.ts`, change the first test:

```ts
  it("emite pt, pt-BR, en e x-default (en é o locale padrão)", () => {
    const alt = languageAlternates("");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt`);
    expect(alt["en"]).toBe(`${SITE_URL}/en`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/en`);
  });
```

In `src/app/sitemap.test.ts`, replace the whole file:

```ts
import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { getContent } from "@/content";

describe("sitemap", () => {
  it("usa lastModified estável derivado de asOfYm", () => {
    const expected = `${getContent("en").profile.asOfYm}-01`;
    for (const entry of sitemap()) expect(entry.lastModified).toBe(expected);
  });
  it("cobre home, link-charts e cv nos dois locales com alternates pt/en", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://brunocordeiro.dev/pt");
    expect(urls).toContain("https://brunocordeiro.dev/pt/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/pt/cv");
    expect(urls).toContain("https://brunocordeiro.dev/en");
    expect(urls).toContain("https://brunocordeiro.dev/en/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/en/cv");
    const home = entries.find((e) => e.url === "https://brunocordeiro.dev/en");
    expect(home?.alternates?.languages).toHaveProperty("pt");
    expect(home?.alternates?.languages).toHaveProperty("pt-BR");
    expect(home?.alternates?.languages).toHaveProperty("en");
    expect(home?.alternates?.languages).toHaveProperty(
      "x-default",
      "https://brunocordeiro.dev/en",
    );
  });
});
```

- [ ] **Step 2: Run the two test files and confirm the x-default assertions fail**

Run: `pnpm vitest run src/lib/site.test.ts src/app/sitemap.test.ts`
Expected: FAIL — `x-default` still resolves to `/pt`.

- [ ] **Step 3: Flip the default locale in routing and site helpers**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "en",
  localePrefix: "always",
  // en é o locale de entrada (público-alvo internacional), sem detecção
  // pelo idioma do navegador; o visitante troca para /pt pelo switcher.
  // Prefixo sempre presente: todas as URLs /pt/... seguem válidas.
  localeDetection: false,
});
```

`src/lib/site.ts` line 6:

```ts
export const defaultLocale: Locale = "en";
```

`src/app/page.tsx`:

```ts
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
```

`src/app/manifest.ts` — change only the two fields:

```ts
    name: "Bruno Cordeiro — Full Stack Engineer",
    short_name: "Bruno Cordeiro",
    start_url: "/en",
```

- [ ] **Step 4: Run the unit tests again**

Run: `pnpm vitest run src/lib/site.test.ts src/app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 5: Update the e2e specs and the Playwright health URL**

`playwright.config.ts`, inside `webServer`:

```ts
    url: `http://localhost:${PORT}/en`,
```

`e2e/home.spec.ts` — replace the whole file:

```ts
import { expect, test } from "@playwright/test";

test("home en renderiza seções e troca de tab", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/bruno/i);
  await page.getByRole("tab", { name: /backend/i }).click();
  // Scoped to the active tabpanel: all 5 skill categories are kept mounted
  // in the DOM for SEO (see skill-matrix.tsx), and "Laravel 12" also appears
  // in the Backend panel's PHP proof text, so an unscoped
  // getByText().first() could match a hidden element elsewhere.
  // getByRole("tabpanel") only resolves the visible panel because inactive
  // panels carry the `hidden` attribute, which removes them (and their
  // text) from the accessibility tree Playwright queries.
  await expect(page.getByRole("tabpanel").getByText("Laravel 12").first()).toBeVisible();
});

test("switcher troca para /pt", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: /^pt$/i }).click();
  await expect(page).toHaveURL(/\/pt/);
});

test("raiz redireciona para /en", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});
```

`e2e/case-study.spec.ts` — replace the whole file:

```ts
import { expect, test } from "@playwright/test";

test("navega do card do case study até /en/link-charts e verifica capítulo pipeline", async ({
  page,
}) => {
  await page.goto("/en");
  await page.getByRole("link", { name: /read the full case study/i }).click();
  await expect(page).toHaveURL(/\/en\/link-charts$/);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Link Charts");

  const pipelineChapter = page.locator("#pipeline");
  await expect(pipelineChapter).toBeVisible();
  await expect(
    pipelineChapter.getByRole("heading", { name: /blue\/green deploy by tag/i }),
  ).toBeVisible();

  const externalLink = page.getByRole("link", { name: /linkcharts\.com\.br/i });
  await expect(externalLink).toHaveAttribute("href", "https://linkcharts.com.br");
  await expect(externalLink).toHaveAttribute("target", "_blank");
});
```

`e2e/a11y.spec.ts` line 4:

```ts
for (const path of ["/en", "/pt", "/en/link-charts", "/en/cv"]) {
```

- [ ] **Step 6: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both clean.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/routing.ts src/lib/site.ts src/app/page.tsx src/app/manifest.ts playwright.config.ts src/lib/site.test.ts src/app/sitemap.test.ts e2e/home.spec.ts e2e/case-study.spec.ts e2e/a11y.spec.ts
git commit -m "feat(i18n): make english the default landing locale"
```

---

### Task 2: Profile identity — role without Senior, pitch, availability, languages

**Files:**
- Modify: `src/domain/profile.ts`
- Modify: `src/content/en/profile.ts`, `src/content/pt/profile.ts`
- Modify: `src/lib/cv/build-cv-data.ts:37`
- Modify: `src/components/sections/hero.tsx:43` (only the `subheadline` → `pitch` reference; full hero rewrite is Task 3)
- Test: `src/content/content.test.ts`, `src/lib/cv/build-cv-data.test.ts`

**Interfaces:**
- Produces: `Profile.pitch: string`, `Profile.availability: string`; `Profile.subheadline` no longer exists. `profile.role === "Full Stack Engineer"` in both locales.

- [ ] **Step 1: Add a content guard test for the new identity rules**

Append inside the `describe("conteúdo", …)` block of `src/content/content.test.ts`:

```ts
  it("perfil posiciona sem marcador de senioridade e com disponibilidade", () => {
    for (const locale of locales) {
      const { profile } = getContent(locale);
      expect(profile.role).toBe("Full Stack Engineer");
      expect(profile.metaDescription).not.toMatch(/s[eê]nior/i);
      expect(profile.pitch.length).toBeGreaterThan(40);
      expect(profile.availability).toMatch(/remot/i);
      expect(profile.languages).toMatch(/B1/);
      // nível publicado é B1 (quase B2), nunca "— B2" como nível principal
      expect(profile.languages).not.toMatch(/—\s*B2\b/);
    }
  });
```

(`locales` and `getContent` are already imported at the top of that file.)

- [ ] **Step 2: Update the CV data test to read `pitch`**

`src/lib/cv/build-cv-data.test.ts` line 11:

```ts
    expect(data.summary).toBe(content.profile.pitch);
```

- [ ] **Step 3: Run the two test files and confirm they fail**

Run: `pnpm vitest run src/content/content.test.ts src/lib/cv/build-cv-data.test.ts`
Expected: FAIL — typecheck errors on `pitch`/`availability`, role still "Senior Full Stack Engineer".

- [ ] **Step 4: Change the schema**

`src/domain/profile.ts` — replace the `subheadline` line and add the two fields:

```ts
export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  pitch: z.string().min(1), // uma frase de posicionamento (hero + resumo do CV)
  availability: z.string().min(1), // ex.: "10+ anos · Brasília, Brasil (UTC−3) · Aberto a vagas remotas internacionais"
  metaDescription: z.string().min(80).max(170), // description SERP/OG — alvo ~150 chars, com keywords da stack
  stackHighlights: z.array(z.string().min(1).max(18)).min(3).max(6), // chips da OG image (≤18 chars cabem no card)
  role: z.string().min(1), // ex.: "Full Stack Engineer" — cargo indexável, sem marcador de senioridade
  languages: z.string().min(1), // ex.: "Português — nativo · Inglês — B1, quase B2"
  location: z.string().min(1), // "Brasília-DF, Brasil" — NUNCA endereço completo
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
  metricsAsOf: z.string().min(1),
  asOfYm: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), // mês de referência, ex.: "2026-08"
  metrics: z.array(metricSchema).min(3).max(4),
});
```

- [ ] **Step 5: Rewrite both profile content files**

`src/content/en/profile.ts`:

```ts
import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  pitch:
    "I build and operate production systems from the first commit to deployment — backend architecture, reliable APIs and zero-downtime delivery, mostly with TypeScript and Node.js.",
  availability: "10+ years of experience · Brasília, Brazil (UTC−3) · Open to remote international roles",
  metaDescription:
    "Full Stack Engineer in Brazil — 10+ years building and operating production systems with TypeScript, Node.js, React, CI/CD and Kubernetes. Open to remote roles.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Full Stack Engineer",
  languages: "Portuguese — native · English — B1, approaching B2",
  location: "Brasília-DF, Brazil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "Aug/2026",
  asOfYm: "2026-08",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "years of experience" },
    { id: "tests", value: 902, suffix: "", label: "tests gating CI" },
    { id: "downtime", value: 0, suffix: "s", label: "of deploy downtime" },
    { id: "releases", value: 50, suffix: "", label: "releases since Mar 2025" },
  ],
};
```

`src/content/pt/profile.ts`:

```ts
import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  pitch:
    "Construo e opero sistemas em produção do primeiro commit ao deploy — arquitetura de backend, APIs confiáveis e entregas sem downtime, principalmente com TypeScript e Node.js.",
  availability: "10+ anos de experiência · Brasília, Brasil (UTC−3) · Aberto a vagas remotas internacionais",
  metaDescription:
    "Full Stack Engineer em Brasília — 10+ anos construindo e operando sistemas em produção com TypeScript, Node.js, React, CI/CD e Kubernetes. Aberto a vagas remotas.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Full Stack Engineer",
  languages: "Português — nativo · Inglês — B1, quase B2",
  location: "Brasília-DF, Brasil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "ago/2026",
  asOfYm: "2026-08",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "anos de carreira" },
    { id: "tests", value: 902, suffix: "", label: "testes no gate do CI" },
    { id: "downtime", value: 0, suffix: "s", label: "de downtime em deploy" },
    { id: "releases", value: 50, suffix: "", label: "releases desde mar/2025" },
  ],
};
```

Both `metaDescription` strings are 160–166 characters — inside the 80–170 budget. If Prettier reflows the long `availability` line, accept its formatting.

- [ ] **Step 6: Point the two consumers at `pitch`**

`src/lib/cv/build-cv-data.ts` line 37:

```ts
    summary: sections.summary ? content.profile.pitch : null,
```

`src/components/sections/hero.tsx` line 43 (temporary, replaced wholesale in Task 3):

```tsx
        <p className="mt-4 max-w-2xl text-lg text-muted">{profile.pitch}</p>
```

- [ ] **Step 7: Run typecheck and the full unit suite**

Run: `pnpm typecheck && pnpm vitest run`
Expected: typecheck clean. All tests pass **except** one assertion in the pre-existing, uncommitted `src/components/cv/cv-preview.test.tsx` ("usa o headline como cargo, sem marcador de senioridade"), which now fails on `queryByText(content.profile.role)` because role and headline are the same string. Leave that file alone and note it in the task report.

- [ ] **Step 8: Commit**

```bash
git add src/domain/profile.ts src/content/en/profile.ts src/content/pt/profile.ts src/lib/cv/build-cv-data.ts src/lib/cv/build-cv-data.test.ts src/content/content.test.ts src/components/sections/hero.tsx
git commit -m "feat(content): position profile for remote international roles"
```

---

### Task 3: Hero rewrite with availability line and GitHub CTA

**Files:**
- Modify: `src/components/sections/hero.tsx` (full rewrite)
- Modify: `messages/en.json`, `messages/pt.json` (add `common.viewCode`)
- Create: `src/components/sections/hero.test.tsx`

**Interfaces:**
- Consumes: `Profile.pitch`, `Profile.availability`, `Profile.stackHighlights`, `Profile.role` from Task 2.
- Produces: message key `common.viewCode`.

- [ ] **Step 1: Write the failing hero test**

`src/components/sections/hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { getContent } from "@/content";
import { Hero } from "./hero";

// TransitionLink depende do router do Next e do provider de view transitions;
// aqui só interessa o href, então o link vira um <a> simples.
vi.mock("@/components/motion/transition-link", () => ({
  TransitionLink: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const { profile } = getContent("en");

function renderHero() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <Hero profile={profile} />
    </NextIntlClientProvider>,
  );
}

describe("Hero", () => {
  it("mostra cargo, pitch e a linha de disponibilidade do perfil", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    expect(screen.getByText(profile.pitch)).toBeInTheDocument();
    expect(screen.getByText(profile.availability)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`^${profile.role} · `))).toBeInTheDocument();
  });

  it("deriva a linha de stack de stackHighlights, sem lista paralela", () => {
    renderHero();
    expect(screen.getByText(profile.stackHighlights.join(" · "))).toBeInTheDocument();
  });

  it("tem um botão para o GitHub com o rótulo de código e alvo externo", () => {
    renderHero();
    const link = screen.getByRole("link", { name: /view my code on github/i });
    expect(link).toHaveAttribute("href", profile.github);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("mantém CV, LinkedIn e copiar e-mail", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute("href", "/cv");
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      profile.linkedin,
    );
    expect(screen.getByRole("button", { name: /copy email/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/components/sections/hero.test.tsx`
Expected: FAIL — no "view my code" link; stack line is the old hardcoded ten-item list.

- [ ] **Step 3: Add the message key in both locales**

`messages/en.json`, inside `"common"`, after `"downloadCv"`:

```json
    "viewCode": "View my code on GitHub",
```

`messages/pt.json`, inside `"common"`, after `"downloadCv"`:

```json
    "viewCode": "Ver meu código no GitHub",
```

- [ ] **Step 4: Rewrite the hero**

`src/components/sections/hero.tsx` — replace the whole file:

```tsx
import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { buttonVariants } from "@/components/ui/button";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");

  // Uma linha mono de fatos vinda direto de profile.metrics (rótulo como
  // escrito, sem copy inventada) em vez de um grid animado — lê como linha
  // de caderno, não como dashboard de vendas.
  const factsLine = profile.metrics
    .map((metric) => `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} ${metric.label}`)
    .join(" · ");

  // Mesma fonte da OG image (stackHighlights): hero e preview social dizem a
  // mesma stack, sem uma lista paralela hardcoded aqui.
  const stackLine = profile.stackHighlights.join(" · ");

  return (
    // Sem mx-auto/px-6/max-w aqui: o <main> em page.tsx já centraliza e
    // aplica o padding em max-w-5xl. Um segundo container mais estreito
    // dobrava o padding horizontal no mobile e desalinhava a borda esquerda
    // do hero com todas as seções abaixo.
    <section className="pt-24">
      {/* Fora do Reveal: o h1 é o elemento LCP e tudo neste bloco (cargo,
          pitch, disponibilidade) está acima da dobra em qualquer carga —
          esconder atrás de opacity:0 até o motion hidratar só atrasa a
          pintura do que o recrutador precisa ler nos primeiros segundos. */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 font-mono text-sm text-muted">
          {profile.role} · {profile.location}
        </p>
        <p className="mt-1 font-mono text-sm text-muted">{stackLine}</p>
        <p className="mt-5 max-w-2xl text-lg text-muted">{profile.pitch}</p>
        <p className="mt-4 font-mono text-sm text-muted">{profile.availability}</p>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TransitionLink href="/cv" className={buttonVariants()}>
            {t("downloadCv")}
          </TransitionLink>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("viewCode")} <span aria-hidden="true">→</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent underline-offset-4 hover:underline"
          >
            LinkedIn
          </a>
          <CopyEmailButton
            email={profile.email}
            copyLabel={t("copyEmail")}
            copiedLabel={t("copied")}
          />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-10 font-mono text-sm text-muted">
          {factsLine} — {t("asOf", { date: profile.metricsAsOf })}
        </p>
      </Reveal>
    </section>
  );
}
```

`SocialLinks` is no longer imported by the hero; it stays in use by `contact.tsx`, so do not delete it.

- [ ] **Step 5: Run the hero test, messages parity test, typecheck, lint**

Run: `pnpm vitest run src/components/sections/hero.test.tsx src/i18n/messages.test.ts && pnpm typecheck && pnpm lint`
Expected: PASS, clean, clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/hero.test.tsx messages/en.json messages/pt.json
git commit -m "feat(hero): lead with pitch, availability and a github cta"
```

---

### Task 4: Section order, English anchors and nav

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/app/[locale]/link-charts/page.tsx:88`
- Modify: `src/components/sections/timeline.tsx:32-34` (comment only)
- Modify: `messages/en.json`, `messages/pt.json` (add `nav.projects`, change `sections.githubProjects`)
- Test: `e2e/home.spec.ts` (add nav + hero assertions)

**Interfaces:**
- Produces: anchor ids `projects`, `experience`, `stack`, `ai`, `contact` on the home page; message key `nav.projects`.

- [ ] **Step 1: Add an e2e test for the new order and nav**

Append to `e2e/home.spec.ts`:

```ts
test("home en: hero vende primeiro, projetos antes da stack, nav em inglês", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByText(/open to remote international roles/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /view my code on github/i })).toHaveAttribute(
    "href",
    /github\.com/,
  );

  const nav = page.getByRole("navigation");
  // next-intl localiza o href; aceita "/en#projects" ou "/en/#projects"
  await expect(nav.getByRole("link", { name: /^projects$/i })).toHaveAttribute(
    "href",
    /\/en\/?#projects$/,
  );
  await expect(nav.getByRole("link", { name: /^experience$/i })).toHaveAttribute(
    "href",
    /\/en\/?#experience$/,
  );
  await expect(nav.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
    "href",
    /\/en\/?#contact$/,
  );

  // Ordem no DOM: projetos (#projects) vem antes da stack (#stack).
  const projectsTop = await page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const stackTop = await page.locator("#stack").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(projectsTop).toBeLessThan(stackTop);
});
```

(The e2e run happens in Task 6; this step only writes the test.)

- [ ] **Step 2: Add/change message keys**

`messages/en.json`:

```json
  "nav": {
    "projects": "Projects",
    "trajectory": "Experience",
    "stack": "Stack",
    "caseStudy": "Link Charts",
    "contact": "Contact"
  },
```

and in `"sections"`:

```json
    "githubProjects": "featured projects",
```

`messages/pt.json`:

```json
  "nav": {
    "projects": "Projetos",
    "trajectory": "Trajetória",
    "stack": "Stack",
    "caseStudy": "Link Charts",
    "contact": "Contato"
  },
```

and in `"sections"`:

```json
    "githubProjects": "projetos em destaque",
```

- [ ] **Step 3: Reorder the home page and rename anchors**

`src/app/[locale]/page.tsx` — replace the JSX inside `<main>` (keep all imports and the translation setup above it unchanged):

```tsx
      <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6">
        <Hero profile={content.profile} />
        {/* Prova antes de inventário: o case em produção e o código público
            vêm antes da lista de skills. */}
        <Reveal>
          <CaseStudyCard release={showcase.latestRelease} locale={locale} />
        </Reveal>
        <Reveal>
          <section id="projects" className="scroll-mt-24">
            <RepoGrid showcase={showcase} />
          </section>
        </Reveal>
        <Reveal>
          <section id="experience" className="scroll-mt-24">
            <Timeline
              experiences={content.experiences}
              locale={locale}
              nowYm={content.profile.asOfYm}
            />
          </section>
        </Reveal>
        <Reveal>
          <section id="stack" className="flex scroll-mt-24 flex-col gap-8">
            <h2 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
              {tNav("stack")}
            </h2>
            <SkillMatrix
              categories={content.skillCategories}
              officialSiteLabel={tCommon("officialSite")}
            />
          </section>
        </Reveal>
        <Reveal>
          <Certifications
            items={content.certifications}
            education={content.education}
            locale={locale}
          />
        </Reveal>
        <Reveal>
          <section id="ai" className="scroll-mt-24">
            <AiStats stats={aiStats} labels={aiStatsLabels} />
          </section>
        </Reveal>
        <Reveal>
          <section id="contact" className="scroll-mt-24">
            <Contact profile={content.profile} />
          </section>
        </Reveal>
      </main>
```

- [ ] **Step 4: Update the header nav**

`src/components/layout/site-header.tsx` — replace the `anchors` array:

```ts
  const anchors = [
    { href: "/#projects", label: t("projects") },
    { href: "/link-charts", label: t("caseStudy"), isRoute: true as const },
    { href: "/#experience", label: t("trajectory") },
    { href: "/#stack", label: t("stack") },
    { href: "/#contact", label: t("contact") },
  ];
```

- [ ] **Step 5: Update the two remaining references to the old anchors**

`src/app/[locale]/link-charts/page.tsx` line 88:

```tsx
              href="/#contact"
```

`src/components/sections/timeline.tsx` lines 32–34, comment only:

```ts
  // Reuses the nav's own "trajectory" label instead of a new message key:
  // same mono-eyebrow recipe as AiStats/RepoGrid/Certifications, so the
  // #experience anchor (linked from the header nav) lands on a titled
  // section instead of jumping straight to the first company heading.
```

- [ ] **Step 6: Verify no old anchor id survives, then typecheck/lint/unit**

Run: `grep -rn "trajetoria\|#contato\|\"ia\"" src e2e; pnpm typecheck && pnpm lint && pnpm vitest run src/i18n/messages.test.ts`
Expected: grep prints nothing; the rest is clean/PASS.

- [ ] **Step 7: Commit**

```bash
git add "src/app/[locale]/page.tsx" src/components/layout/site-header.tsx "src/app/[locale]/link-charts/page.tsx" src/components/sections/timeline.tsx messages/en.json messages/pt.json e2e/home.spec.ts
git commit -m "feat(home): put proof before inventory and use english anchors"
```

---

### Task 5: Featured projects grid shows three repos

**Files:**
- Modify: `src/services/github/core.ts:14-21`, `:165-168`
- Modify: `src/content/github-snapshot.ts`
- Test: `src/services/github/core.test.ts`

**Interfaces:**
- Produces: `SHOWCASE_REPOS = ["medFlow", "lawyer-hero-envato", "print-shop-manager"]`; `fetchShowcase().repos.length <= 3` even with more pins.

- [ ] **Step 1: Extend the pinned-repos test to prove the slice**

In `src/services/github/core.test.ts`, replace the test `"usa os pinned repos do perfil quando há token e pins"` with:

```ts
  it("usa até 3 pinned repos do perfil quando há token e pins", async () => {
    const pinnedNode = (name: string) => ({
      name,
      description: "pinned",
      url: `https://github.com/bcordeirodev/${name}`,
      stargazerCount: 3,
      primaryLanguage: { name: "PHP" },
      pushedAt: "2026-08-12T00:00:00Z",
    });
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql"))
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user: {
                  pinnedItems: {
                    nodes: [
                      pinnedNode("medFlow"),
                      pinnedNode("print-shop-manager"),
                      pinnedNode("lawyer-hero-envato"),
                      pinnedNode("rent-landingpage"),
                    ],
                  },
                },
              },
            }),
          ),
        );
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      throw new Error(`unexpected REST call: ${url}`);
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    // 3 em destaque: o restante fica no diálogo "ver todos", não no grid.
    expect(result.repos.map((r) => r.name)).toEqual([
      "medFlow",
      "print-shop-manager",
      "lawyer-hero-envato",
    ]);
    expect(result.repos[0]?.language).toBe("PHP");
    expect(result.repos[0]?.stars).toBe(3);
  });
```

Also add, right after the existing `SHOWCASE_REPOS` import usage, a small guard test at the top level of the file:

```ts
it("a allowlist de destaque tem exatamente 3 repos", () => {
  expect(SHOWCASE_REPOS).toEqual(["medFlow", "lawyer-hero-envato", "print-shop-manager"]);
});
```

- [ ] **Step 2: Run the test file and confirm the two new tests fail**

Run: `pnpm vitest run src/services/github/core.test.ts`
Expected: FAIL — 4 pinned repos returned; allowlist has 6 entries.

- [ ] **Step 3: Trim the allowlist and slice pins**

`src/services/github/core.ts` — replace lines 12–21:

```ts
// 3 repos em destaque no grid da home. Pins do perfil têm precedência (até
// FEATURED_COUNT); esta allowlist é o fallback sem pins ou sem token
// (ex.: dev local). O catálogo completo continua no diálogo "ver todos".
export const FEATURED_COUNT = 3;
export const SHOWCASE_REPOS = ["medFlow", "lawyer-hero-envato", "print-shop-manager"] as const;
```

In `fetchShowcase`, replace the `pinned` line and the `repoResults` expression:

```ts
  const pinned = token ? (await fetchPinnedRepos(fetchFn, token)).slice(0, FEATURED_COUNT) : [];
```

(the `Promise.all` block below it stays as is.)

- [ ] **Step 4: Replace the snapshot's featured repos with the same three (live data captured 2026-09-02 via `gh api`)**

`src/content/github-snapshot.ts` — replace the `repos` array:

```ts
  repos: [
    {
      name: "medFlow",
      description:
        "Medical practice management platform: patients, prescriptions and clinical documents.",
      url: "https://github.com/bcordeirodev/medFlow",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-08-15T13:50:53Z",
    },
    {
      name: "lawyer-hero-envato",
      description:
        "Professional landing page template for lawyers, built with Next.js 15, TypeScript and Tailwind CSS.",
      url: "https://github.com/bcordeirodev/lawyer-hero-envato",
      stars: 1,
      language: "TypeScript",
      pushedAt: "2025-08-10T14:18:37Z",
    },
    {
      name: "print-shop-manager",
      description:
        "Print shop management system for material control and printing workflows. Laravel + Blade.",
      url: "https://github.com/bcordeirodev/print-shop-manager",
      stars: 0,
      language: "PHP",
      pushedAt: "2026-08-12T15:41:29Z",
    },
  ],
```

Keep `allRepos: []`, `latestRelease: null`, `source: "snapshot"` and the comments as they are.

- [ ] **Step 5: Run the service tests, typecheck, lint**

Run: `pnpm vitest run src/services/github/core.test.ts && pnpm typecheck && pnpm lint`
Expected: PASS, clean, clean.

- [ ] **Step 6: Commit**

```bash
git add src/services/github/core.ts src/services/github/core.test.ts src/content/github-snapshot.ts
git commit -m "feat(projects): feature three repos in the home grid"
```

---

### Task 6: Full verification

**Files:** none modified (fix-forward only if a gate fails, in the task that owns the file).

- [ ] **Step 1: Confirm the working tree contains only the three pre-existing CV files**

Run: `git status --short`
Expected: exactly `src/components/cv/cv-document.tsx`, `src/components/cv/cv-preview.tsx`, `src/components/cv/cv-preview.test.tsx` as ` M`.

- [ ] **Step 2: Format check**

Run: `pnpm format:check`
Expected: clean. If Prettier complains about a file this plan touched, run `pnpm prettier --write <that file>` and amend the owning task's commit with `git add <file> && git commit --amend --no-edit`.

- [ ] **Step 3: Unit suite**

Run: `pnpm test`
Expected: every test passes except the single pre-existing assertion in `cv-preview.test.tsx` described in Global Constraints. Copy the failing test name into the report.

- [ ] **Step 4: E2E suite**

Make sure nothing is already listening on 3001 (`lsof -iTCP:3001 -sTCP:LISTEN`). Then:

Run: `pnpm e2e`
Expected: all projects pass (`home.spec.ts` ×4 tests, `case-study.spec.ts`, `a11y.spec.ts` ×4 paths, across the configured viewports). The webServer builds with `pnpm build` first, so a build failure surfaces here.

- [ ] **Step 5: Manual smoke of the identity surfaces**

With the e2e server still up (or `pnpm exec next start -p 3001` after a build):

```bash
curl -s http://localhost:3001/en | grep -o '<title>[^<]*</title>'
curl -s http://localhost:3001/en | grep -o 'hreflang="x-default" href="[^"]*"'
curl -sI http://localhost:3001/ | grep -i location
```

Expected: title `Bruno Cordeiro — Full Stack Engineer`; x-default `https://brunocordeiro.dev/en`; location `/en`.

- [ ] **Step 6: Report**

No commit. Report: commits made (5), the known failing pre-existing assertion, and that the three CV files were left untouched for Bruno to commit or drop.
