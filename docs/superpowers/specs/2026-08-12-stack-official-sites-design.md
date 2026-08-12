# Links para sites oficiais na seção Stack

**Data:** 2026-08-12
**Status:** aprovado

## Problema

As skills da seção `#stack` citam tecnologias (Next.js, Laravel, PostgreSQL,
Kubernetes…) mas não levam a lugar nenhum: devs, recrutadores e interessados
não têm como acessar o site oficial de cada stack a partir do módulo.

## Decisões (aprovadas pelo usuário)

- **O título da skill é o link** para o site oficial, em nova aba, com
  underline pontilhado discreto (revisão do usuário sobre a 1ª versão,
  que usava ícones ↗ ao lado do nome e "não ficou legal").
- Entradas compostas ("TypeScript · JavaScript", "react-hook-form + Zod")
  ganham **um link por tecnologia**: cada segmento do título vira sua
  própria âncora; a ordem de `links` no conteúdo segue a ordem dos
  segmentos. Títulos não segmentáveis com vários links ("Data viz")
  apontam inteiros para o primeiro site.
- Escopo restrito à feature: sem redesign visual do módulo.
- Pesquisa das URLs organizada por tab (uma frente de pesquisa por
  categoria: Frontend, Backend & Dados, DevOps & Infra, Qualidade & Testes,
  IA & Metodologias), com verificação de que cada URL responde e é o
  domínio oficial do projeto.

## Critério de curadoria

1. Recebem link as tecnologias concretas nomeadas no `name` da skill
   (ex.: "MUI 6 + Emotion" → mui.com + emotion.sh).
2. Entradas conceituais cujo texto de prova nomeia a lib central da
   experiência podem linkar essa lib (ex.: "i18n" → i18next,
   "Data viz" → ApexCharts/Leaflet/material-react-table).
3. Entradas puramente conceituais (ex.: "Feature-based architecture",
   "Postmortems", "Microservices") não ganham link.
4. Máximo de **3 links por skill** para não poluir a linha.
5. URLs idênticas nos dois locales; sempre `https`, sem tracking params.
6. Preferir o domínio canônico atual (ex.: `motion.dev`, `deno.com`,
   `react.dev`) — não domínios legados que redirecionam.

## Mudanças de código

- `src/domain/skill.ts`: novo `skillLinkSchema` (`{ label, url }`, url
  validada como URL https) e campo opcional `links` em `skillSchema`.
- `src/components/sections/skill-matrix.tsx`: o título (ou cada segmento
  dele) vira `<a target="_blank" rel="noopener noreferrer">` com underline
  pontilhado, hover para accent, `title` e `aria-label` no formato
  `"{label} — {site oficial}"`. O rótulo localizado chega por prop
  `officialSiteLabel` (o componente é client e recebe strings do server,
  como o restante da página).
- `src/app/[locale]/page.tsx`: passa `officialSiteLabel` vindo de
  `common.officialSite`.
- `messages/pt.json` / `messages/en.json`: nova chave `common.officialSite`
  ("site oficial" / "official website").
- `src/content/pt/skills.ts` / `src/content/en/skills.ts`: campo `links`
  nas skills contempladas, espelhado entre locales.

## Testes

- `skill-matrix.test.tsx`: renderiza âncora com `href`, `target="_blank"`,
  `rel` e `aria-label` corretos; skill sem `links` não renderiza âncora.
- `content.test.ts`: paridade PT/EN passa a comparar também os `links`
  (label + url) por categoria/índice — evita drift entre locales.
- Validação de URL https fica no schema Zod (roda no teste de conteúdo
  existente "valida contra o domínio em todos os locales").

## Fora de escopo

- Redesign visual do módulo (feito na spec `2026-08-12-stack-section-redesign`).
- Links para docs internas/deep links de features (só o site oficial).
- Ícones/logos por tecnologia (só o ↗ genérico).
