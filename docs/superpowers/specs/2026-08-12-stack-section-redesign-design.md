# Redesign da seção Stack — simplificação visual e de categorias

**Data:** 2026-08-12
**Status:** aprovado

## Problema

A seção `#stack` da home tem cinco problemas apontados em revisão visual:

1. **Sem título** — `page.tsx` renderiza a `SkillMatrix` direto, sem o `<h2>`
   mono-eyebrow que Trajetória, Certificações, IA em números e Projetos têm.
2. **Verde inconsistente** — duas fontes de verde sem critério visível:
   o dot de `evidence: "production"` e nomes com `highlight: true`.
3. **Origem ausente** — as tags de empresa só aparecem quando
   `evidence !== "production"`, então boa parte das skills não diz onde foi
   usada; em outras a empresa aparece repetida dentro do texto de prova.
4. **Conteúdo duplicado entre tabs** — TypeScript em "Linguagens" e
   "Frontend", PHP em "Linguagens" e "Backend", ORMs em "Arquitetura" e
   "Backend", segurança espalhada em três lugares.
5. **Badges pouco explicativos** — os textos "em produção" / "profissional"
   não comunicam nada para quem lê.

## Decisões (aprovadas pelo usuário)

- Fundir as 9 categorias em **5 tabs**.
- Remover os badges de evidência ("em produção", "profissional", dot
  colorido). No lugar, **toda** skill mostra onde foi usada, vindo das `tags`.
- Remover o destaque verde dos nomes — tipografia uniforme.
- Limpar menções redundantes de empresa dos textos de prova (a tag passa a
  dizer isso).

## Novas categorias

| id (enum)  | Título PT          | Título EN         | Recebe                                                                                                                                                         |
| ---------- | ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend` | Frontend           | Frontend          | Frontend atual + HTML·CSS + Modos de renderização                                                                                                              |
| `backend`  | Backend & Dados    | Backend & Data    | Backend + Bancos de dados + restante de Arquitetura & Padrões (camadas, REST+OpenAPI, ORMs, caching, fundamentos, segurança, microsserviços, autenticação/SSO) |
| `devops`   | DevOps & Infra     | DevOps & Infra    | CI/CD & Servidor + Bash                                                                                                                                        |
| `quality`  | Qualidade & Testes | Quality & Testing | igual ao atual                                                                                                                                                 |
| `ai`       | IA & Metodologias  | AI & Methods      | Engenharia com IA + Ferramentas & Metodologias                                                                                                                 |

Os ids `languages`, `architecture`, `databases` e `tools` saem do enum
`skillCategoryIdSchema`.

## Fusões de skills (dedupe, 86 → 77)

1. **TypeScript + JavaScript + "TypeScript estrito"** → uma entrada
   "TypeScript · JavaScript" no Frontend (prova combina strict mode +
   ES6+ desde 2016).
2. **PHP 5.6→8.2 (production) + PHP 5.6–8.1 (professional)** → um "PHP"
   no Backend & Dados, prova combinada, tags `Link Charts · Basis ·
Ordem Social · Plug Digital`.
3. **TanStack Query v5 + "React Query e SWR"** → uma entrada no Frontend,
   tags `Link Charts · G4F`.
4. **Autenticação multi-mecanismo + Auth0 full-stack + SSO/OIDC** →
   "Autenticação & SSO" no Backend & Dados (JWT httpOnly, Sanctum, Auth0,
   Login Único gov.br/OIDC), tags `Link Charts · G4F`.
5. **OWASP Top 10 + "Segurança web aplicada"** → "Segurança aplicada
   (OWASP)" no Backend & Dados, tags `Link Charts · G4F`.
6. **"ORMs — 6 em 3 runtimes" + Eloquent + Prisma ORM** → uma entrada
   "ORMs" no Backend & Dados; a prova cita Eloquent
   (observers/factories/seeders) e Prisma entre os 6.

Nenhuma skill é removida de conteúdo — apenas fundida ou movida.

## Visual de cada item

- Linha do nome: nome à esquerda (cor uniforme, `font-mono text-sm`),
  origem à direita em `font-mono text-[11px] text-muted` — ex.:
  `Link Charts`, `G4F · Basis`, `projetos pessoais`. As tags continuam
  localizadas no conteúdo, como hoje (PT "projetos pessoais"/"este site",
  EN "side projects"/"this site").
- Prova abaixo, como hoje (`text-sm text-muted`), sem repetir a empresa
  quando a tag já a nomeia; menções tipo "(G4F)" ou "no Link Charts"
  saem do texto.
- Grid de duas colunas e tabs mantidos; com 5 tabs a lista cabe em uma
  linha no desktop, o scroll horizontal com fade continua no mobile.

## Título da seção

`page.tsx` passa a renderizar, dentro de `<section id="stack">`, um `<h2>`
com a receita mono-eyebrow (`font-mono text-xs tracking-[0.2em] text-muted
uppercase`) reusando `nav.stack` ("Stack"), como a Timeline faz com
`nav.trajectory`. Container `flex flex-col gap-8` para o mesmo ritmo das
outras seções.

## Mudanças de código

- `src/domain/skill.ts`: remove `evidenceLevelSchema`, `EvidenceLevel` e os
  campos `evidence`/`highlight` de `skillSchema`; `tags` vira obrigatório
  (`min(1)`, sem `.optional()`); `skillCategoryIdSchema` vai a 5 ids.
- `src/components/sections/evidence-badge.tsx`: deletado.
- `src/components/sections/skill-matrix.tsx`: perde a prop `labels`, mostra
  as tags em toda skill (sem condicional de evidence).
- `src/app/[locale]/page.tsx`: remove `evidenceLabels` e o namespace
  `evidence`; adiciona o `<h2>` da seção.
- `messages/pt.json` / `messages/en.json`: remove o bloco `evidence`.
- `src/content/pt/skills.ts` / `src/content/en/skills.ts`: reorganização
  completa (5 categorias, fusões, provas limpas, tags em tudo) — as duas
  locales mudam juntas, espelhadas.

## Testes

- `src/domain/domain.test.ts`: atualiza os casos que usam `evidence`.
- `src/components/sections/skill-matrix.test.tsx`: atualiza para o novo
  markup (sem badge, tags sempre visíveis).
- `src/content/content.test.ts`: paridade PT/EN de ids e contagem de skills
  continua valendo sem alteração de lógica.
- E2E/axe existentes continuam cobrindo a seção (ids `skill-tab-*` /
  `skill-panel-*` são mantidos).

## Fora de escopo

- Cortar skills do conteúdo (nada é apagado, só fundido/movido).
- Mudar outras seções da home ou o design system (tabs, tokens, cores).
