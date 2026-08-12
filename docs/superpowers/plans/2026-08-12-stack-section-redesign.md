# Stack Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplificar a seção `#stack` da home: título de seção, 5 tabs em vez de 9, fim dos badges "em produção"/"profissional" e do verde inconsistente, origem (empresa/projeto) visível em toda skill.

**Architecture:** A seção é um Server Component (`page.tsx`) que passa conteúdo validado por Zod (`getContent(locale)` → `siteContentSchema.parse`) para o client component `SkillMatrix` (tabs Base UI). A mudança percorre as 4 camadas juntas — schema (`src/domain/skill.ts`), conteúdo (`src/content/{pt,en}/skills.ts`), componente (`skill-matrix.tsx`) e página — porque o tipo `EvidenceLevel` e os campos `evidence`/`highlight` acoplam todas elas no typecheck.

**Tech Stack:** Next.js 16 (App Router), React, TypeScript estrito, Zod, next-intl, Tailwind v4, Base UI Tabs, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-12-stack-section-redesign-design.md`

## Global Constraints

- Commits: Conventional Commits (`type(scope): descrição`), subject < 72 chars, imperativo, minúsculas, sem ponto final. **Nunca** mencionar Claude/Anthropic/IA nem trailer `Co-Authored-By`.
- NÃO commitar os arquivos sujos pré-existentes do working tree: `.lighthouserc.json`, `src/components/sections/case-chapter.tsx`, `src/components/terminal/pipeline-diagram-lazy.tsx`. Sempre `git add` com paths explícitos.
- Gates do repo: `npm run lint` (ESLint `--max-warnings=0`), `npm run format:check` (Prettier), `npm run typecheck`, `npm test` (Vitest), `npm run e2e` (Playwright).
- Paridade PT/EN: `src/content/content.test.ts` exige mesmos ids de categoria e mesma contagem de skills nas duas locales.
- Os ids de tab `skill-tab-<id>` / `skill-panel-<id>` e o `keepMounted` (SEO) do `skill-matrix.tsx` devem ser preservados.
- Total esperado após a reorganização: **5 categorias, 77 skills por locale** (Frontend 20, Backend & Dados 25, DevOps & Infra 15, Qualidade & Testes 8, IA & Metodologias 9).

---

### Task 1: Título da seção Stack

**Files:**

- Modify: `src/app/[locale]/page.tsx:55-58`

**Interfaces:**

- Consumes: mensagem `nav.stack` já existente em `messages/pt.json` ("Stack") e `messages/en.json` ("Stack"); receita mono-eyebrow usada em `src/components/sections/timeline.tsx:38`.
- Produces: `<section id="stack">` com `<h2>` visível — nenhuma outra task depende disso.

- [ ] **Step 1: Adicionar o h2 na página**

Em `src/app/[locale]/page.tsx`, o bloco atual:

```tsx
<Reveal>
  <section id="stack" className="scroll-mt-24">
    <SkillMatrix categories={content.skillCategories} labels={evidenceLabels} />
  </section>
</Reveal>
```

vira:

```tsx
<Reveal>
  <section id="stack" className="flex scroll-mt-24 flex-col gap-8">
    <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{tNav("stack")}</h2>
    <SkillMatrix categories={content.skillCategories} labels={evidenceLabels} />
  </section>
</Reveal>
```

E, junto aos outros `getTranslations` no topo do componente (depois da linha `const tEvidence = ...` é um bom lugar), adicionar:

```tsx
const tNav = await getTranslations({ locale, namespace: "nav" });
```

- [ ] **Step 2: Verificar**

Run: `npm run typecheck && npm run lint && npm test`
Expected: tudo verde (nenhum teste cobre o título; é mudança aditiva).

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat(stack): add section title matching sibling sections"
```

---

### Task 2: Schema, conteúdo, componente e mensagens — 5 tabs sem badges

Esta task é um único commit porque o typecheck acopla as camadas: remover `evidence`/`highlight` do schema quebra componente e conteúdo ao mesmo tempo.

**Files:**

- Modify: `src/domain/skill.ts`
- Modify: `src/domain/index.ts:11` (`.min(6)` → `.min(5)`)
- Modify: `src/domain/domain.test.ts:5-11`
- Rewrite: `src/content/pt/skills.ts`
- Rewrite: `src/content/en/skills.ts`
- Rewrite: `src/components/sections/skill-matrix.tsx`
- Rewrite: `src/components/sections/skill-matrix.test.tsx`
- Delete: `src/components/sections/evidence-badge.tsx`
- Modify: `src/app/[locale]/page.tsx` (remover `evidenceLabels`, import `EvidenceLevel`, `tEvidence` e a prop `labels`)
- Modify: `messages/pt.json:31-38` e `messages/en.json:31-38` (remover bloco `evidence`)
- Modify: `e2e/home.spec.ts:7-13` (comentário desatualizado)

**Interfaces:**

- Consumes: `SkillCategory`/`Skill` de `@/domain`; `Tabs, TabsContent, TabsList, TabsTrigger` de `@/components/ui/tabs`; `cn` de `@/lib/utils`.
- Produces: `skillSchema = { name: string; proof: string; tags: string[] (min 1) }` — sem `evidence`, sem `highlight`; `skillCategoryIdSchema = enum ["frontend","backend","devops","quality","ai"]`; `SkillMatrix({ categories }: { categories: SkillCategory[] })` — **sem** prop `labels`; tipo `EvidenceLevel` deixa de existir em `@/domain`.

- [ ] **Step 1: Escrever o teste de domínio que falha**

Substituir o primeiro `it` de `src/domain/domain.test.ts` (linhas 5–11) por:

```ts
it("aceita skill com tags e rejeita skill sem tags", () => {
  expect(
    skillSchema.safeParse({
      name: "TypeScript",
      proof: "strict mode em ~570 arquivos",
      tags: ["Link Charts"],
    }).success,
  ).toBe(true);
  expect(skillSchema.safeParse({ name: "X", proof: "?", tags: [] }).success).toBe(false);
  expect(skillSchema.safeParse({ name: "X", proof: "?" }).success).toBe(false);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/domain/domain.test.ts`
Expected: FAIL — o schema atual exige `evidence`, então o primeiro `safeParse` retorna `success: false`.

- [ ] **Step 3: Reescrever o schema**

Conteúdo completo de `src/domain/skill.ts`:

```ts
import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1),
  proof: z.string().min(1),
  // onde a skill foi exercitada (empresas/projetos), ex.: ["Link Charts", "G4F"]
  tags: z.array(z.string().min(1)).min(1),
});

export const skillCategoryIdSchema = z.enum(["frontend", "backend", "devops", "quality", "ai"]);

export const skillCategorySchema = z.object({
  id: skillCategoryIdSchema,
  title: z.string().min(1),
  skills: z.array(skillSchema).min(1),
});

export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
```

Em `src/domain/index.ts`, trocar:

```ts
  skillCategories: z.array(skillCategorySchema).min(6),
```

por:

```ts
  skillCategories: z.array(skillCategorySchema).min(5),
```

- [ ] **Step 4: Rodar o teste de domínio e ver passar**

Run: `npx vitest run src/domain/domain.test.ts`
Expected: PASS. (`content.test.ts` e o typecheck ficam quebrados até os Steps 5–8 — esperado.)

- [ ] **Step 5: Reescrever o conteúdo PT**

Conteúdo completo de `src/content/pt/skills.ts`:

```ts
import type { SkillCategory } from "@/domain";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      {
        name: "Next.js 15",
        proof:
          "App Router, Server Components, ISR + cache tags, Turbopack; desde as versões 13/14 com React 17/18",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "React 19",
        proof: "Base de todo o frontend, com Server Components",
        tags: ["Link Charts"],
      },
      {
        name: "TypeScript · JavaScript",
        proof:
          "Strict mode + noUncheckedIndexedAccess em ~570 arquivos; ES6+ desde 2016, TS de ponta a ponta desde 2020",
        tags: ["Link Charts"],
      },
      {
        name: "HTML · CSS",
        proof:
          "Markup semântico e CSS moderno (SASS/SCSS, LESS, Tailwind, CSS-in-JS), também em sites de clientes",
        tags: ["Link Charts"],
      },
      {
        name: "Modos de renderização",
        proof:
          "CSR, SSR, SSG, ISR, PPR — de rotas SPA, SSG e SSR corporativas a ISR 300s + revalidateTag",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Arquitetura feature-based",
        proof: "10 features em produção",
        tags: ["Link Charts"],
      },
      {
        name: "MUI 6 + Emotion",
        proof: "SSR, temas claro/escuro, design system próprio",
        tags: ["Link Charts"],
      },
      {
        name: "TanStack Query · SWR",
        proof:
          "36 call sites e query keys centralizadas na v5 (ex-React Query); SWR em sistema consular de grande porte",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "react-hook-form + Zod",
        proof: "Validação de formulários em camadas no frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Data viz",
        proof:
          "30 componentes de gráfico ApexCharts, mapas coroplético/heatmap com Leaflet, tabelas com material-react-table",
        tags: ["Link Charts"],
      },
      {
        name: "i18n",
        proof: "Biblioteca i18next — 13 namespaces em produção; produto corporativo multi-idioma",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "SEO técnico",
        proof: "Metadata API, JSON-LD, sitemap/robots programáticos, llms.txt",
        tags: ["Link Charts"],
      },
      {
        name: "Performance frontend",
        proof: "next/font, optimizePackageImports, dynamic imports",
        tags: ["Link Charts"],
      },
      {
        name: "Acessibilidade",
        proof: "312 usos de aria-*, prefers-reduced-motion, layout validado a 320px",
        tags: ["Link Charts"],
      },
      {
        name: "Redux · Context API",
        proof: "Gerenciamento de estado em projetos corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Styled Components · SASS/SCSS",
        proof: "CSS-in-JS e SASS em interfaces de sistemas corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Design System gov.br",
        proof: "GOVBR-DS e jsx-a11y em produto público federal multi-idioma",
        tags: ["G4F"],
      },
      {
        name: "Vue.js · Bootstrap · LESS",
        proof:
          "Componentes reativos Vue.js com Bootstrap/LESS em telas de gestão sobre Laravel — SPAs legadas por ~3 anos",
        tags: ["Ordem Social"],
      },
      {
        name: "Tailwind CSS",
        proof: "CSS utility-first com tokens e tema próprio — landing pages responsivas publicadas",
        tags: ["projetos pessoais", "este site"],
      },
      {
        name: "Framer Motion",
        proof: "Animações declarativas de entrada e scroll numa landing page autoral publicada",
        tags: ["projetos pessoais"],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Dados",
    skills: [
      {
        name: "Laravel 12",
        proof: "PHP 8.2, em produção desde 2025",
        tags: ["Link Charts"],
      },
      {
        name: "PHP 5.6 → 8.2",
        proof:
          "10 anos acompanhando a evolução da linguagem — Propel, Swagger e PSRs desde 2016; do Laravel 8 em sistemas internos ao Laravel 12 em produção",
        tags: ["Link Charts", "Basis", "Ordem Social", "Plug Digital"],
      },
      {
        name: "NestJS",
        proof:
          "Microsserviços no setor público com SSO gov.br (OIDC) e Prisma 6; TypeORM e Passport/JWT em projeto autoral",
        tags: ["G4F", "projetos pessoais"],
      },
      {
        name: "Arquitetura em camadas",
        proof:
          "Controller → Service → Repository — DI por interface, DTOs, Strategy/Registry, Orchestrator, Observer, ADRs; 145 arquivos PHP, ~28k linhas",
        tags: ["Link Charts"],
      },
      {
        name: "REST + OpenAPI",
        proof:
          "Rotas /api/v1 com Scramble e Swagger; semântica HTTP correta e versionamento consistente",
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "ORMs — 6 em 3 runtimes",
        proof:
          "Eloquent (observers, factories, seeders), TypeORM, Prisma, Propel, Lucid (Adonis), DenoDB — a categoria como conceito, não uma lib decorada",
        tags: ["Link Charts", "G4F", "Basis", "Ordem Social"],
      },
      {
        name: "Autenticação & SSO",
        proof:
          "JWT httpOnly, Sanctum e Auth0 de ponta a ponta (front+back); Login Único gov.br (SSO/OIDC federal)",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Segurança aplicada (OWASP)",
        proof:
          "JWT httpOnly, hash_equals, 16 rate limiters, anti-spoofing (Cloudflare), anti-fraude; CSP por request, HSTS, DOMPurify e hCaptcha em sistema público de grande porte",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "Caching e padrões assíncronos",
        proof:
          "Redis, ISR/cache tags, idempotência (dedup_key), filas, webhooks assinados (hash_equals)",
        tags: ["Link Charts", "Basis"],
      },
      {
        name: "Rate limiting",
        proof: "16 rate limiters nomeados",
        tags: ["Link Charts"],
      },
      {
        name: "Filas e jobs idempotentes",
        proof: "13 jobs, retry/backoff, dedup_key UNIQUE + insertOrIgnore",
        tags: ["Link Charts"],
      },
      {
        name: "Scheduler",
        proof: "5 tarefas com withoutOverlapping",
        tags: ["Link Charts"],
      },
      {
        name: "Logging estruturado com PII redaction",
        proof: "8 canais, request_id propagado aos workers",
        tags: ["Link Charts"],
      },
      {
        name: "Integrações de terceiros",
        proof: "Google Safe Browsing, Brevo, Auth0, GeoIP MaxMind, Yasumi integrados no backend",
        tags: ["Link Charts"],
      },
      {
        name: "LGPD aplicada",
        proof: "Anonimização de IPs, exclusão de conta, unsubscribe assinado",
        tags: ["Link Charts"],
      },
      {
        name: "WebSockets",
        proof:
          "@nestjs/websockets + socket.io em sistema consular de grande porte no setor público",
        tags: ["G4F"],
      },
      {
        name: "Microsserviços",
        proof: "Serviço de autenticação separado do core em sistema consular de grande porte",
        tags: ["G4F"],
      },
      {
        name: "Express · AdonisJS",
        proof: "APIs REST com Express e AdonisJS (Lucid ORM) em serviços corporativos",
        tags: ["G4F"],
      },
      {
        name: "Deno",
        proof: "Runtime Deno com OAK para rotas e DenoDB como ORM em serviço corporativo",
        tags: ["G4F"],
      },
      {
        name: "Fundamentos de projeto",
        proof: "POO, SOLID, PSRs, MVC — a base teórica por trás da arquitetura em camadas",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "PostgreSQL 15",
        proof: "56 migrations, índices de performance, backfill, UNIQUE para idempotência",
        tags: ["Link Charts"],
      },
      {
        name: "Redis 7",
        proof: "Cache, filas, sliding-window para viral rank",
        tags: ["Link Charts"],
      },
      {
        name: "SQL multi-dialeto",
        proof: "Camada própria de dialetos (SqlDateExpr) para SQLite e PostgreSQL",
        tags: ["Link Charts"],
      },
      {
        name: "Oracle",
        proof: "PL/SQL e modelagem em bancos corporativos de sistemas internos de grande porte",
        tags: ["Basis", "Transoft"],
      },
      {
        name: "MySQL",
        proof: "Modelagem relacional e queries em sistemas de gestão partidária e jurídica",
        tags: ["Ordem Social"],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Infra",
    skills: [
      {
        name: "Deploy blue/green",
        proof:
          "Downtime medido: ~5min → 0s; scripts bash próprios (176 linhas): warm-up, health check, cutover nginx graceful, drenagem, abort",
        tags: ["Link Charts"],
      },
      {
        name: "Docker",
        proof: "Multi-stage, Alpine + extensões compiladas, 3 stacks compose por ciclo de vida",
        tags: ["Link Charts"],
      },
      {
        name: "GitHub Actions",
        proof: "CI ≠ Release, deploy por tag, rollback via workflow_dispatch, concurrency groups",
        tags: ["Link Charts"],
      },
      {
        name: "OpenTelemetry",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules versionados, uptime probe que abre issue",
        tags: ["Link Charts"],
      },
      {
        name: "Registry GHCR",
        proof: "Imagens imutáveis, retenção para rollback",
        tags: ["Link Charts"],
      },
      {
        name: "VPS Linux",
        proof: "DigitalOcean — nginx reverse proxy/LB, Let's Encrypt, Cloudflare real-ip, ufw",
        tags: ["Link Charts"],
      },
      {
        name: "Supervisor",
        proof: "Process manager dos workers de fila",
        tags: ["Link Charts"],
      },
      {
        name: "Migrations expand/contract",
        proof: "Guard automatizado (MigrationSafetyTest) no CI",
        tags: ["Link Charts"],
      },
      {
        name: "Postmortems",
        proof:
          "918 respostas 502 → blue/green; bug de --build-arg → guard no CI; IP forjável → Cloudflare real-ip",
        tags: ["Link Charts"],
      },
      {
        name: "Bash",
        proof: "Scripts de deploy blue/green (176 linhas) e operação",
        tags: ["Link Charts"],
      },
      {
        name: "Kubernetes",
        proof: "Orquestração de contêineres em sistema consular de grande porte no setor público",
        tags: ["G4F"],
      },
      {
        name: "Jenkins · Bamboo · GitLab CI",
        proof: "Esteiras corporativas de build e deploy",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Rancher · Harbor",
        proof: "Orquestração de contêineres e registry privado em ambiente corporativo",
        tags: ["Basis"],
      },
      {
        name: "Apache · Nginx · Ubuntu",
        proof: "Operação de servidores web Linux, de VPS próprio a infra corporativa",
        tags: ["Link Charts", "Ordem Social"],
      },
      {
        name: "Azure DevOps",
        proof: "Boards e pipelines de CI/CD da Microsoft em projeto frontend",
        tags: ["VegaIT"],
      },
    ],
  },
  {
    id: "quality",
    title: "Qualidade & Testes",
    skills: [
      {
        name: "PHPUnit",
        proof: "PHPUnit 11 — ~902 testes: unit, feature, snapshot, characterization",
        tags: ["Link Charts"],
      },
      {
        name: "Matriz de banco no CI",
        proof: "Suíte inteira em SQLite E contra PostgreSQL 15 real",
        tags: ["Link Charts"],
      },
      {
        name: "PHPStan nível 5",
        proof: "Larastan sobre Laravel, com baseline versionado",
        tags: ["Link Charts"],
      },
      {
        name: "Playwright",
        proof: "E2E multi-viewport: 320/375/desktop, 6 projects, storage state autenticado",
        tags: ["Link Charts"],
      },
      {
        name: "Testes de segurança",
        proof: "IP spoofing, rate limit, retry de fila",
        tags: ["Link Charts"],
      },
      {
        name: "Lint como gate",
        proof: "ESLint --max-warnings=0, Prettier e Laravel Pint bloqueando o CI",
        tags: ["Link Charts", "este site"],
      },
      {
        name: "SonarQube",
        proof: "Gate de qualidade estática nas esteiras corporativas",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Jest · Testing Library · MSW",
        proof: "Testes unitários e mock de API, do corporativo ao projeto autoral",
        tags: ["G4F", "Basis", "projetos pessoais"],
      },
    ],
  },
  {
    id: "ai",
    title: "IA & Metodologias",
    skills: [
      {
        name: "IA-first com guardrails",
        proof:
          "Dev guiado por spec, orquestração de agentes — ~1.929 commits solo/17 meses, mantendo 902 testes, PHPStan, E2E",
        tags: ["Link Charts"],
      },
      {
        name: "Contexto como artefato",
        proof:
          "Arquivo de contexto de 22KB versionado no repo (onboarding para agentes), ADRs e postmortems que alimentam o contexto, llms.txt no frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Ecossistema de tooling de agentes",
        proof:
          "MCP servers configurados (browser/Playwright, PostgreSQL, Redis, GitHub, Vercel), git worktrees para execução isolada de agentes",
        tags: ["Link Charts"],
      },
      {
        name: "Workflow git",
        proof:
          "Husky, commitlint/commitizen, hooks versionados no repo e Conventional Commits em todos os projetos",
        tags: ["Link Charts", "projetos pessoais"],
      },
      {
        name: "ADRs + Mermaid",
        proof:
          "Formato MADR; decisões de arquitetura documentadas em docs/adr/, com diagramas versionados",
        tags: ["Link Charts"],
      },
      {
        name: "Monetização web",
        proof: "AdSense Consent Mode v2, Google Ads com tracking de conversão, GA4",
        tags: ["Link Charts"],
      },
      {
        name: "E-mail transacional/lifecycle",
        proof: "Brevo/SendGrid — digest semanal, milestone, winback, onboarding",
        tags: ["Link Charts"],
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        proof: "Cerimônias Scrum, quadros Kanban e backlog no Jira em times corporativos",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Levantamento de requisitos e documentação",
        proof:
          "Entrevistas com stakeholders e especificação funcional para sistemas de gestão partidária",
        tags: ["Ordem Social"],
      },
    ],
  },
];
```

- [ ] **Step 6: Reescrever o conteúdo EN (espelhado)**

Conteúdo completo de `src/content/en/skills.ts`:

```ts
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
      },
      {
        name: "React 19",
        proof: "Foundation of the entire frontend, with Server Components",
        tags: ["Link Charts"],
      },
      {
        name: "TypeScript · JavaScript",
        proof:
          "strict mode + noUncheckedIndexedAccess across ~570 files; ES6+ since 2016, TS end to end since 2020",
        tags: ["Link Charts"],
      },
      {
        name: "HTML · CSS",
        proof:
          "Semantic markup and modern CSS (SASS/SCSS, LESS, Tailwind, CSS-in-JS), including client sites",
        tags: ["Link Charts"],
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
      },
      {
        name: "TanStack Query · SWR",
        proof:
          "36 call sites and centralized query keys on v5 (formerly React Query); SWR on a large-scale consular system",
        tags: ["Link Charts", "G4F"],
      },
      {
        name: "react-hook-form + Zod",
        proof: "Layered form validation on the frontend",
        tags: ["Link Charts"],
      },
      {
        name: "Data viz",
        proof:
          "30 ApexCharts chart components, choropleth/heatmap maps with Leaflet, tables with material-react-table",
        tags: ["Link Charts"],
      },
      {
        name: "i18n",
        proof: "i18next — 13 namespaces in production; multi-language corporate product",
        tags: ["Link Charts", "G4F"],
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
      },
      {
        name: "Styled Components · SASS/SCSS",
        proof: "CSS-in-JS and SASS across corporate interfaces",
        tags: ["G4F", "Basis"],
      },
      {
        name: "gov.br Design System",
        proof: "GOVBR-DS and jsx-a11y on a multi-language federal public product",
        tags: ["G4F"],
      },
      {
        name: "Vue.js · Bootstrap · LESS",
        proof:
          "Reactive Vue.js components with Bootstrap/LESS in Laravel admin screens — maintained legacy SPAs for ~3 years",
        tags: ["Ordem Social"],
      },
      {
        name: "Tailwind CSS",
        proof: "Utility-first CSS with custom tokens and theme — shipped responsive landing pages",
        tags: ["side projects", "this site"],
      },
      {
        name: "Framer Motion",
        proof: "Declarative entrance and scroll animations on a published solo landing page",
        tags: ["side projects"],
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
      },
      {
        name: "PHP 5.6 → 8.2",
        proof:
          "10 years following the language's evolution — Propel, Swagger and PSRs since 2016; from Laravel 8 on internal systems to Laravel 12 in production",
        tags: ["Link Charts", "Basis", "Ordem Social", "Plug Digital"],
      },
      {
        name: "NestJS",
        proof:
          "Public-sector microservices with gov.br SSO (OIDC) and Prisma 6; TypeORM and Passport/JWT on a solo project",
        tags: ["G4F", "side projects"],
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
          "/api/v1 routes with Scramble and Swagger; correct HTTP semantics and consistent versioning",
        tags: ["Link Charts", "Basis"],
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
      },
      {
        name: "Deno",
        proof: "Deno runtime with OAK for routing and DenoDB as ORM in a corporate service",
        tags: ["G4F"],
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
      },
      {
        name: "Redis 7",
        proof: "Cache, queues, sliding-window for viral rank",
        tags: ["Link Charts"],
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
      },
      {
        name: "MySQL",
        proof: "Relational modeling and queries for party-management and legal-case systems",
        tags: ["Ordem Social"],
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
      },
      {
        name: "GitHub Actions",
        proof: "CI ≠ Release, tag-based deploy, rollback via workflow_dispatch, concurrency groups",
        tags: ["Link Charts"],
      },
      {
        name: "OpenTelemetry",
        proof:
          "Tail sampling, Grafana Cloud/Alloy, Faro RUM, Pyroscope, dashboards + alert rules as code, uptime probe that opens an issue",
        tags: ["Link Charts"],
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
      },
      {
        name: "Kubernetes",
        proof: "Container orchestration on a large-scale public-sector consular system",
        tags: ["G4F"],
      },
      {
        name: "Jenkins · Bamboo · GitLab CI",
        proof: "Corporate build and deploy pipelines",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Rancher · Harbor",
        proof: "Container orchestration and private registry in corporate environments",
        tags: ["Basis"],
      },
      {
        name: "Apache · Nginx · Ubuntu",
        proof: "Linux web server operations, from my own VPS to corporate infra",
        tags: ["Link Charts", "Ordem Social"],
      },
      {
        name: "Azure DevOps",
        proof: "Microsoft's boards and CI/CD pipelines on a frontend project",
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
        proof: "PHPUnit 11 — ~902 tests: unit, feature, snapshot, characterization",
        tags: ["Link Charts"],
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
      },
      {
        name: "Playwright",
        proof: "Multi-viewport E2E: 320/375/desktop, 6 projects, authenticated storage state",
        tags: ["Link Charts"],
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
      },
      {
        name: "SonarQube",
        proof: "Static quality gate in corporate pipelines",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Jest · Testing Library · MSW",
        proof: "Unit tests and API mocking, from corporate work to a solo project",
        tags: ["G4F", "Basis", "side projects"],
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
      },
      {
        name: "Git workflow",
        proof:
          "Husky, commitlint/commitizen, repo-versioned hooks and Conventional Commits across all projects",
        tags: ["Link Charts", "side projects"],
      },
      {
        name: "ADRs + Mermaid",
        proof:
          "MADR format; architecture decisions documented in docs/adr/, with versioned diagrams",
        tags: ["Link Charts"],
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
      },
      {
        name: "SCRUM, Lean Kanban, Jira",
        proof: "Scrum ceremonies, Kanban boards, and Jira backlog management in corporate teams",
        tags: ["G4F", "Basis"],
      },
      {
        name: "Requirements gathering and documentation",
        proof: "Stakeholder interviews and functional specs for party-management systems",
        tags: ["Ordem Social"],
      },
    ],
  },
];
```

- [ ] **Step 7: Rodar os testes de conteúdo e ver passar**

Run: `npx vitest run src/content/content.test.ts src/domain/domain.test.ts`
Expected: PASS — paridade PT/EN (mesmos ids, mesma contagem 20/25/15/8/9) e validação Zod ok.

- [ ] **Step 8: Reescrever o componente e deletar o badge**

Conteúdo completo de `src/components/sections/skill-matrix.tsx`:

```tsx
"use client";

import type { SkillCategory } from "@/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function SkillMatrix({ categories }: { categories: SkillCategory[] }) {
  return (
    <Tabs defaultValue={categories[0]?.id}>
      {/* Below `sm`, tabs scroll horizontally (native
          `-webkit-overflow-scrolling`, hidden scrollbar) with a trailing-edge
          fade hinting that the row continues; the mask fades to transparent
          instead of an opaque overlay, so it still shows bg-surface. At `sm`
          and up the 5 tabs fit a single row; `h-auto!` + flex-wrap stay as a
          safety net if a locale's titles ever overflow — `h-auto!` (not just
          `h-auto`) because the base TabsList variant sets a fixed
          `group-data-horizontal/tabs:h-8` with equal CSS specificity. */}
      <TabsList
        className={cn(
          "h-auto! w-full flex-nowrap justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden",
          "[mask-image:linear-gradient(to_right,black,black_calc(100%-2.5rem),transparent)] sm:[mask-image:none]",
        )}
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            id={`skill-tab-${category.id}`}
            aria-controls={`skill-panel-${category.id}`}
            className="shrink-0"
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          id={`skill-panel-${category.id}`}
          aria-labelledby={`skill-tab-${category.id}`}
          // Keeps every category panel rendered in the initial HTML instead
          // of only the active one. Inactive panels are still marked
          // `hidden`/`inert` by the underlying Tabs.Panel (invisible to users
          // and ignored by axe), but the markup — and every skill name/proof
          // inside it — is present for crawlers, ATS parsers, and sourcing
          // agents that only ever see the first HTML response.
          keepMounted
        >
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex flex-col gap-0.5 border-b border-border/60 py-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-mono text-sm">{skill.name}</span>
                  <span className="font-mono text-[11px] text-muted">{skill.tags.join(" · ")}</span>
                </div>
                <p className="text-sm text-muted">{skill.proof}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
```

Deletar o badge:

```bash
git rm src/components/sections/evidence-badge.tsx
```

- [ ] **Step 9: Reescrever o teste do componente**

Conteúdo completo de `src/components/sections/skill-matrix.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkillMatrix } from "./skill-matrix";

const categories = [
  {
    id: "frontend" as const,
    title: "Frontend",
    skills: [{ name: "React 19", proof: "Base de todo o frontend", tags: ["Link Charts"] }],
  },
  {
    id: "backend" as const,
    title: "Backend & Dados",
    skills: [
      {
        name: "Laravel 12",
        proof: "PHP 8.2, em produção desde 2025",
        tags: ["Link Charts", "G4F"],
      },
    ],
  },
];

describe("SkillMatrix", () => {
  it("troca de categoria ao clicar na tab", async () => {
    render(<SkillMatrix categories={categories} />);
    expect(screen.getByText("React 19")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Backend & Dados" }));
    expect(await screen.findByText("Laravel 12")).toBeInTheDocument();
  });

  it("mostra a origem (tags) de toda skill", () => {
    render(<SkillMatrix categories={categories} />);
    // keepMounted deixa os dois painéis no DOM, então as duas origens existem
    expect(screen.getByText("Link Charts")).toBeInTheDocument();
    expect(screen.getByText("Link Charts · G4F")).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Atualizar a página**

Em `src/app/[locale]/page.tsx`:

1. Remover o import `import type { EvidenceLevel } from "@/domain";` (linha 4).
2. Remover o bloco inteiro (linhas ~25–33):

```tsx
const tEvidence = await getTranslations({ locale, namespace: "evidence" });
const evidenceLabels: Record<EvidenceLevel, string> = {
  production: tEvidence("production"),
  professional: tEvidence("professional"),
  project: tEvidence("project"),
  certified: tEvidence("certified"),
  academic: tEvidence("academic"),
  declared: tEvidence("declared"),
};
```

3. Trocar a chamada do componente (a versão da Task 1) para:

```tsx
<SkillMatrix categories={content.skillCategories} />
```

- [ ] **Step 11: Remover o bloco `evidence` das mensagens**

Em `messages/pt.json`, deletar:

```json
  "evidence": {
    "production": "em produção",
    "professional": "profissional",
    "project": "projeto",
    "certified": "certificado",
    "academic": "acadêmico",
    "declared": "declarado"
  },
```

Em `messages/en.json`, deletar:

```json
  "evidence": {
    "production": "in production",
    "professional": "professional",
    "project": "project",
    "certified": "certified",
    "academic": "academic",
    "declared": "declared"
  },
```

- [ ] **Step 12: Atualizar o comentário desatualizado do e2e**

Em `e2e/home.spec.ts`, o comentário das linhas 7–13 menciona "all 9 skill categories" e o painel "Languages". Substituir por:

```ts
// Scoped to the active tabpanel: all 5 skill categories are kept mounted
// in the DOM for SEO (see skill-matrix.tsx), and "Laravel 12" also appears
// in the (same) Backend panel's PHP proof text, so an unscoped
// getByText().first() could match a hidden element elsewhere.
// getByRole("tabpanel") only resolves the visible panel because inactive
// panels carry the `hidden` attribute, which removes them (and their
// text) from the accessibility tree Playwright queries.
```

A lógica do teste não muda: a tab `/backend/i` casa com "Backend & Dados" e "Laravel 12" continua visível nela.

- [ ] **Step 13: Rodar as verificações da task**

Run: `npm run typecheck && npm run lint && npm test`
Expected: tudo PASS. Se o Prettier reclamar de formatação nos arquivos tocados, rode `npx prettier --write src/content/pt/skills.ts src/content/en/skills.ts src/components/sections/skill-matrix.tsx src/components/sections/skill-matrix.test.tsx "src/app/[locale]/page.tsx" src/domain/skill.ts messages/pt.json messages/en.json e2e/home.spec.ts` e re-rode.

- [ ] **Step 14: Commit**

```bash
git add src/domain/skill.ts src/domain/index.ts src/domain/domain.test.ts \
  src/content/pt/skills.ts src/content/en/skills.ts \
  src/components/sections/skill-matrix.tsx src/components/sections/skill-matrix.test.tsx \
  "src/app/[locale]/page.tsx" messages/pt.json messages/en.json e2e/home.spec.ts
git commit -m "feat(stack): consolidate tabs and show skill origin tags"
```

(O `git rm` do Step 8 já deixou a deleção staged.)

---

### Task 3: Verificação completa

**Files:** nenhum novo — só execução de gates e, se preciso, formatação de docs.

**Interfaces:**

- Consumes: todo o trabalho das Tasks 1–2.
- Produces: branch verde em todos os gates do CI local.

- [ ] **Step 1: Suite completa de unidade + estática**

Run: `npm run format:check && npm run lint && npm run typecheck && npm test`
Expected: PASS. Se `format:check` acusar `docs/superpowers/**`, rode `npx prettier --write docs/` e commite separado: `git add docs && git commit -m "docs: format superpowers specs and plans"`. Ignore (não formate/commite) `.lighthouserc.json`, `case-chapter.tsx` e `pipeline-diagram-lazy.tsx`.

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: build ok, sem erros de tipo ou de prerender nas rotas `/pt` e `/en`.

- [ ] **Step 3: E2E**

Run: `npm run e2e`
Expected: PASS — `home.spec.ts` (troca de tab Backend & Dados), `a11y.spec.ts` (axe na home com o novo markup) e `case-study.spec.ts`.

- [ ] **Step 4: Conferência visual**

Run: `npm run dev` e abrir `http://localhost:3000/pt#stack`.
Verificar: título "STACK" em mono-eyebrow; 5 tabs numa linha; nenhuma cor verde na lista; toda skill com origem à direita; `/en` espelhado. Encerrar o dev server ao final.
