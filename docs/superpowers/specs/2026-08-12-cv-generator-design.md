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

| Seção             | Liga/desliga seção | Itens individuais                    |
| ----------------- | ------------------ | ------------------------------------ |
| Perfil resumido   | sim                | —                                    |
| Métricas          | sim                | —                                    |
| Experiências      | sim                | por experiência (company)            |
| Skills            | sim                | por categoria (acordeão) e por skill |
| Certificações     | sim                | por certificação                     |
| Educação          | sim                | por item                             |
| Case study (link) | sim                | —                                    |

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

Ver "Iteração — UX para recrutador" no fim deste documento: o layout de duas colunas foi substituído por barra de ações + modal.

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

## Iteração — UX para recrutador (2026-08-12)

Motivação: com ~90 skills numa lista plana, o painel lateral empurrava o botão "Baixar PDF" muito abaixo da dobra — na prática ele sumia. A tela precisa ser óbvia para um recrutador que chega sem contexto.

- **Barra de ações no topo da página**, sticky logo abaixo do header do site (53px): "Personalizar" (abre a modal) e "Baixar PDF" lado a lado, sempre visíveis. O preview passa a ocupar a página inteira, em `max-w-4xl`.
- **Painel de seleção vai para uma modal** — `<dialog>` nativo, mesmo padrão de `RepoCatalogDialog` (backdrop com blur, fecha por X / ESC / clique fora, corpo com scroll interno). Sem "aplicar/cancelar": cada clique reflete no preview imediatamente.
- **Skills em acordeão por categoria** — usa as 5 categorias que o conteúdo já define (Frontend, Backend & Dados, DevOps & Infra, Qualidade & Testes, IA & Metodologias), sem taxonomia nova. Cada grupo tem checkbox tri-state (marcado / indeterminado / vazio) que alterna a categoria inteira, título, contador `n/m` e chevron; colapsado por padrão. O "marcar/desmarcar todas" da seção Skills continua como atalho global. Experiências, certificações e educação seguem como listas simples — são curtas.
- **Entrada em destaque no hero** — botão sólido "Baixar CV" (`common.downloadCv`) ao lado de GitHub · LinkedIn · Copiar e-mail, apontando para `/cv`. O link do footer permanece.
- **Sem mudança de dados** — `CvSelection`, `buildCvData`, `CvPreview` e `CvDocument` ficam intactos; o estado de expansão do acordeão é UI local, fora da seleção.
- **Rótulos novos** — `cv.customize`, `common.downloadCv`; reaproveita `common.close` para o botão de fechar da modal.

### Densidade do CV: só nomes

No **PDF**, skills e projetos entram **apenas pelo nome**: a prova de cada skill e a descrição de cada sistema custavam páginas de texto que ninguém lê num documento. As stacks de cada experiência continuam completas (valem para busca por palavra-chave em ATS).

O **preview** mantém a descrição de cada sistema — é a única divergência deliberada entre os dois renderizadores: a tela tem espaço de sobra e a descrição ajuda quem está montando o CV a decidir o que incluir; o documento precisa caber em duas páginas. Fora isso o preview continua espelhando o PDF (skills só por nome, chips, mesma hierarquia de negritos).

### Correções do template do PDF

- `lineHeight` nunca na `Page`: herdada, o react-pdf a resolve como valor absoluto a partir do `fontSize` da página, esmagando o nome de 19pt contra a linha do cargo. Cada estilo declara a sua.
- Sem `wrap={false}` em blocos altos — era o que empurrava uma categoria inteira para a página seguinte e deixava meia página vazia. `minPresenceAhead` nas seções evita título órfão no pé da página.
- `src/lib/cv/pdf-text.ts` troca caracteres fora do WinAnsi (`→`, `≠`, `▸`…) por equivalentes ASCII: as fontes padrão do PDF não os têm e "PHP 5.6 → 8.2" saía como "PHP 5.6 ' 8.2". Hifenização desligada (quebrava URLs de credencial no meio).
- Negrito onde cria hierarquia: cargo/empresa, nomes de projeto, título da categoria de skills, valores das métricas, nome da certificação, curso e título do case study.
- Stacks e skills saem como **chips** (caixa arredondada, fundo `#f4f4f5`), ecoando os badges do site — a linha corrida de nomes separados por `·` ficava pobre e ilegível. O container precisa de `width: "100%"`: sem largura definida o yoga mede a linha como se nunca quebrasse.
- `minPresenceAhead` numa `View` de seção mais alta que a página empurra a seção inteira para a folha seguinte (meia página em branco) e, num `Text` isolado, não tem efeito. Para o título não encalhar sozinho no pé da página, ele e o primeiro item da seção vão dentro de uma `View wrap={false}`.
