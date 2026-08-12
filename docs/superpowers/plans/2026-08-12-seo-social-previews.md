# SEO e Previews Sociais — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Melhorar o preview de compartilhamento (WhatsApp/LinkedIn/Threads/X) com uma OG image rica e fechar as lacunas de SEO (copy, JSON-LD, apple-icon, hreflang `pt`, sitemap estável, manifest) descritas no spec `docs/superpowers/specs/2026-08-12-seo-social-previews-design.md`.

**Architecture:** Tudo dentro das convenções do Next.js 16 App Router já usadas pelo projeto: campos novos no `Profile` (Zod) alimentam `generateMetadata`, a OG image (`ImageResponse`) e o JSON-LD; arquivos de convenção (`apple-icon.tsx`, `manifest.ts`) completam a higiene. Nenhuma dependência nova.

**Tech Stack:** Next.js 16.3 (App Router, `next/og`), TypeScript, Zod, next-intl, Vitest + Testing Library, pnpm.

## Global Constraints

- **Working tree compartilhado com outra sessão**: há arquivos modificados que NÃO são deste trabalho (`case-chapter.tsx`, `case-study-card.tsx`, `timeline.tsx`, `experiences.ts` pt/en, `mob*.mjs`). `git add` SEMPRE com paths explícitos — nunca `git add -A`/`.`/`-u`. Antes de cada commit, rode `git status --short` e confira que só os seus paths entram.
- **Commits**: Conventional Commits (`type(scope): descrição`), subject < 72 chars, imperativo, minúsculas, sem ponto final. NUNCA mencionar Claude/Anthropic/IA nem trailers `Co-Authored-By`.
- **Copy budgets** (do spec): `metaDescription` 80–170 chars (alvo ~150); title mantém `"{name} — {role}"`; chips `stackHighlights` com 3–6 itens.
- **Paleta OG/ícones** (do spec): fundo `#09090b`, accent `#3fdd78`, borda `#27272a`, texto `#fafafa`/`#a1a1aa`.
- **OG image**: PNG < 600KB (limite prático do WhatsApp).
- **Next 16**: em `opengraph-image.tsx`/`apple-icon.tsx` o default export recebe `params` como **Promise**; `generateImageMetadata` recebe `params` **síncrono**. Docs locais: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`.
- Comandos: `pnpm test` (vitest run), `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm dev`.

---

### Task 1: Campos de SEO no domínio e no conteúdo (`metaDescription`, `stackHighlights`)

**Files:**

- Modify: `src/domain/profile.ts`
- Modify: `src/content/pt/profile.ts`
- Modify: `src/content/en/profile.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**

- Consumes: `getContent(locale).profile` (já existe).
- Produces: `Profile.metaDescription: string` (80–170 chars) e `Profile.stackHighlights: string[]` (3–6 itens) — consumidos pelas Tasks 3 e 5.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao final do `describe("conteúdo", ...)` em `src/content/content.test.ts`:

```ts
it("perfil traz campos de SEO dentro do orçamento de caracteres", () => {
  for (const locale of locales) {
    const { profile } = getContent(locale);
    expect(profile.metaDescription.length).toBeGreaterThanOrEqual(80);
    expect(profile.metaDescription.length).toBeLessThanOrEqual(170);
    expect(profile.stackHighlights.length).toBeGreaterThanOrEqual(3);
    expect(profile.stackHighlights.length).toBeLessThanOrEqual(6);
  }
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test -- src/content/content.test.ts`
Expected: FAIL (`metaDescription` é `undefined` → TypeError em `.length`).

- [ ] **Step 3: Implementar schema + conteúdo**

Em `src/domain/profile.ts`, dentro de `profileSchema`, logo após a linha de `subheadline`:

```ts
  metaDescription: z.string().min(80).max(170), // description SERP/OG — alvo ~150 chars, com keywords da stack
  stackHighlights: z.array(z.string().min(1)).min(3).max(6), // chips da OG image
```

Em `src/content/pt/profile.ts`, após `subheadline`:

```ts
  metaDescription:
    "Desenvolvedor full-stack sênior em Brasília — há 10+ anos do primeiro commit ao deploy sem downtime, com TypeScript, Node.js, React, CI/CD e Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
```

Em `src/content/en/profile.ts`, após `subheadline`:

```ts
  metaDescription:
    "Senior full-stack developer in Brasília, Brazil — 10+ years from first commit to zero-downtime deploys, with TypeScript, Node.js, React, CI/CD and Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
```

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm test -- src/content/content.test.ts`
Expected: PASS (todos os its, incluindo paridade estrutural e leak-checks).

- [ ] **Step 5: Commit**

```bash
git status --short  # conferir que só os 4 paths abaixo são seus
git add src/domain/profile.ts src/content/pt/profile.ts src/content/en/profile.ts src/content/content.test.ts
git commit -m "feat(content): add seo meta fields to profile"
```

---

### Task 2: hreflang `pt` genérico + helper `languageTag`

**Files:**

- Modify: `src/lib/site.ts`
- Test (create): `src/lib/site.test.ts`

**Interfaces:**

- Consumes: nada novo.
- Produces: `languageAlternates(path)` agora emite chave `"pt"` além de `"pt-BR"`/`"en"`/`"x-default"`; novo `languageTag(locale: Locale): string` (`"pt" → "pt-BR"`, `"en" → "en"`) — consumido pela Task 3.

- [ ] **Step 1: Escrever os testes que falham**

Criar `src/lib/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildPageMetadata, languageAlternates, languageTag, SITE_URL } from "./site";

describe("languageAlternates", () => {
  it("emite pt, pt-BR, en e x-default", () => {
    const alt = languageAlternates("");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt`);
    expect(alt["en"]).toBe(`${SITE_URL}/en`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/pt`);
  });
  it("propaga o path para todas as línguas", () => {
    const alt = languageAlternates("/link-charts");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt/link-charts`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt/link-charts`);
    expect(alt["en"]).toBe(`${SITE_URL}/en/link-charts`);
  });
});

describe("languageTag", () => {
  it("mapeia locale para a tag BCP 47 canônica", () => {
    expect(languageTag("pt")).toBe("pt-BR");
    expect(languageTag("en")).toBe("en");
  });
});

describe("buildPageMetadata", () => {
  it("mantém canonical, OG e twitter coerentes por locale", () => {
    const meta = buildPageMetadata({ locale: "en", title: "T", description: "D" });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/en`);
    expect(meta.openGraph).toMatchObject({ url: `${SITE_URL}/en`, locale: "en_US" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test -- src/lib/site.test.ts`
Expected: FAIL — `languageTag` não é exportado (SyntaxError/undefined) e `alt["pt"]` é `undefined`.

- [ ] **Step 3: Implementar em `src/lib/site.ts`**

Substituir a linha `const LANGUAGE_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en" };` por:

```ts
// hreflang: além da tag regional, emitimos o "pt" genérico (cobre pt-PT etc.).
const LANGUAGE_TAGS: Record<Locale, string[]> = { pt: ["pt", "pt-BR"], en: ["en"] };
const CANONICAL_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Tag BCP 47 canônica do locale, ex.: `languageTag("pt")` → `"pt-BR"`. */
export function languageTag(locale: Locale): string {
  return CANONICAL_TAG[locale];
}
```

E substituir o corpo de `languageAlternates` por:

```ts
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.flatMap((locale) =>
        LANGUAGE_TAGS[locale].map((tag) => [tag, absoluteUrl(localizedPath(locale, path))]),
      ),
    ),
    "x-default": absoluteUrl(localizedPath(defaultLocale, path)),
  };
}
```

(`OG_LOCALE` e o restante do arquivo ficam como estão.)

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm test -- src/lib/site.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git status --short
git add src/lib/site.ts src/lib/site.test.ts
git commit -m "feat(seo): emit generic pt hreflang alternate"
```

---

### Task 3: `metaDescription` no layout + JSON-LD `@graph` (WebSite/ProfilePage/Person)

**Files:**

- Modify: `src/components/seo/person-json-ld.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/components/seo/person-json-ld.test.tsx`

**Interfaces:**

- Consumes: `Profile.metaDescription` (Task 1); `languageTag(locale)` (Task 2); `absoluteUrl`/`localizedPath`/`SITE_URL` de `@/lib/site`.
- Produces: `PersonJsonLd` passa a exigir prop `locale: Locale` e emite `@graph`.

- [ ] **Step 1: Reescrever o teste para o novo shape (falha primeiro)**

Substituir todo o conteúdo de `src/components/seo/person-json-ld.test.tsx` por:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonJsonLd } from "./person-json-ld";
import { getContent } from "@/content";

type Node = Record<string, any>;

function graphFor(locale: "pt" | "en"): Node[] {
  const { container } = render(
    <PersonJsonLd profile={getContent(locale).profile} locale={locale} />,
  );
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? "{}")["@graph"] ?? [];
}

describe("PersonJsonLd", () => {
  it("emite @graph com WebSite, ProfilePage e Person interligados", () => {
    const graph = graphFor("pt");
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebSite", "ProfilePage", "Person"]));
    const profilePage = graph.find((n) => n["@type"] === "ProfilePage")!;
    const person = graph.find((n) => n["@type"] === "Person")!;
    const website = graph.find((n) => n["@type"] === "WebSite")!;
    expect(profilePage.mainEntity["@id"]).toBe(person["@id"]);
    expect(profilePage.isPartOf["@id"]).toBe(website["@id"]);
    expect(website.name).toBe("Bruno Cordeiro");
  });
  it("localiza inLanguage e a URL da página", () => {
    const pagePt = graphFor("pt").find((n) => n["@type"] === "ProfilePage")!;
    const pageEn = graphFor("en").find((n) => n["@type"] === "ProfilePage")!;
    expect(pagePt.inLanguage).toBe("pt-BR");
    expect(pagePt.url).toBe("https://brunocordeiro.dev/pt");
    expect(pageEn.inLanguage).toBe("en");
    expect(pageEn.url).toBe("https://brunocordeiro.dev/en");
  });
  it("mantém o Person com sameAs e credenciais", () => {
    const person = graphFor("pt").find((n) => n["@type"] === "Person")!;
    expect(person.sameAs).toContain("https://github.com/bcordeirodev");
    expect(person.sameAs).toContain("https://www.scrum.org/user/1506558");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test -- src/components/seo/person-json-ld.test.tsx`
Expected: FAIL — componente atual não aceita `locale` nem emite `@graph` (`graph` vem vazio).

- [ ] **Step 3: Implementar o componente**

Em `src/components/seo/person-json-ld.tsx`: adicionar imports/prop e trocar a montagem de `data`. O arquivo completo fica:

```tsx
import type { Certification, Education, Profile } from "@/domain";
import type { Locale } from "@/content";
import { absoluteUrl, languageTag, localizedPath, SITE_URL } from "@/lib/site";

/**
 * Parses `profile.location` (e.g. "Brasília-DF, Brasil" / "Brasília-DF,
 * Brazil") into a schema.org `PostalAddress` shape. `addressCountry` is
 * always the ISO 3166-1 alpha-2 code, not derived from the localized
 * country name in the source string.
 */
function parseAddress(location: string): {
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
} {
  const [cityRegion] = location.split(",");
  const [locality, region] = (cityRegion ?? "").trim().split("-");
  return {
    addressLocality: locality?.trim() || "Brasília",
    addressRegion: region?.trim() || "DF",
    addressCountry: "BR",
  };
}

/**
 * Emits a schema.org `@graph` (`WebSite` → site name in Google, and
 * `ProfilePage` → `mainEntity` `Person`) so search engines can attach a
 * Knowledge Panel identity (name, role, canonical profile links) to the
 * site. `address` intentionally stops at city/state/country — never a
 * street address.
 */
export function PersonJsonLd({
  profile,
  certifications = [],
  education = [],
  locale,
}: {
  profile: Profile;
  certifications?: Certification[];
  education?: Education[];
  locale: Locale;
}) {
  const hasCredential = certifications.map((certification) => ({
    "@type": "EducationalOccupationalCredential",
    name: certification.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: certification.issuer },
    ...(certification.credentialUrl ? { url: certification.credentialUrl } : {}),
  }));

  // Derived from `education[0]` (the primary/most recent entry) so this
  // always mirrors the content source instead of drifting from it.
  const alumniOf = education[0]
    ? { "@type": "EducationalOrganization", name: education[0].institution }
    : undefined;

  const websiteId = `${SITE_URL}/#website`;
  const personId = `${SITE_URL}/#person`;
  const pageUrl = absoluteUrl(localizedPath(locale));
  const inLanguage = languageTag(locale);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: "Bruno Cordeiro",
        inLanguage,
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        inLanguage,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Bruno Cordeiro da Silva",
        jobTitle: profile.role,
        email: `mailto:${profile.email}`,
        url: SITE_URL,
        sameAs: [profile.github, profile.linkedin, "https://www.scrum.org/user/1506558"],
        address: {
          "@type": "PostalAddress",
          ...parseAddress(profile.location),
        },
        ...(alumniOf ? { alumniOf } : {}),
        ...(hasCredential.length > 0 ? { hasCredential } : {}),
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

Em `src/app/[locale]/layout.tsx`:

1. Na função `generateMetadata`, trocar
   `const description = \`${profile.role} · ${profile.location} · ${profile.subheadline}\`;`por`const description = profile.metaDescription;`
2. No JSX, trocar
   `<PersonJsonLd profile={profile} certifications={certifications} education={education} />`
   por
   `<PersonJsonLd profile={profile} certifications={certifications} education={education} locale={locale} />`

   (`locale` aqui já está estreitado para `Locale` pelo guard `hasLocale` acima; se o TypeScript reclamar do tipo `string`, use a variável após o guard — o `notFound()` garante o narrowing.)

- [ ] **Step 4: Rodar e ver passar + typecheck**

Run: `pnpm test -- src/components/seo/person-json-ld.test.tsx && pnpm typecheck`
Expected: PASS (3 testes) e typecheck limpo (o typecheck pega qualquer uso restante do componente sem `locale`).

- [ ] **Step 5: Commit**

```bash
git status --short
git add src/components/seo/person-json-ld.tsx src/components/seo/person-json-ld.test.tsx "src/app/[locale]/layout.tsx"
git commit -m "feat(seo): use meta description and expand json-ld graph"
```

---

### Task 4: `sitemap.lastModified` estável (derivado de `asOfYm`)

**Files:**

- Modify: `src/app/sitemap.ts`
- Test (create): `src/app/sitemap.test.ts`

**Interfaces:**

- Consumes: `getContent(defaultLocale).profile.asOfYm` (formato `YYYY-MM`, já validado por Zod); `defaultLocale` de `@/lib/site`.
- Produces: entradas do sitemap com `lastModified: "YYYY-MM-01"` (string).

- [ ] **Step 1: Escrever os testes que falham**

Criar `src/app/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { getContent } from "@/content";

describe("sitemap", () => {
  it("usa lastModified estável derivado de asOfYm", () => {
    const expected = `${getContent("pt").profile.asOfYm}-01`;
    for (const entry of sitemap()) expect(entry.lastModified).toBe(expected);
  });
  it("cobre home e link-charts nos dois locales com alternates pt", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://brunocordeiro.dev/pt");
    expect(urls).toContain("https://brunocordeiro.dev/pt/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/en");
    expect(urls).toContain("https://brunocordeiro.dev/en/link-charts");
    const home = entries.find((e) => e.url === "https://brunocordeiro.dev/pt");
    expect(home?.alternates?.languages).toHaveProperty("pt");
    expect(home?.alternates?.languages).toHaveProperty("pt-BR");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test -- src/app/sitemap.test.ts`
Expected: FAIL — `lastModified` é um `Date` (de `new Date()`), não a string `"2026-08-01"`.

- [ ] **Step 3: Implementar**

Substituir o conteúdo de `src/app/sitemap.ts` por:

```ts
import type { MetadataRoute } from "next";
import { getContent, locales } from "@/content";
import { absoluteUrl, defaultLocale, languageAlternates, localizedPath } from "@/lib/site";

const ROUTES = ["", "/link-charts"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Estável entre builds: acompanha o ritual mensal de atualização do
  // conteúdo (asOfYm) em vez de mudar a cada deploy.
  const lastModified = `${getContent(defaultLocale).profile.asOfYm}-01`;
  return locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(localizedPath(locale, route)),
      lastModified,
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm test -- src/app/sitemap.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git status --short
git add src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "fix(seo): stabilize sitemap lastmodified"
```

---

### Task 5: OG image rica (card com cargo, stack, domínio e localização)

**Files:**

- Create: `src/assets/fonts/GeistMono-Bold.ttf` (cópia de `node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.ttf`)
- Modify: `src/assets/fonts/NOTICE.md`
- Modify: `src/app/[locale]/opengraph-image.tsx`

**Interfaces:**

- Consumes: `profile.stackHighlights` e `profile.role` (Task 1); fontes Geist já vendoradas.
- Produces: rota `/{locale}/opengraph-image/card` (o `id` de `generateImageMetadata` entra na URL — o Next atualiza `og:image` sozinho); `alt` localizado.

Sem teste unitário: renderização satori/edge não roda em jsdom — a verificação é visual + build (passos 3–4), conforme o spec.

- [ ] **Step 1: Vendorar a fonte mono e atualizar o NOTICE**

```bash
cp node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.ttf src/assets/fonts/GeistMono-Bold.ttf
```

Em `src/assets/fonts/NOTICE.md`, trocar a frase inicial:

```markdown
`Geist-Bold.ttf`, `Geist-Regular.ttf` and `GeistMono-Bold.ttf` in this
directory are part of the Geist font family created by Vercel
(https://github.com/vercel/geist-font).
```

(o restante do arquivo fica igual.)

- [ ] **Step 2: Reescrever `src/app/[locale]/opengraph-image.tsx`**

Conteúdo completo do arquivo:

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent, type Locale } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// `generateImageMetadata` recebe params síncronos (Next 16) — usado aqui
// para localizar o alt da imagem por locale.
export function generateImageMetadata({ params }: { params: { locale: Locale } }) {
  const { profile } = getContent(params.locale);
  return [{ id: "card", alt: `${profile.name} — ${profile.role}`, size, contentType }];
}

// Vendored from the `geist` package (SIL Open Font License) so satori can
// read raw font bytes — `next/font` isn't usable inside `ImageResponse`.
const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { profile } = getContent(locale);

  const [geistBold, geistRegular, geistMonoBold] = await Promise.all([
    readFile(join(FONTS_DIR, "Geist-Bold.ttf")),
    readFile(join(FONTS_DIR, "Geist-Regular.ttf")),
    readFile(join(FONTS_DIR, "GeistMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 88px",
        backgroundColor: "#09090b",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", width: 72, height: 8, backgroundColor: "#3fdd78" }} />
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            fontFamily: "Geist",
            color: "#fafafa",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 40,
            fontFamily: "Geist",
            color: "#a1a1aa",
          }}
        >
          {profile.role}
        </div>
        <div style={{ display: "flex", marginTop: 44, gap: 14 }}>
          {profile.stackHighlights.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid #27272a",
                color: "#d4d4d8",
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "GeistMono",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            fontFamily: "GeistMono",
            color: "#3fdd78",
          }}
        >
          brunocordeiro.dev
        </div>
        <div style={{ display: "flex", fontSize: 28, fontFamily: "Geist", color: "#71717a" }}>
          {profile.location}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "GeistMono", data: geistMonoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
```

- [ ] **Step 3: Verificar visualmente nos dois locales**

```bash
pnpm dev &  # ou use o dev server já rodando, se houver
sleep 8
# a URL real da imagem sai do HTML (o id "card" e o hash entram na URL):
curl -s http://localhost:3000/pt | grep -o 'property="og:image" content="[^"]*"'
# baixar usando o path retornado acima (ajuste se o hash diferir):
curl -s -o /tmp/og-pt.png "http://localhost:3000/pt/opengraph-image/card"
curl -s -o /tmp/og-en.png "http://localhost:3000/en/opengraph-image/card"
ls -la /tmp/og-pt.png /tmp/og-en.png  # ambos PNG, < 600KB
```

Abrir/inspecionar as duas imagens (agente: use a ferramenta Read no PNG). Conferir: nome, cargo por locale, 5 chips legíveis sem overflow, domínio em verde mono, localização à direita, nada cortado.

Expected: card 1200×630 com todos os elementos; alt localizado visível no HTML (`og:image:alt`).

- [ ] **Step 4: Typecheck + suite**

Run: `pnpm typecheck && pnpm test`
Expected: limpos (nenhum teste cobre a imagem, mas o typecheck valida `generateImageMetadata`/props).

- [ ] **Step 5: Commit**

```bash
git status --short
git add src/assets/fonts/GeistMono-Bold.ttf src/assets/fonts/NOTICE.md "src/app/[locale]/opengraph-image.tsx"
git commit -m "feat(og): redesign social card with role, stack and domain"
```

---

### Task 6: `apple-icon.tsx` + `manifest.ts`

**Files:**

- Create: `src/app/apple-icon.tsx`
- Create: `src/app/manifest.ts`

**Interfaces:**

- Consumes: `GeistMono-Bold.ttf` vendorada (Task 5).
- Produces: rotas `/apple-icon` (PNG 180×180) e `/manifest.webmanifest`, linkadas automaticamente no `<head>` de todas as páginas pelo Next.

Sem teste unitário (mesma razão da Task 5 para o ícone; o manifest é literal estático) — verificação por curl/visual no Step 3.

- [ ] **Step 1: Criar `src/app/apple-icon.tsx`**

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Full-bleed (sem cantos arredondados nem transparência): o iOS aplica a
// própria máscara; cantos transparentes virariam quadrados pretos.
export default async function AppleIcon() {
  const geistMonoBold = await readFile(join(process.cwd(), "src/assets/fonts/GeistMono-Bold.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        color: "#3fdd78",
        fontSize: 96,
        fontWeight: 700,
        fontFamily: "GeistMono",
      }}
    >
      b.
    </div>,
    {
      ...size,
      fonts: [{ name: "GeistMono", data: geistMonoBold, weight: 700, style: "normal" }],
    },
  );
}
```

- [ ] **Step 2: Criar `src/app/manifest.ts`**

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bruno Cordeiro — Desenvolvedor Full-Stack Sênior",
    short_name: "Bruno Cordeiro",
    start_url: "/pt",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
```

- [ ] **Step 3: Verificar rotas e links no head**

```bash
curl -s -o /tmp/apple-icon.png -w "%{http_code} %{content_type}\n" http://localhost:3000/apple-icon
curl -s http://localhost:3000/manifest.webmanifest
curl -s http://localhost:3000/pt | grep -oE '<link rel="(apple-touch-icon|manifest)"[^>]*>'
```

Expected: `200 image/png`; JSON do manifest com os 2 ícones; os dois `<link>` presentes no head. Inspecionar `/tmp/apple-icon.png` (agente: Read) — "b." verde centrado em fundo escuro, sem cortes.

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: limpos.

- [ ] **Step 5: Commit**

```bash
git status --short
git add src/app/apple-icon.tsx src/app/manifest.ts
git commit -m "feat(seo): add apple icon and web manifest"
```

---

### Task 7: Verificação de ponta a ponta (sem commit, salvo correções)

**Files:** nenhum novo — só validação.

- [ ] **Step 1: Suite completa + build de produção**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: tudo verde; build lista as rotas `/{locale}/opengraph-image/card`(ou equivalente com id), `/apple-icon`, `/manifest.webmanifest`, `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 2: Inspeção do head renderizado (produção local)**

```bash
pnpm start &  # servidor de produção na 3000 (pare o dev antes)
sleep 5
for path in pt en; do
  echo "===== /$path ====="
  curl -s "http://localhost:3000/$path" | tr '>' '>\n' | grep -iE 'og:|twitter:|hreflang|canonical|apple-touch-icon|manifest|application/ld\+json' | head -30
done
```

Expected por locale: `og:image` apontando para a URL nova com `/card`; `og:image:alt` = "Bruno Cordeiro — {cargo do locale}"; `meta description` = novo `metaDescription`; `hreflang` com `pt`, `pt-BR`, `en`, `x-default`; links de `apple-touch-icon` e `manifest`; JSON-LD presente.

- [ ] **Step 3: Sitemap e robots**

```bash
curl -s http://localhost:3000/sitemap.xml | head -30
curl -s http://localhost:3000/robots.txt
```

Expected: `<lastmod>2026-08-01` (ou o `asOfYm` corrente) e `xhtml:link` com `hreflang="pt"`; robots inalterado.

- [ ] **Step 4: E2E de regressão**

Run: `pnpm e2e`
Expected: specs `home`, `case-study`, `a11y` passam (nada de layout visível mudou; se falhar por dependência de rede/GitHub API, investigar antes de concluir).

- [ ] **Step 5: Relatório final**

Sem commit. Reportar ao usuário: o que mudou, screenshots das OG images pt/en, e o checklist pós-deploy do spec (LinkedIn Post Inspector, metatags.io, WhatsApp, Google Rich Results Test).

---

## Self-review do plano (executado na escrita)

- **Cobertura do spec:** OG rica → Task 5; copy → Tasks 1+3; JSON-LD → Task 3; apple-icon → Task 6; hreflang `pt` → Task 2; sitemap → Task 4; manifest → Task 6; verificação → Task 7; itens "fora de escopo" do spec não têm tasks (correto).
- **Placeholders:** nenhum TBD/TODO; todo step de código traz o código completo.
- **Consistência de tipos:** `languageTag` definido na Task 2 e consumido na Task 3; `metaDescription`/`stackHighlights` definidos na Task 1 e consumidos nas Tasks 3/5; `PersonJsonLd` ganha `locale: Locale` na Task 3 e o call-site é atualizado na mesma task.
