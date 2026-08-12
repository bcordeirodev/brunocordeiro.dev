# Gerador de CV em PDF — Design

**Data:** 2026-08-12
**Status:** aprovado em conversa; aguardando revisão do spec

## Objetivo

Página pública onde visitantes (recrutadores) montam e baixam um CV em PDF do Bruno a partir dos dados já existentes no site, marcando/desmarcando seções e itens individuais. Fonte única de dados: `SiteContent` (`src/content/{en,pt}` validado por `src/domain`), sem duplicação de conteúdo.

## Decisões

- **Lib de PDF:** `@react-pdf/renderer` (MIT, diegomura/react-pdf). Geração 100% client-side no browser do visitante — sem função de servidor, sem custo de compute, download instantâneo.
- **Bundle:** a lib (~400–500 KB gzip) é carregada só na rota do CV via `import()` dinâmico no momento da geração; não afeta o restante do site.
- **Rota:** `/{locale}/cv` (pt e en). O conteúdo do CV segue o locale ativo, como o resto do site. Rótulos de UI e do PDF via `messages/{pt,en}.json` (next-intl).
- **Preview:** HTML estilizado espelhando a estrutura do PDF (não é o PDF real renderizado). Mais leve, responsivo e atualiza a cada clique de checkbox.
- **Alternativas descartadas:** HTML→PDF com Chromium em Vercel Function (peso/custo desnecessários para um CV); pdf-lib/jsPDF (layout manual por coordenadas).

## Escopo da seleção

Granularidade: **seções + itens**.

| Seção             | Liga/desliga seção | Itens individuais                                                             |
| ----------------- | ------------------ | ----------------------------------------------------------------------------- |
| Perfil resumido   | sim                | —                                                                             |
| Métricas          | sim                | —                                                                             |
| Experiências      | sim                | por experiência (company)                                                     |
| Skills            | sim                | por skill (seleção plana; sem toggle por categoria — desvio da implementação) |
| Certificações     | sim                | por certificação                                                              |
| Educação          | sim                | por item                                                                      |
| Case study (link) | sim                | —                                                                             |

Regras:

- Nome, role, contatos (email, GitHub, LinkedIn, localização, idiomas) **sempre presentes** — não desmarcáveis.
- Default: tudo marcado.
- Cada seção com itens tem "marcar/desmarcar todas". Desmarcar a seção oculta a seção inteira independente dos itens.
- Seção marcada com zero itens selecionados não aparece no PDF (equivale a desmarcada).
- Sem persistência de estado (nem URL, nem storage). Recarregou → default. YAGNI; querystring pode vir depois.

## Arquitetura

Um dado, dois renderizadores: a mesma estrutura filtrada alimenta o preview HTML e o documento PDF.

```
SiteContent (content/{locale}, já validado)
        │
        ▼
buildCvData(content, selection)  ← função pura, src/lib/cv/
        │
        ├──► CvPreview (HTML, client component)
        └──► CvDocument (react-pdf) ──► pdf().toBlob() ──► download
```

### Módulos

- `src/lib/cv/selection.ts` — tipo `CvSelection` (flags de seção + records de itens por chave composta estável, blindada contra homônimos: `company:start` p/ experiência, `categoryId:skillName` p/ skill, `name:issued` p/ certificação, `degree:institution` p/ educação) e `defaultSelection(content)`.
- `src/lib/cv/build-cv-data.ts` — `buildCvData(content, selection): CvData`. Filtra e devolve estrutura pronta para render (seções vazias já removidas). Sem dependência de React.
- `src/components/cv/cv-builder.tsx` — client component raiz: estado da seleção, painel + preview + botão de download.
- `src/components/cv/selection-panel.tsx` — checkboxes por seção/item, "marcar/desmarcar todas".
- `src/components/cv/cv-preview.tsx` — render HTML de `CvData`.
- `src/components/cv/cv-document.tsx` — componentes `@react-pdf/renderer` (`Document/Page/View/Text/Link`) que recebem `CvData`. Importado dinamicamente junto com a lib no clique de "Baixar PDF", com estado de loading no botão; após o primeiro clique o módulo fica em cache e os seguintes são instantâneos.
- `src/app/[locale]/cv/page.tsx` — server component: carrega o content do locale, metadata da página, renderiza `CvBuilder`.

### Layout da página

Desktop: duas colunas — painel de seleção à esquerda, preview à direita, botão "Baixar PDF" fixo/visível. Mobile: painel acima do preview. Entrada discreta no footer do site ("Baixar CV" → `/cv`); a rota entra no sitemap.

## Template do PDF

- A4, fluindo para segunda página quando necessário; tipografia sóbria; texto selecionável (ATS-friendly); links clicáveis (email, GitHub, LinkedIn, credenciais, case study).
- Cabeçalho: nome, role, headline, linha de contatos, localização, idiomas. **Desvio:** `headline` foi omitido do cabeçalho na implementação por ser redundante com `role`.
- Seções na ordem do site: perfil (subheadline), métricas, experiências (role, company, período, stacks, projetos), skills por categoria (nome + proof), certificações (nome, issuer, datas, link), educação, case study (parágrafo curto + link para `/{locale}/link-charts`).
- Datas formatadas no locale ativo (reusar helpers existentes se houver).
- Nome do arquivo: `bruno-cordeiro-cv-{locale}.pdf`.

## Erros

- Falha no `import()` dinâmico ou na geração: mensagem inline traduzida junto ao botão ("não foi possível gerar, tente novamente"), botão volta ao estado normal. Sem retry automático.
- Estado de loading no botão durante geração.

## Testes

- **Unit (vitest):** `buildCvData` — filtragem por seção, por item, seção com zero itens some, campos sempre presentes, default seleciona tudo; `defaultSelection` cobre todo o content (guard contra item novo esquecido).
- **Component:** painel de seleção — toggles de seção/item, "marcar todas", interação com preview.
- **Sem teste do binário PDF** — testamos os dados que entram nele. E2e da página pode vir depois.

## Fora de escopo

- Persistência da seleção (URL/storage), múltiplos templates/temas, reordenação de seções, edição de texto, geração server-side.
