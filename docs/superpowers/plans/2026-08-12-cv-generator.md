# CV Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página pública `/{locale}/cv` onde o visitante marca/desmarca seções e itens do conteúdo do site e baixa um CV em PDF gerado no browser.

**Architecture:** Uma função pura `buildCvData(content, selection, locale)` filtra o `SiteContent` já validado e alimenta dois renderizadores: `CvPreview` (HTML ao vivo) e `CvDocument` (`@react-pdf/renderer`, importado dinamicamente só no clique de "Baixar PDF"). Estado da seleção vive num client component `CvBuilder`; a página é server component que injeta content + labels traduzidos.

**Tech Stack:** Next 16 App Router, next-intl, `@react-pdf/renderer` 4.6.0 (MIT, peer React 19 ok), Tailwind 4, vitest + testing-library.

**Spec:** `docs/superpowers/specs/2026-08-12-cv-generator-design.md`

## Global Constraints

- Este Next.js NÃO é o do seu conhecimento: leia o guia relevante em `node_modules/next/dist/docs/` antes de mexer em APIs do App Router (ver `AGENTS.md`).
- Dev server SEMPRE em `pnpm dev --port 3001` (porta 3000 é reservada a um container).
- Commits: Conventional Commits, subject minúsculo, imperativo, sem ponto final, NUNCA mencionar Claude/Anthropic/IA, sem trailer `Co-Authored-By`.
- `git add` só com paths explícitos — há outra sessão usando este checkout; `src/app/[locale]/opengraph-image.tsx` está modificado por ela e NÃO pode entrar em commit deste plano. O bloco em `AGENTS.md` é re-adicionado pelo `next dev`; se aparecer no diff, pode entrar no commit.
- Gates: `pnpm test`, `pnpm lint` (`--max-warnings=0`), `pnpm typecheck`, `pnpm format:check` devem passar ao fim de cada task.
- Idioma dos nomes de teste: português, seguindo o padrão existente (ex.: "copia o e-mail ao clicar").
- Client components recebem strings traduzidas por props (padrão `CopyEmailButton`); só a página usa `getTranslations`.
- Contatos (nome, role, email, GitHub, LinkedIn, localização, idiomas) SEMPRE presentes no CV — nunca condicionados à seleção.

---

### Task 1: Seleção — tipos, chaves e `defaultSelection`

**Files:**
- Create: `src/lib/cv/selection.ts`
- Test: `src/lib/cv/selection.test.ts`

**Interfaces:**
- Consumes: `SiteContent`, `Experience` de `@/domain`; `getContent` de `@/content` (só no teste).
- Produces (usado pelas Tasks 2, 4, 6):
  - `type CvSectionId = "summary" | "metrics" | "experiences" | "skills" | "certifications" | "education" | "caseStudy"`
  - `type CvSelection = { sections: Record<CvSectionId, boolean>; experiences: Record<string, boolean>; skills: Record<string, boolean>; certifications: Record<string, boolean>; education: Record<string, boolean> }`
  - `experienceKey(e: Pick<Experience, "company" | "start">): string`
  - `skillKey(categoryId: string, skillName: string): string`
  - `certificationKey(c: Pick<Certification, "name" | "issued">): string`
  - `educationKey(e: Pick<Education, "degree" | "institution">): string`
  - `defaultSelection(content: SiteContent): CvSelection`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/cv/selection.test.ts
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import {
  certificationKey,
  defaultSelection,
  educationKey,
  experienceKey,
  skillKey,
} from "./selection";

const content = getContent("pt");

describe("defaultSelection", () => {
  it("marca todas as seções por padrão", () => {
    const sel = defaultSelection(content);
    expect(Object.values(sel.sections)).toHaveLength(7);
    expect(Object.values(sel.sections).every(Boolean)).toBe(true);
  });

  it("cobre todos os itens do conteúdo, todos marcados", () => {
    const sel = defaultSelection(content);
    expect(Object.keys(sel.experiences)).toEqual(content.experiences.map(experienceKey));
    expect(Object.keys(sel.certifications)).toEqual(content.certifications.map(certificationKey));
    expect(Object.keys(sel.education)).toEqual(content.education.map(educationKey));
    expect(Object.keys(sel.skills)).toEqual(
      content.skillCategories.flatMap((cat) => cat.skills.map((s) => skillKey(cat.id, s.name))),
    );
    const items = { ...sel.experiences, ...sel.skills, ...sel.certifications, ...sel.education };
    expect(Object.values(items).every(Boolean)).toBe(true);
  });

  it("gera chaves únicas mesmo com nomes repetidos", () => {
    expect(experienceKey({ company: "ACME", start: "2020-01" })).not.toBe(
      experienceKey({ company: "ACME", start: "2022-05" }),
    );
    expect(certificationKey({ name: "Scrum Master", issued: "2020-01" })).not.toBe(
      certificationKey({ name: "Scrum Master", issued: "2023-06" }),
    );
    expect(educationKey({ degree: "Bacharelado", institution: "UnB" })).not.toBe(
      educationKey({ degree: "Bacharelado", institution: "IESB" }),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/cv/selection.test.ts`
Expected: FAIL — módulo `./selection` não existe.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/cv/selection.ts
import type { Certification, Education, Experience, SiteContent } from "@/domain";

export type CvSectionId =
  | "summary"
  | "metrics"
  | "experiences"
  | "skills"
  | "certifications"
  | "education"
  | "caseStudy";

export type CvSelection = {
  sections: Record<CvSectionId, boolean>;
  experiences: Record<string, boolean>;
  skills: Record<string, boolean>;
  certifications: Record<string, boolean>;
  education: Record<string, boolean>;
};

// Nomes sozinhos são únicos hoje, mas o par com um segundo campo blinda
// contra homônimos futuros (duas passagens pela mesma empresa, a mesma
// certificação de emissores/anos diferentes etc.).
export function experienceKey(e: Pick<Experience, "company" | "start">): string {
  return `${e.company}:${e.start}`;
}

export function skillKey(categoryId: string, skillName: string): string {
  return `${categoryId}:${skillName}`;
}

export function certificationKey(c: Pick<Certification, "name" | "issued">): string {
  return `${c.name}:${c.issued}`;
}

export function educationKey(e: Pick<Education, "degree" | "institution">): string {
  return `${e.degree}:${e.institution}`;
}

const allTrue = (keys: string[]): Record<string, boolean> =>
  Object.fromEntries(keys.map((k) => [k, true]));

export function defaultSelection(content: SiteContent): CvSelection {
  return {
    sections: {
      summary: true,
      metrics: true,
      experiences: true,
      skills: true,
      certifications: true,
      education: true,
      caseStudy: true,
    },
    experiences: allTrue(content.experiences.map(experienceKey)),
    skills: allTrue(
      content.skillCategories.flatMap((cat) => cat.skills.map((s) => skillKey(cat.id, s.name))),
    ),
    certifications: allTrue(content.certifications.map(certificationKey)),
    education: allTrue(content.education.map(educationKey)),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/cv/selection.test.ts`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/selection.ts src/lib/cv/selection.test.ts
git commit -m "feat(cv): add selection model with per-item keys and default"
```

---

### Task 2: `buildCvData` — filtragem pura

**Files:**
- Create: `src/lib/cv/build-cv-data.ts`
- Test: `src/lib/cv/build-cv-data.test.ts`

**Interfaces:**
- Consumes: `CvSelection`, `experienceKey`, `skillKey`, `certificationKey`, `educationKey` (Task 1); `SiteContent`, `Profile`, `Metric`, `Experience`, `SkillCategory`, `Certification`, `Education` de `@/domain`; `absoluteUrl`, `localizedPath` de `@/lib/site`; `Locale` de `@/content`.
- Produces (usado pelas Tasks 3, 5, 6):
  - `type CvData = { profile: Profile; summary: string | null; metrics: Metric[] | null; experiences: Experience[] | null; skillCategories: SkillCategory[] | null; certifications: Certification[] | null; education: Education[] | null; caseStudy: { title: string; tagline: string; url: string } | null }`
  - `buildCvData(content: SiteContent, selection: CvSelection, locale: Locale): CvData`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/cv/build-cv-data.test.ts
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { buildCvData } from "./build-cv-data";
import { defaultSelection, experienceKey, skillKey } from "./selection";

const content = getContent("pt");

describe("buildCvData", () => {
  it("com seleção default inclui todas as seções", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    expect(data.summary).toBe(content.profile.subheadline);
    expect(data.metrics).toEqual(content.profile.metrics);
    expect(data.experiences).toEqual(content.experiences);
    expect(data.skillCategories).toEqual(content.skillCategories);
    expect(data.certifications).toEqual(content.certifications);
    expect(data.education).toEqual(content.education);
    expect(data.caseStudy).toEqual({
      title: content.caseStudy.title,
      tagline: content.caseStudy.tagline,
      url: "https://brunocordeiro.dev/pt/link-charts",
    });
  });

  it("perfil/contatos sempre presentes, mesmo com tudo desmarcado", () => {
    const sel = defaultSelection(content);
    sel.sections = {
      summary: false,
      metrics: false,
      experiences: false,
      skills: false,
      certifications: false,
      education: false,
      caseStudy: false,
    };
    const data = buildCvData(content, sel, "pt");
    expect(data.profile).toEqual(content.profile);
    expect(data.summary).toBeNull();
    expect(data.metrics).toBeNull();
    expect(data.experiences).toBeNull();
    expect(data.skillCategories).toBeNull();
    expect(data.certifications).toBeNull();
    expect(data.education).toBeNull();
    expect(data.caseStudy).toBeNull();
  });

  it("filtra itens individuais desmarcados", () => {
    const sel = defaultSelection(content);
    const dropped = content.experiences[0]!;
    sel.experiences[experienceKey(dropped)] = false;
    const data = buildCvData(content, sel, "pt");
    expect(data.experiences).toHaveLength(content.experiences.length - 1);
    expect(data.experiences).not.toContainEqual(dropped);
  });

  it("categoria de skill sem itens marcados some; seção com zero itens vira null", () => {
    const sel = defaultSelection(content);
    const cat = content.skillCategories[0]!;
    for (const s of cat.skills) sel.skills[skillKey(cat.id, s.name)] = false;
    const partial = buildCvData(content, sel, "pt");
    expect(partial.skillCategories?.some((c) => c.id === cat.id)).toBe(false);

    for (const c of content.skillCategories)
      for (const s of c.skills) sel.skills[skillKey(c.id, s.name)] = false;
    expect(buildCvData(content, sel, "pt").skillCategories).toBeNull();
  });

  it("seção desmarcada esconde tudo mesmo com itens marcados", () => {
    const sel = defaultSelection(content);
    sel.sections.certifications = false;
    expect(buildCvData(content, sel, "pt").certifications).toBeNull();
  });

  it("usa o locale na URL do case study", () => {
    const data = buildCvData(content, defaultSelection(content), "en");
    expect(data.caseStudy?.url).toBe("https://brunocordeiro.dev/en/link-charts");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/cv/build-cv-data.test.ts`
Expected: FAIL — módulo `./build-cv-data` não existe.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/cv/build-cv-data.ts
import type {
  Certification,
  Education,
  Experience,
  Metric,
  Profile,
  SiteContent,
  SkillCategory,
} from "@/domain";
import type { Locale } from "@/content";
import { absoluteUrl, localizedPath } from "@/lib/site";
import {
  certificationKey,
  educationKey,
  experienceKey,
  skillKey,
  type CvSelection,
} from "./selection";

export type CvData = {
  profile: Profile;
  summary: string | null;
  metrics: Metric[] | null;
  experiences: Experience[] | null;
  skillCategories: SkillCategory[] | null;
  certifications: Certification[] | null;
  education: Education[] | null;
  caseStudy: { title: string; tagline: string; url: string } | null;
};

const orNull = <T>(arr: T[]): T[] | null => (arr.length > 0 ? arr : null);

export function buildCvData(
  content: SiteContent,
  selection: CvSelection,
  locale: Locale,
): CvData {
  const { sections } = selection;
  return {
    profile: content.profile,
    summary: sections.summary ? content.profile.subheadline : null,
    metrics: sections.metrics ? content.profile.metrics : null,
    experiences: sections.experiences
      ? orNull(content.experiences.filter((e) => selection.experiences[experienceKey(e)]))
      : null,
    skillCategories: sections.skills
      ? orNull(
          content.skillCategories
            .map((cat) => ({
              ...cat,
              skills: cat.skills.filter((s) => selection.skills[skillKey(cat.id, s.name)]),
            }))
            .filter((cat) => cat.skills.length > 0),
        )
      : null,
    certifications: sections.certifications
      ? orNull(content.certifications.filter((c) => selection.certifications[certificationKey(c)]))
      : null,
    education: sections.education
      ? orNull(content.education.filter((e) => selection.education[educationKey(e)]))
      : null,
    caseStudy: sections.caseStudy
      ? {
          title: content.caseStudy.title,
          tagline: content.caseStudy.tagline,
          url: absoluteUrl(localizedPath(locale, "/link-charts")),
        }
      : null,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/cv/build-cv-data.test.ts`
Expected: PASS (6 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/build-cv-data.ts src/lib/cv/build-cv-data.test.ts
git commit -m "feat(cv): add buildCvData pure filter over site content"
```

---

### Task 3: Labels compartilhados + `CvPreview` (HTML)

**Files:**
- Create: `src/lib/cv/labels.ts`
- Create: `src/components/cv/cv-preview.tsx`
- Test: `src/components/cv/cv-preview.test.tsx`

**Interfaces:**
- Consumes: `CvData` (Task 2); `CvSectionId` (Task 1); `formatPeriod` de `@/lib/dates`; `Locale` de `@/content`.
- Produces (usado pelas Tasks 4, 5, 6, 7):
  - `type CvLabels = { sections: Record<CvSectionId, string>; panelTitle: string; selectAll: string; clearAll: string; download: string; generating: string; downloadError: string; current: string; validUntil: string; caseStudyCta: string }` (em `src/lib/cv/labels.ts`)
  - `CvPreview({ data, locale, labels }: { data: CvData; locale: Locale; labels: CvLabels })` — componente de servidor/cliente neutro (sem `"use client"`, sem estado).

- [ ] **Step 1: Write `src/lib/cv/labels.ts`**

```ts
// src/lib/cv/labels.ts
import type { CvSectionId } from "./selection";

export type CvLabels = {
  sections: Record<CvSectionId, string>;
  panelTitle: string;
  selectAll: string;
  clearAll: string;
  download: string;
  generating: string;
  downloadError: string;
  current: string;
  validUntil: string;
  caseStudyCta: string;
};
```

- [ ] **Step 2: Write the shared test fixture**

Fixture compartilhado pelos testes das Tasks 3, 4 e 6. NÃO pode ter sufixo `.test.ts` (senão o vitest o coletaria e importá-lo de outro teste re-registraria testes).

```ts
// src/components/cv/test-labels.ts
import type { CvLabels } from "@/lib/cv/labels";

export const testLabels: CvLabels = {
  sections: {
    summary: "Resumo",
    metrics: "Métricas",
    experiences: "Experiências",
    skills: "Skills",
    certifications: "Certificações",
    education: "Educação",
    caseStudy: "Case study",
  },
  panelTitle: "Monte o CV",
  selectAll: "marcar todas",
  clearAll: "desmarcar todas",
  download: "Baixar PDF",
  generating: "Gerando…",
  downloadError: "Não foi possível gerar o PDF. Tente novamente.",
  current: "atual",
  validUntil: "válida até",
  caseStudyCta: "case study completo",
};
```

- [ ] **Step 3: Write the failing test**

```tsx
// src/components/cv/cv-preview.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { buildCvData } from "@/lib/cv/build-cv-data";
import { defaultSelection } from "@/lib/cv/selection";
import { testLabels } from "./test-labels";
import { CvPreview } from "./cv-preview";

const content = getContent("pt");

describe("CvPreview", () => {
  it("mostra contatos e todas as seções com seleção default", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    expect(screen.getByRole("heading", { name: content.profile.name })).toBeInTheDocument();
    expect(screen.getByText(content.profile.email)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experiências" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certificações" })).toBeInTheDocument();
    expect(screen.getByText(content.experiences[0]!.company, { exact: false })).toBeInTheDocument();
  });

  it("omite seção nula mas mantém contatos", () => {
    const sel = defaultSelection(content);
    sel.sections.experiences = false;
    const data = buildCvData(content, sel, "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    expect(screen.queryByRole("heading", { name: "Experiências" })).not.toBeInTheDocument();
    expect(screen.getByText(content.profile.email)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test src/components/cv/cv-preview.test.tsx`
Expected: FAIL — módulo `./cv-preview` não existe.

- [ ] **Step 5: Write implementation**

```tsx
// src/components/cv/cv-preview.tsx
import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="border-b border-border/50 pb-1 font-mono text-xs tracking-[0.2em] text-muted uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function CvPreview({
  data,
  locale,
  labels,
}: {
  data: CvData;
  locale: Locale;
  labels: CvLabels;
}) {
  const { profile } = data;
  return (
    <article className="flex flex-col gap-6 rounded-lg border border-border/50 bg-background p-6 text-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
        <p className="text-muted">{profile.role}</p>
        <p className="text-xs text-muted">
          {profile.email} · {profile.location} · {profile.languages}
        </p>
        <p className="text-xs text-muted">
          {profile.github} · {profile.linkedin}
        </p>
      </header>

      {data.summary ? <p className="text-muted">{data.summary}</p> : null}

      {data.metrics ? (
        <p className="text-xs text-muted">
          {data.metrics
            .map((m) => `${m.prefix ?? ""}${m.value}${m.suffix ?? ""} ${m.label}`)
            .join(" · ")}
        </p>
      ) : null}

      {data.experiences ? (
        <Section title={labels.sections.experiences}>
          {data.experiences.map((exp) => (
            <div key={`${exp.company}:${exp.start}`} className="flex flex-col gap-1">
              <p className="font-medium">
                {exp.role} — {exp.company}{" "}
                <span className="font-normal text-muted">
                  · {formatPeriod(exp.start, exp.end, locale, labels.current)}
                </span>
              </p>
              <p className="text-xs text-muted">{exp.stacks.join(" · ")}</p>
              {exp.projects.map((p) => (
                <p key={p.name} className="text-xs text-muted">
                  {p.name} — {p.description}
                </p>
              ))}
            </div>
          ))}
        </Section>
      ) : null}

      {data.skillCategories ? (
        <Section title={labels.sections.skills}>
          {data.skillCategories.map((cat) => (
            <div key={cat.id}>
              <p className="font-medium">{cat.title}</p>
              {cat.skills.map((s) => (
                <p key={s.name} className="text-xs text-muted">
                  {s.name} — {s.proof}
                </p>
              ))}
            </div>
          ))}
        </Section>
      ) : null}

      {data.certifications ? (
        <Section title={labels.sections.certifications}>
          {data.certifications.map((c) => (
            <p key={c.name} className="text-xs">
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-muted">
                — {c.issuer} · {formatYearMonth(c.issued, locale)}
                {c.expires ? ` (${labels.validUntil} ${formatYearMonth(c.expires, locale)})` : ""}
              </span>
            </p>
          ))}
        </Section>
      ) : null}

      {data.education ? (
        <Section title={labels.sections.education}>
          {data.education.map((e) => (
            <p key={e.degree} className="text-xs">
              <span className="font-medium">{e.degree}</span>{" "}
              <span className="text-muted">
                — {e.institution} · {e.period}
              </span>
            </p>
          ))}
        </Section>
      ) : null}

      {data.caseStudy ? (
        <Section title={labels.sections.caseStudy}>
          <p className="text-xs">
            <span className="font-medium">{data.caseStudy.title}</span>{" "}
            <span className="text-muted">— {data.caseStudy.tagline}</span>
          </p>
          <p className="text-xs text-muted">
            {labels.caseStudyCta}: {data.caseStudy.url}
          </p>
        </Section>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test src/components/cv/cv-preview.test.tsx`
Expected: PASS (2 testes).

- [ ] **Step 7: Commit**

```bash
git add src/lib/cv/labels.ts src/components/cv/test-labels.ts src/components/cv/cv-preview.tsx src/components/cv/cv-preview.test.tsx
git commit -m "feat(cv): add html preview and shared label types"
```

---

### Task 4: `SelectionPanel` — checkboxes de seções e itens

**Files:**
- Create: `src/components/cv/selection-panel.tsx`
- Test: `src/components/cv/selection-panel.test.tsx`

**Interfaces:**
- Consumes: `CvSelection`, `CvSectionId`, `experienceKey`, `skillKey`, `certificationKey`, `educationKey` (Task 1); `CvLabels` (Task 3); `SiteContent` de `@/domain`.
- Produces (usado pela Task 6):
  - `SelectionPanel({ content, selection, onChange, labels }: { content: SiteContent; selection: CvSelection; onChange: (next: CvSelection) => void; labels: CvLabels })` — client component controlado; `onChange` recebe a seleção inteira nova.

Comportamento:
- Checkbox de seção liga/desliga a seção (`sections[id]`). Com a seção desligada, os itens ficam `disabled`.
- Checkbox por item nas seções experiences/skills/certifications/education.
- Botão por seção com itens: `labels.clearAll` quando todos marcados, `labels.selectAll` caso contrário; alterna todos os itens da seção.
- Sem estado interno — componente 100% controlado por `selection`/`onChange`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/cv/selection-panel.test.tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getContent } from "@/content";
import { defaultSelection, experienceKey } from "@/lib/cv/selection";
import { testLabels } from "./test-labels";
import { SelectionPanel } from "./selection-panel";

const content = getContent("pt");

describe("SelectionPanel", () => {
  it("desmarca uma experiência individual", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    const first = content.experiences[0]!;
    await userEvent.click(screen.getByRole("checkbox", { name: `${first.role} — ${first.company}` }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].experiences[experienceKey(first)]).toBe(false);
  });

  it("desliga uma seção inteira", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Certificações" }));
    expect(onChange.mock.calls[0]![0].sections.certifications).toBe(false);
  });

  it("'desmarcar todas' zera os itens da seção", async () => {
    const onChange = vi.fn();
    render(
      <SelectionPanel
        content={content}
        selection={defaultSelection(content)}
        onChange={onChange}
        labels={testLabels}
      />,
    );
    const section = screen.getByRole("group", { name: "Experiências" });
    await userEvent.click(within(section).getByRole("button", { name: "desmarcar todas" }));
    const next = onChange.mock.calls[0]![0];
    expect(Object.values(next.experiences).every((v: boolean) => v === false)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/cv/selection-panel.test.tsx`
Expected: FAIL — módulo `./selection-panel` não existe.

- [ ] **Step 3: Write implementation**

```tsx
// src/components/cv/selection-panel.tsx
"use client";

import type { SiteContent } from "@/domain";
import type { CvLabels } from "@/lib/cv/labels";
import {
  certificationKey,
  educationKey,
  experienceKey,
  skillKey,
  type CvSectionId,
  type CvSelection,
} from "@/lib/cv/selection";

type ItemGroup = keyof Omit<CvSelection, "sections">;

function Checkbox({
  label,
  checked,
  disabled,
  onToggle,
  bold,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  bold?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm ${bold ? "font-medium" : "text-muted"} ${disabled ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        className="accent-accent"
        aria-label={label}
      />
      {label}
    </label>
  );
}

export function SelectionPanel({
  content,
  selection,
  onChange,
  labels,
}: {
  content: SiteContent;
  selection: CvSelection;
  onChange: (next: CvSelection) => void;
  labels: CvLabels;
}) {
  const toggleSection = (id: CvSectionId) =>
    onChange({
      ...selection,
      sections: { ...selection.sections, [id]: !selection.sections[id] },
    });

  const toggleItem = (group: ItemGroup, key: string) =>
    onChange({
      ...selection,
      [group]: { ...selection[group], [key]: !selection[group][key] },
    });

  const setAll = (group: ItemGroup, value: boolean) =>
    onChange({
      ...selection,
      [group]: Object.fromEntries(Object.keys(selection[group]).map((k) => [k, value])),
    });

  const sectionGroup = ({
    id,
    group,
    items,
  }: {
    id: CvSectionId;
    group: ItemGroup;
    items: { key: string; label: string }[];
  }) => {
    const enabled = selection.sections[id];
    const allChecked = Object.values(selection[group]).every(Boolean);
    return (
      <fieldset key={id} className="flex flex-col gap-2" aria-label={labels.sections[id]}>
        <div className="flex items-center justify-between">
          <Checkbox
            bold
            label={labels.sections[id]}
            checked={enabled}
            onToggle={() => toggleSection(id)}
          />
          <button
            type="button"
            disabled={!enabled}
            onClick={() => setAll(group, !allChecked)}
            className="text-xs text-accent underline-offset-4 hover:underline disabled:opacity-50"
          >
            {allChecked ? labels.clearAll : labels.selectAll}
          </button>
        </div>
        <div className="flex flex-col gap-1 pl-6">
          {items.map((item) => (
            <Checkbox
              key={item.key}
              label={item.label}
              checked={selection[group][item.key] ?? false}
              disabled={!enabled}
              onToggle={() => toggleItem(group, item.key)}
            />
          ))}
        </div>
      </fieldset>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {(["summary", "metrics"] as const).map((id) => (
        <Checkbox
          key={id}
          bold
          label={labels.sections[id]}
          checked={selection.sections[id]}
          onToggle={() => toggleSection(id)}
        />
      ))}
      {sectionGroup({
        id: "experiences",
        group: "experiences",
        items: content.experiences.map((e) => ({
          key: experienceKey(e),
          label: `${e.role} — ${e.company}`,
        })),
      })}
      {sectionGroup({
        id: "skills",
        group: "skills",
        items: content.skillCategories.flatMap((cat) =>
          cat.skills.map((s) => ({
            key: skillKey(cat.id, s.name),
            label: `${cat.title}: ${s.name}`,
          })),
        ),
      })}
      {sectionGroup({
        id: "certifications",
        group: "certifications",
        items: content.certifications.map((c) => ({ key: certificationKey(c), label: c.name })),
      })}
      {sectionGroup({
        id: "education",
        group: "education",
        items: content.education.map((e) => ({ key: educationKey(e), label: e.degree })),
      })}
      <Checkbox
        bold
        label={labels.sections.caseStudy}
        checked={selection.sections.caseStudy}
        onToggle={() => toggleSection("caseStudy")}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/cv/selection-panel.test.tsx`
Expected: PASS (3 testes). Se o teste do `within` falhar por sintaxe, simplifique importando `within` de `@testing-library/react` no topo do teste.

- [ ] **Step 5: Commit**

```bash
git add src/components/cv/selection-panel.tsx src/components/cv/selection-panel.test.tsx
git commit -m "feat(cv): add controlled selection panel"
```

---

### Task 5: instalar `@react-pdf/renderer` + `CvDocument`

**Files:**
- Modify: `package.json` (via pnpm)
- Create: `src/components/cv/cv-document.tsx`

**Interfaces:**
- Consumes: `CvData` (Task 2), `CvLabels` (Task 3), `formatPeriod` de `@/lib/dates`, `Locale` de `@/content`.
- Produces (usado pela Task 6 via `import()` dinâmico):
  - `CvDocument({ data, locale, labels }: { data: CvData; locale: Locale; labels: CvLabels }): JSX.Element` — árvore `@react-pdf/renderer` pronta para `pdf(...).toBlob()`.

Sem teste unitário (decisão do spec: não testamos o binário PDF; o gate é `pnpm typecheck` + verificação manual na Task 8).

- [ ] **Step 1: Install the library**

Run: `pnpm add @react-pdf/renderer`
Expected: `@react-pdf/renderer` 4.6.x em `dependencies`.

- [ ] **Step 2: Write `CvDocument`**

Fontes: usar as standard fonts built-in (`Helvetica`/`Helvetica-Bold`) — zero registro de fonte, PDF leve e sóbrio.

```tsx
// src/components/cv/cv-document.tsx
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#1a1a1a", padding: 40, lineHeight: 1.4 },
  name: { fontFamily: "Helvetica-Bold", fontSize: 20 },
  role: { fontSize: 11, color: "#555", marginTop: 2 },
  contact: { fontSize: 8, color: "#555", marginTop: 2 },
  link: { color: "#1a56db", textDecoration: "none" },
  section: { marginTop: 14 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#888",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 3,
    marginBottom: 6,
  },
  entry: { marginBottom: 8 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  entryMeta: { fontSize: 8, color: "#555", marginTop: 1 },
  body: { fontSize: 9, color: "#333", marginTop: 2 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function CvDocument({
  data,
  locale,
  labels,
}: {
  data: CvData;
  locale: Locale;
  labels: CvLabels;
}) {
  const { profile } = data;
  return (
    <Document title={`${profile.name} — CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.role}</Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={`mailto:${profile.email}`}>
            {profile.email}
          </Link>
          {`  ·  ${profile.location}  ·  ${profile.languages}`}
        </Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={profile.github}>
            {profile.github}
          </Link>
          {"  ·  "}
          <Link style={styles.link} src={profile.linkedin}>
            {profile.linkedin}
          </Link>
        </Text>

        {data.summary ? <Text style={[styles.body, styles.section]}>{data.summary}</Text> : null}

        {data.metrics ? (
          <Text style={[styles.entryMeta, { marginTop: 8 }]}>
            {data.metrics
              .map((m) => `${m.prefix ?? ""}${m.value}${m.suffix ?? ""} ${m.label}`)
              .join("  ·  ")}
          </Text>
        ) : null}

        {data.experiences ? (
          <Section title={labels.sections.experiences}>
            {data.experiences.map((exp) => (
              <View key={`${exp.company}:${exp.start}`} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>
                  {exp.role} — {exp.company}
                </Text>
                <Text style={styles.entryMeta}>
                  {formatPeriod(exp.start, exp.end, locale, labels.current)}
                  {"  ·  "}
                  {exp.stacks.join(" · ")}
                </Text>
                {exp.projects.map((p) => (
                  <Text key={p.name} style={styles.body}>
                    {p.name} — {p.description}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {data.skillCategories ? (
          <Section title={labels.sections.skills}>
            {data.skillCategories.map((cat) => (
              <View key={cat.id} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>{cat.title}</Text>
                {cat.skills.map((s) => (
                  <Text key={s.name} style={styles.body}>
                    {s.name} — {s.proof}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {data.certifications ? (
          <Section title={labels.sections.certifications}>
            {data.certifications.map((c) => (
              <View key={c.name} style={styles.entry} wrap={false}>
                <Text style={styles.body}>
                  <Text style={styles.entryTitle}>{c.name}</Text>
                  {` — ${c.issuer} · ${formatYearMonth(c.issued, locale)}`}
                  {c.expires ? ` (${labels.validUntil} ${formatYearMonth(c.expires, locale)})` : ""}
                  {c.credentialUrl ? (
                    <>
                      {"  ·  "}
                      <Link style={styles.link} src={c.credentialUrl}>
                        {c.credentialUrl}
                      </Link>
                    </>
                  ) : null}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        {data.education ? (
          <Section title={labels.sections.education}>
            {data.education.map((e) => (
              <Text key={e.degree} style={styles.body}>
                <Text style={styles.entryTitle}>{e.degree}</Text>
                {` — ${e.institution} · ${e.period}`}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.caseStudy ? (
          <Section title={labels.sections.caseStudy}>
            <Text style={styles.body}>
              <Text style={styles.entryTitle}>{data.caseStudy.title}</Text>
              {` — ${data.caseStudy.tagline}`}
            </Text>
            <Text style={styles.body}>
              {labels.caseStudyCta}
              {": "}
              <Link style={styles.link} src={data.caseStudy.url}>
                {data.caseStudy.url}
              </Link>
            </Text>
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
```

- [ ] **Step 3: Typecheck as the gate**

Run: `pnpm typecheck`
Expected: sem erros. (Se `Link` dentro de `Text` reclamar de tipos, mover o `Link` para fora do `Text` num `View` com `flexDirection: "row"` — a API real está em `node_modules/@react-pdf/renderer` e na doc da lib.)

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/cv/cv-document.tsx
git commit -m "feat(cv): add react-pdf document template"
```

---

### Task 6: `CvBuilder` — estado, preview ao vivo e download

**Files:**
- Create: `src/components/cv/cv-builder.tsx`
- Test: `src/components/cv/cv-builder.test.tsx`

**Interfaces:**
- Consumes: `defaultSelection`, `CvSelection` (Task 1); `buildCvData` (Task 2); `CvPreview`, `CvLabels` (Task 3); `SelectionPanel` (Task 4); `CvDocument` + `@react-pdf/renderer` via `import()` dinâmico no clique (Task 5); `Button` de `@/components/ui/button`.
- Produces (usado pela Task 7):
  - `CvBuilder({ content, locale, labels }: { content: SiteContent; locale: Locale; labels: CvLabels })` — client component raiz da página.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/cv/cv-builder.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { pdf } from "@react-pdf/renderer";
import { getContent } from "@/content";
import { testLabels } from "./test-labels";
import { CvBuilder } from "./cv-builder";

// interceptados também pelo import() dinâmico do handler de download
vi.mock("@react-pdf/renderer", () => ({
  pdf: vi.fn(() => ({ toBlob: async () => new Blob(["pdf"]) })),
}));
vi.mock("./cv-document", () => ({ CvDocument: () => null }));

const content = getContent("pt");

describe("CvBuilder", () => {
  it("desmarcar seção no painel remove a seção do preview", async () => {
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    expect(screen.getByRole("heading", { name: "Certificações" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Certificações" }));
    expect(screen.queryByRole("heading", { name: "Certificações" })).not.toBeInTheDocument();
  });

  it("baixa o PDF via object URL", async () => {
    const createObjectURL = vi.fn(() => "blob:cv");
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    await userEvent.click(screen.getByRole("button", { name: "Baixar PDF" }));
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:cv");
  });

  it("mostra erro traduzido quando a geração falha", async () => {
    vi.mocked(pdf).mockImplementationOnce(() => {
      throw new Error("boom");
    });
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    await userEvent.click(screen.getByRole("button", { name: "Baixar PDF" }));
    expect(await screen.findByText(testLabels.downloadError)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/cv/cv-builder.test.tsx`
Expected: FAIL — módulo `./cv-builder` não existe.

- [ ] **Step 3: Write implementation**

```tsx
// src/components/cv/cv-builder.tsx
"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/content";
import type { SiteContent } from "@/domain";
import { buildCvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { defaultSelection, type CvSelection } from "@/lib/cv/selection";
import { Button } from "@/components/ui/button";
import { CvPreview } from "./cv-preview";
import { SelectionPanel } from "./selection-panel";

type DownloadStatus = "idle" | "generating" | "error";

export function CvBuilder({
  content,
  locale,
  labels,
}: {
  content: SiteContent;
  locale: Locale;
  labels: CvLabels;
}) {
  const [selection, setSelection] = useState<CvSelection>(() => defaultSelection(content));
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const data = useMemo(() => buildCvData(content, selection, locale), [content, selection, locale]);

  async function handleDownload() {
    setStatus("generating");
    try {
      // a lib (~500 KB gzip) só chega ao browser aqui, no primeiro clique
      const [{ pdf }, { CvDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./cv-document"),
      ]);
      const blob = await pdf(
        <CvDocument data={data} locale={locale} labels={labels} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `bruno-cordeiro-cv-${locale}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
        <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          {labels.panelTitle}
        </h2>
        <SelectionPanel
          content={content}
          selection={selection}
          onChange={setSelection}
          labels={labels}
        />
        <div className="flex flex-col gap-2">
          <Button onClick={handleDownload} disabled={status === "generating"}>
            {status === "generating" ? labels.generating : labels.download}
          </Button>
          {status === "error" ? (
            <p role="alert" className="text-sm text-red-500">
              {labels.downloadError}
            </p>
          ) : null}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <CvPreview data={data} locale={locale} labels={labels} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/cv/cv-builder.test.tsx`
Expected: PASS (3 testes).

- [ ] **Step 5: Run full gates**

Run: `pnpm test && pnpm typecheck`
Expected: suite inteira verde.

- [ ] **Step 6: Commit**

```bash
git add src/components/cv/cv-builder.tsx src/components/cv/cv-builder.test.tsx
git commit -m "feat(cv): add builder with live preview and pdf download"
```

---

### Task 7: mensagens + rota `/{locale}/cv`

**Files:**
- Modify: `messages/pt.json` (adicionar namespace `cv` e `footer.downloadCv`)
- Modify: `messages/en.json` (idem)
- Create: `src/app/[locale]/cv/page.tsx`

**Interfaces:**
- Consumes: `CvBuilder` (Task 6), `CvLabels` (Task 3), `getContent`/`Locale` de `@/content`, `buildPageMetadata` de `@/lib/site`, `SiteHeader`/`SiteFooter` de `@/components/layout/*`, `getTranslations`/`setRequestLocale` de `next-intl/server`.
- Produces: rota `/pt/cv` e `/en/cv`; namespace de mensagens `cv` (usado também no teste de paridade `src/i18n/messages.test.ts`, que deve continuar verde); chave `footer.downloadCv` (usada na Task 8).

- [ ] **Step 1: Add messages (pt)**

Em `messages/pt.json`, adicionar dentro do objeto raiz (ordem alfabética não é exigida; seguir o estilo do arquivo) e acrescentar `downloadCv` ao bloco `footer` existente:

```json
"cv": {
  "pageTitle": "Currículo",
  "pageDescription": "Monte e baixe o currículo de Bruno Cordeiro em PDF — escolha as seções, experiências e skills que interessam.",
  "panelTitle": "Monte o CV",
  "selectAll": "marcar todas",
  "clearAll": "desmarcar todas",
  "download": "Baixar PDF",
  "generating": "Gerando…",
  "downloadError": "Não foi possível gerar o PDF. Tente novamente.",
  "caseStudyCta": "case study completo",
  "sections": {
    "summary": "Resumo",
    "metrics": "Métricas",
    "experiences": "Experiências",
    "skills": "Skills",
    "certifications": "Certificações",
    "education": "Educação",
    "caseStudy": "Case study"
  }
},
```

```json
"footer": {
  "builtWith": "feito com next 16 — repo público",
  "downloadCv": "baixar CV"
}
```

- [ ] **Step 2: Add messages (en)**

Em `messages/en.json`, os mesmos caminhos:

```json
"cv": {
  "pageTitle": "Résumé",
  "pageDescription": "Build and download Bruno Cordeiro's résumé as a PDF — pick the sections, roles and skills that matter to you.",
  "panelTitle": "Build the CV",
  "selectAll": "select all",
  "clearAll": "clear all",
  "download": "Download PDF",
  "generating": "Generating…",
  "downloadError": "Could not generate the PDF. Please try again.",
  "caseStudyCta": "full case study",
  "sections": {
    "summary": "Summary",
    "metrics": "Metrics",
    "experiences": "Experience",
    "skills": "Skills",
    "certifications": "Certifications",
    "education": "Education",
    "caseStudy": "Case study"
  }
},
```

```json
"footer": {
  "builtWith": "built with next 16 — public repo",
  "downloadCv": "download CV"
}
```

- [ ] **Step 3: Run messages parity test**

Run: `pnpm test src/i18n/messages.test.ts`
Expected: PASS — as chaves foram adicionadas em espelho nos dois arquivos.

- [ ] **Step 4: Write the page**

Antes de escrever, conferir o guia de páginas/rotas em `node_modules/next/dist/docs/01-app/` se qualquer API abaixo parecer diferente do esperado.

```tsx
// src/app/[locale]/cv/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getContent, type Locale } from "@/content";
import { buildPageMetadata } from "@/lib/site";
import type { CvLabels } from "@/lib/cv/labels";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CvBuilder } from "@/components/cv/cv-builder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cv" });
  return buildPageMetadata({
    locale,
    path: "/cv",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function CvPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const t = await getTranslations({ locale, namespace: "cv" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const labels: CvLabels = {
    sections: {
      summary: t("sections.summary"),
      metrics: t("sections.metrics"),
      experiences: t("sections.experiences"),
      skills: t("sections.skills"),
      certifications: t("sections.certifications"),
      education: t("sections.education"),
      caseStudy: t("sections.caseStudy"),
    },
    panelTitle: t("panelTitle"),
    selectAll: t("selectAll"),
    clearAll: t("clearAll"),
    download: t("download"),
    generating: t("generating"),
    downloadError: t("downloadError"),
    current: tCommon("current"),
    validUntil: tCommon("validUntil"),
    caseStudyCta: t("caseStudyCta"),
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">{t("pageTitle")}</h1>
        <CvBuilder content={content} locale={locale} labels={labels} />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5: Verify the route renders**

Run: `pnpm dev --port 3001` (background) e abrir `http://localhost:3001/pt/cv` e `http://localhost:3001/en/cv`.
Expected: página renderiza com painel + preview, sem erro no console do dev server. Encerrar o server depois.

- [ ] **Step 6: Run gates and commit**

Run: `pnpm test && pnpm typecheck && pnpm lint`
Expected: verde.

```bash
git add messages/pt.json messages/en.json 'src/app/[locale]/cv/page.tsx'
git commit -m "feat(cv): add /cv route with localized builder page"
```

---

### Task 8: footer, sitemap e verificação final

**Files:**
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/app/sitemap.ts` (linha do `ROUTES`)
- Modify: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: chave `footer.downloadCv` (Task 7); `TransitionLink` de `@/components/motion/transition-link`; rota `/cv` (Task 7).
- Produces: link "baixar CV" no footer de todas as páginas; `/pt/cv` e `/en/cv` no sitemap.

- [ ] **Step 1: Update the failing sitemap test first**

Em `src/app/sitemap.test.ts`, atualizar o segundo teste:

```ts
  it("cobre home, link-charts e cv nos dois locales com alternates pt", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://brunocordeiro.dev/pt");
    expect(urls).toContain("https://brunocordeiro.dev/pt/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/pt/cv");
    expect(urls).toContain("https://brunocordeiro.dev/en");
    expect(urls).toContain("https://brunocordeiro.dev/en/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/en/cv");
    const home = entries.find((e) => e.url === "https://brunocordeiro.dev/pt");
    expect(home?.alternates?.languages).toHaveProperty("pt");
    expect(home?.alternates?.languages).toHaveProperty("pt-BR");
  });
```

Run: `pnpm test src/app/sitemap.test.ts`
Expected: FAIL — `/pt/cv` ausente.

- [ ] **Step 2: Add the route to the sitemap**

Em `src/app/sitemap.ts`:

```ts
const ROUTES = ["", "/link-charts", "/cv"] as const;
```

Run: `pnpm test src/app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 3: Add footer link**

Em `src/components/layout/site-footer.tsx`, adicionar o import e o link ao lado do `viewSource` (mesmo estilo):

```tsx
import { TransitionLink } from "@/components/motion/transition-link";
```

```tsx
        <div className="flex items-center gap-4">
          <TransitionLink
            href="/cv"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("footer.downloadCv")}
          </TransitionLink>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("common.viewSource")}
          </a>
        </div>
```

(O `<a>` existente move para dentro do novo `div`; o `<p>{t("footer.builtWith")}</p>` fica como está.)

- [ ] **Step 4: Full verification**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm format:check`
Expected: tudo verde. Se `format:check` reclamar, rodar `pnpm format` e conferir o diff.

Verificação manual (obrigatória — spec exige download funcionando):
1. `pnpm dev --port 3001` (background).
2. Abrir `http://localhost:3001/pt/cv`.
3. Desmarcar uma experiência e a seção Métricas → preview atualiza.
4. Clicar "Baixar PDF" → arquivo `bruno-cordeiro-cv-pt.pdf` baixa; abrir e conferir: contatos no topo, seções refletem a seleção, links clicáveis, texto selecionável.
5. Repetir download em `http://localhost:3001/en/cv` (arquivo `bruno-cordeiro-cv-en.pdf`).
6. Conferir link "baixar CV" no footer da home.
7. Encerrar o dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/site-footer.tsx src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat(cv): link cv page from footer and sitemap"
```
