# SEO e previews de compartilhamento — WhatsApp, LinkedIn, Threads e X

**Data:** 2026-08-12
**Status:** aprovado

## Problema

Auditoria do site em produção (2026-08-12) mostrou base sólida — title/
description por locale, canonical, hreflang (`pt-BR`/`en`/`x-default`),
`og:*` completo com imagem dinâmica 1200×630 por locale, `twitter:card
summary_large_image`, JSON-LD `Person`, sitemap com alternates, robots ok —
mas com lacunas que enfraquecem o preview social e o SEO:

1. **OG image visualmente fraca** — só fundo escuro + barra verde + nome +
   headline. É o elemento dominante do preview nas quatro plataformas e não
   comunica cargo, stack, domínio nem localização.
2. **Favicon só SVG** — sem `apple-icon` PNG (iOS/share sheets); o favicon
   exibido pelo Google na SERP é mais confiável com PNG ≥ 48px.
3. **JSON-LD incompleto** — falta `WebSite` (site name na SERP do Google) e
   `ProfilePage` envolvendo o `Person`.
4. **hreflang só `pt-BR`** — sem o `pt` genérico (cobre pt-PT etc.).
5. **`sitemap.lastModified = new Date()`** — muda a cada build; ruído para
   o crawler.
6. **`og:image:alt` genérico** ("Bruno Cordeiro") e não localizado.
7. **Sem web manifest.**

Não-problemas verificados: raiz `/` responde 307 → `/pt` e os crawlers de
WhatsApp, LinkedIn, Threads e X seguem redirect; o `og:image` já sai com
hash de conteúdo na query string (cache-busting automático — relevante para
o cache de ~7 dias do WhatsApp); Next já deriva `twitter:image` da OG image.

## Decisões (aprovadas pelo usuário)

- **OG image "card rico"**: nome + cargo + chips de stack + domínio +
  localização (opção escolhida entre card rico / card com foto /
  minimalista).
- **Sem `twitter:site`/`twitter:creator`** — usuário não usa handle no X.
- **Copy SEO otimizada** com keywords da stack, por locale.
- **Abordagem A (pacote completo)**: previews + higiene técnica na mesma
  rodada.

## Design

### 1. OG image rica — `src/app/[locale]/opengraph-image.tsx`

Reescrever o layout mantendo `ImageResponse` + fontes Geist vendoradas:

- Barra accent verde (`#3fdd78`) no topo do bloco, como hoje.
- Nome em 72px bold (`profile.name`).
- Cargo em ~40px (`profile.role`) — substitui a headline genérica.
- Linha de chips da stack: novo campo `stackHighlights: string[]` no tipo
  `Profile` (mesmos valores em pt/en — nomes de tecnologia são neutros):
  `["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"]`.
  Chips com borda sutil (`#27272a`) e texto `#a1a1aa`, cantos arredondados.
- Rodapé: `brunocordeiro.dev` (accent, mono) à esquerda e
  `profile.location` à direita, em ~28px.
- Paleta idêntica ao site: fundo `#09090b`, texto `#fafafa`/`#a1a1aa`.
- `alt` localizado via `generateImageMetadata({ params })` (Next 16:
  `params` síncrono aí; o default export recebe `id` como Promise) —
  formato `"Bruno Cordeiro — {role}"` por locale.
- A imagem continua por locale e cascateia para `/link-charts` (sem
  variante própria nesta rodada — YAGNI).
- Orçamento: PNG < 600KB (limite prático do WhatsApp; hoje são 33KB).

### 2. Copy SEO — `Profile` + `[locale]/layout.tsx`

- Novo campo `metaDescription: string` no tipo `Profile` e nos dois
  `profile.ts`, ~150 chars, com keywords pesquisáveis:
  - **pt:** "Desenvolvedor full-stack sênior em Brasília — há 10+ anos do
    primeiro commit ao deploy sem downtime, com TypeScript, Node.js,
    React, CI/CD e Kubernetes."
  - **en:** "Senior full-stack developer in Brasília, Brazil with 10+
    years across TypeScript, Node.js, React, CI/CD and Kubernetes — from
    first commit to zero-downtime deploys."
- `generateMetadata` do layout usa `profile.metaDescription` no lugar da
  concatenação `role · location · subheadline`.
- Title mantém `"{name} — {role}"` (~48 chars, dentro do limite de ~60).
- `/link-charts` continua com `caseStudy.title` + `tagline`.

### 3. JSON-LD — `src/components/seo/person-json-ld.tsx`

Emitir um único `@graph` com três nós interligados por `@id`:

- `WebSite` — `name: "Bruno Cordeiro"`, `url`, `inLanguage` do locale.
- `ProfilePage` — `mainEntity` apontando para o `Person`; `url` da página
  no locale corrente.
- `Person` — nó atual intacto (name, jobTitle, sameAs, address,
  alumniOf, hasCredential).

O componente passa a receber o `locale` para `inLanguage`/`url`.

### 4. Higiene técnica

- **`src/app/apple-icon.tsx`** — PNG 180×180 gerado por `ImageResponse`,
  monograma "BC" com a mesma identidade do `icon.svg` (fundo `#09090b`,
  cantos arredondados, borda `#27272a`). Também serve de favicon PNG para
  a SERP do Google.
- **hreflang `pt`** — `languageAlternates` em `src/lib/site.ts` passa a
  emitir `pt` e `pt-BR` apontando para a mesma URL (+ `en`, `x-default`).
- **`sitemap.lastModified`** — derivado de `profile.asOfYm` (ex.:
  `2026-08` → `2026-08-01`), estável entre builds; atualiza junto com o
  ritual mensal de conteúdo que já existe.
- **`src/app/manifest.ts`** — mínimo: `name`, `short_name`, `start_url:
  "/pt"`, `display: "standalone"`, `background_color`/`theme_color:
  "#09090b"`, ícones (SVG + apple-icon).

### 5. Fora de escopo (decisões registradas)

- Raiz `/` continua 307 → `/pt` (comportamento padrão do next-intl;
  crawlers alvo seguem redirect).
- `og:type` continua `"website"` (mais previsível no LinkedIn que
  `"profile"`).
- Sem `twitter:site`/`creator`; sem meta `keywords` (Google ignora).
- Sem llms.txt/AEO, sem variante de OG para `/link-charts`, sem foto no
  card (decisão do usuário).

### 6. Testes (TDD nos utilitários)

- `site.ts`: `languageAlternates` inclui `pt`, `pt-BR`, `en`, `x-default`;
  `buildPageMetadata` mantém canonical/OG/twitter coerentes.
- JSON-LD: componente emite `@graph` com os três `@type` e `mainEntity`
  ligando `ProfilePage` → `Person`; JSON válido.
- Sitemap: `lastModified` derivado de `asOfYm` (estável), URLs e
  alternates por locale.
- Smoke manual: build local + inspeção do `<head>` de `/pt` e `/en` e da
  rota `opengraph-image` renderizada.

### 7. Verificação pós-deploy (checklist para o usuário)

1. LinkedIn Post Inspector (`linkedin.com/post-inspector`) — força
   re-scrape do cache.
2. metatags.io ou opengraph.xyz — conferência visual multi-plataforma.
3. WhatsApp: compartilhar consigo mesmo; se vier preview velho, o hash
   novo do `og:image` resolve na primeira raspagem pós-deploy.
4. Google Rich Results Test — validar `ProfilePage`/`Person`.

## Arquivos afetados

| Arquivo | Mudança |
| --- | --- |
| `src/app/[locale]/opengraph-image.tsx` | reescrita do card + `generateImageMetadata` |
| `src/domain/*` (tipo `Profile`) | + `stackHighlights`, `metaDescription` |
| `src/content/pt/profile.ts`, `src/content/en/profile.ts` | novos campos |
| `src/app/[locale]/layout.tsx` | description explícita |
| `src/components/seo/person-json-ld.tsx` | `@graph` WebSite/ProfilePage/Person |
| `src/lib/site.ts` | hreflang `pt` |
| `src/app/sitemap.ts` | `lastModified` estável |
| `src/app/apple-icon.tsx` | novo |
| `src/app/manifest.ts` | novo |
| testes correspondentes | novos/ajustados |

Fora do repositório (já executado em 2026-08-12): descrição, homepage e
topics do repo GitHub `bcordeirodev/brunocordeiro.dev` atualizados.
