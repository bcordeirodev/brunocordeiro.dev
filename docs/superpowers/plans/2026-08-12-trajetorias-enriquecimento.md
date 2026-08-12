# Trajetórias Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer a seção de trajetórias com os dados aprovados na spec `docs/superpowers/specs/2026-08-12-trajetorias-enriquecimento-design.md` — só conteúdo, sem mudança de schema/UI.

**Architecture:** Os dados vivem em `src/content/pt/experiences.ts` e `src/content/en/experiences.ts`, tipados por `experienceSchema` (Zod) e validados por `content.test.ts` via `getContent()`. Adicionamos guards de teste (cargo padronizado, card nunca vazio, paridade pt/en de stacks/projetos) e depois os dados que os deixam verdes.

**Tech Stack:** TypeScript, Zod, Vitest, pnpm.

## Global Constraints

- Nunca citar nominalmente: "E-consular", "E-folhas", "Itamaraty" — o leak-check em `content.test.ts:24` (`/itamaraty|e-?consular|harbor\./i`) reforça parte disso; os projetos G4F usam nomes genéricos.
- Cargos padronizados — PT: `Desenvolvedor Full Stack` / `Desenvolvedor Frontend` / `Desenvolvedor PHP` / `Desenvolvedor PHP Jr`; EN: `Full Stack Developer` / `Frontend Developer` / `PHP Developer` / `Junior PHP Developer`.
- pt e en devem manter paridade estrutural (mesmas empresas, mesmas contagens de stacks/projetos).
- Commits em Conventional Commits, subject minúsculo, imperativo, <72 chars, sem referência a IA.
- Comandos: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`.

---

### Task 1: Guards de teste + dados pt/en

Um único task/commit: os dois arquivos de conteúdo precisam mudar juntos (o teste de paridade quebra se só um mudar).

**Files:**
- Modify: `src/content/content.test.ts` (teste de paridade em ~linha 8; novos `it` após ele)
- Modify: `src/content/pt/experiences.ts`
- Modify: `src/content/en/experiences.ts`

**Interfaces:**
- Consumes: `getContent(locale)` e `locales` de `@/content` (já importados em `content.test.ts`).
- Produces: nada novo — apenas dados; nenhum consumidor muda.

- [ ] **Step 1: Adicionar guards em `content.test.ts`**

Dentro do `it("pt e en têm paridade estrutural", ...)`, após a assertion de `experiences.map((e) => e.company)`, adicionar:

```ts
    expect(en.experiences.map((e) => e.stacks.length)).toEqual(
      pt.experiences.map((e) => e.stacks.length),
    );
    expect(en.experiences.map((e) => e.projects.length)).toEqual(
      pt.experiences.map((e) => e.projects.length),
    );
```

Após esse `it`, adicionar dois novos:

```ts
  it("toda experiência tem stacks e pelo menos um projeto", () => {
    for (const locale of locales) {
      for (const exp of getContent(locale).experiences) {
        expect(exp.stacks.length, `${locale}: ${exp.company} sem stacks`).toBeGreaterThan(0);
        expect(exp.projects.length, `${locale}: ${exp.company} sem projetos`).toBeGreaterThan(0);
      }
    }
  });
  it("cargos seguem a nomenclatura padronizada por locale", () => {
    const ptRoles = new Set([
      "Desenvolvedor Full Stack",
      "Desenvolvedor Frontend",
      "Desenvolvedor PHP",
      "Desenvolvedor PHP Jr",
    ]);
    const enRoles = new Set([
      "Full Stack Developer",
      "Frontend Developer",
      "PHP Developer",
      "Junior PHP Developer",
    ]);
    for (const exp of getContent("pt").experiences)
      expect(ptRoles.has(exp.role), `pt: ${exp.company} → ${exp.role}`).toBe(true);
    for (const exp of getContent("en").experiences)
      expect(enRoles.has(exp.role), `en: ${exp.company} → ${exp.role}`).toBe(true);
  });
```

- [ ] **Step 2: Rodar e confirmar que os novos guards FALHAM**

Run: `pnpm test -- src/content/content.test.ts`
Expected: FAIL — "toda experiência…" falha (VegaIT/Ebserh sem projetos, Ebserh sem stacks) e "cargos seguem…" falha (PT com títulos em inglês, "Programador PHP", etc.).

- [ ] **Step 3: Editar `src/content/pt/experiences.ts`**

Aplicar exatamente:

**G4F** — role `"Full Stack Developer"` → `"Desenvolvedor Full Stack"`. No fim de `stacks` (após `"GitLab CI",`) acrescentar:

```ts
      "hCaptcha + biometria facial",
      "DOMPurify",
      "CSP por request/HSTS",
      "Geração documental (PDF/xlsx)",
      "E-mail transacional (MJML)",
      "Bamboo",
      "Harbor",
```

Em `projects`, após o objeto do sistema consular, acrescentar:

```ts
      {
        name: "Sistema de folha de pagamento consular (setor público federal)",
        description:
          "Gestão da folha de pagamento de funcionários dos consulados no exterior",
      },
```

**VegaIT** — role `"Frontend Developer"` → `"Desenvolvedor Frontend"`; adicionar `location: "Brasil",` após `end`; em `stacks`, `"Azure DevOps"` → `"Azure DevOps (Pipelines)"` e acrescentar `"ESLint/tsc"`; `projects: []` →

```ts
    projects: [
      {
        name: "SIM – Manutenção",
        description:
          "Gestão de manutenção hoteleira: QR code de equipamentos, cadastros de andares, quartos e objetos, ordens de serviço",
      },
    ],
```

**Ebserh** — `stacks: []` →

```ts
    stacks: [
      "React 17",
      "TypeScript 4",
      "Laravel 8",
      "PHP 7.4/8.0",
      "PostgreSQL 13",
      "Jest",
      "PHPUnit 9",
      "Pipeline CI/CD",
    ],
```

e `projects: []` →

```ts
    projects: [
      {
        name: "Sistema de gestão hospitalar",
        description:
          "Controle de orçamentos e cadastros de hospitais e setores para a rede de hospitais universitários federais",
      },
    ],
```

**Basis** — adicionar `location: "Brasília-DF",` após `end`; em `stacks`, após `"Rancher",` acrescentar `"Harbor",`.

**PROS** — role `"PHP Developer"` → `"Desenvolvedor PHP"`; adicionar `location: "Brasília-DF",` após `end`.

**Transoft** — role `"Programador PHP"` → `"Desenvolvedor PHP"`; adicionar `location: "Brasília-DF",` após `end`.

**Plug Digital** — role `"Programador PHP Jr"` → `"Desenvolvedor PHP Jr"`; adicionar `location: "Brasília-DF",` após `end`; em `projects`, após o ExpliQa acrescentar:

```ts
      { name: "SGP / GPES", description: "Gestão partidária e pesquisas estratégicas" },
```

- [ ] **Step 4: Editar `src/content/en/experiences.ts`**

Aplicar exatamente:

**G4F** — role permanece `"Full Stack Developer"`. No fim de `stacks` (após `"GitLab CI",`) acrescentar:

```ts
      "hCaptcha + facial biometrics",
      "DOMPurify",
      "Per-request CSP/HSTS",
      "Document generation (PDF/xlsx)",
      "Transactional email (MJML)",
      "Bamboo",
      "Harbor",
```

Em `projects`, após o objeto do sistema consular, acrescentar:

```ts
      {
        name: "Consular payroll system (federal public sector)",
        description: "Payroll management for consulate employees abroad",
      },
```

**VegaIT** — role permanece `"Frontend Developer"`; adicionar `location: "Brazil",` após `end`; em `stacks`, `"Azure DevOps"` → `"Azure DevOps (Pipelines)"` e acrescentar `"ESLint/tsc"`; `projects: []` →

```ts
    projects: [
      {
        name: "SIM – Maintenance",
        description:
          "Hotel maintenance management: equipment QR codes, floor/room/asset registries, service orders",
      },
    ],
```

**Ebserh** — role permanece `"Full Stack Developer"`; `stacks: []` →

```ts
    stacks: [
      "React 17",
      "TypeScript 4",
      "Laravel 8",
      "PHP 7.4/8.0",
      "PostgreSQL 13",
      "Jest",
      "PHPUnit 9",
      "CI/CD pipeline",
    ],
```

e `projects: []` →

```ts
    projects: [
      {
        name: "Hospital management system",
        description:
          "Budget control and hospital/department registries for the federal university hospital network",
      },
    ],
```

**Basis** — adicionar `location: "Brasília-DF",` após `end`; em `stacks`, após `"Rancher",` acrescentar `"Harbor",`.

**PROS** — role permanece `"PHP Developer"`; adicionar `location: "Brasília-DF",` após `end`.

**Transoft** — role `"PHP Programmer"` → `"PHP Developer"`; adicionar `location: "Brasília-DF",` após `end`.

**Plug Digital** — role `"Junior PHP Programmer"` → `"Junior PHP Developer"`; adicionar `location: "Brasília-DF",` após `end`; em `projects`, após o ExpliQa acrescentar:

```ts
      { name: "SGP / GPES", description: "Party management and strategic research systems" },
```

- [ ] **Step 5: Rodar a suíte e confirmar que TUDO passa**

Run: `pnpm test`
Expected: PASS — incluindo os guards novos, o leak-check (`content.test.ts:18-25`) e `domain.test.ts`.

- [ ] **Step 6: Typecheck, lint e format**

Run: `pnpm typecheck && pnpm lint && pnpm format:check`
Expected: sem erros. Se `format:check` reclamar dos arquivos editados, rodar `pnpm format` e re-checar.

- [ ] **Step 7: Commit**

```bash
git add src/content/content.test.ts src/content/pt/experiences.ts src/content/en/experiences.ts
git commit -m "feat(content): enrich trajectory entries and standardize roles"
```

---

### Task 2: Verificação visual

**Files:** nenhum (somente verificação).

**Interfaces:** consome o dev server (`pnpm dev`).

- [ ] **Step 1: Subir o dev server**

Run: `pnpm dev` (background)
Expected: pronto em `http://localhost:3000`.

- [ ] **Step 2: Conferir a seção de trajetórias em pt e en**

Abrir `http://localhost:3000/pt` e `http://localhost:3000/en`, rolar até trajetórias e conferir:
- Ebserh com 8 stacks e o projeto "Sistema de gestão hospitalar" / "Hospital management system".
- VegaIT com o projeto SIM e location Brasil/Brazil.
- G4F com 38 stacks e 2 projetos (nenhum nome real de projeto interno).
- Cargos consistentes por idioma; localizações em todos os cards.

Expected: renderização correta, sem regressão visual (a UI não mudou; só listas maiores).

- [ ] **Step 3: Derrubar o dev server**

Encerrar o processo do `pnpm dev`.
