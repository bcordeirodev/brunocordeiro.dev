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

## Iteração — redesign do template (2026-09-18)

Motivação: o PDF era um muro de chips (só a G4F tinha 38, seis linhas), com
projetos reduzidos ao nome, cabeçalho em quatro linhas soltas, métricas em
frase corrida e o case study encalhado no fim da segunda página.

- **Tipografia:** Geist Sans embutida (Regular/Medium/SemiBold/Bold, TTFs do
  pacote `geist` copiados para `public/fonts/cv`, licença OFL ao lado). O
  react-pdf **não substitui** uma fonte já registrada — a primeira de cada
  peso vence —, então `registerCvFonts(base)` roda uma vez; testes e scripts
  chamam-na com o diretório em disco ANTES de importar `cv-document`.
- **Cabeçalho em duas colunas:** nome, cargo e disponibilidade à esquerda;
  e-mail, cidade, GitHub/LinkedIn encurtados (`displayUrl`) e idiomas à
  direita. Régua com um traço curto no verde escuro `#15803d` (o acento do
  site, num tom que imprime).
- **Métricas como quatro blocos** em linha; **case study como callout** logo
  abaixo do resumo (prova antes de inventário, como na home).
- **Experiência:** cargo · empresa à esquerda, período + duração à direita;
  linha com vínculo traduzido (`cv.employmentTypes`) e cidade; projetos como
  bullets **com descrição**; stack numa linha corrida discreta ("Stack: a · b")
  em vez de chips — o preview passou a espelhar isso.
- **Skills** em grade (título da categoria numa coluna fixa, chips ao lado);
  **certificações e educação lado a lado** quando as duas estão marcadas.
- **Rodapé fixo** com a URL da página do CV e `n / total`. Sem `lineHeight`
  no texto do rodapé: num bloco absoluto ancorado no pé da página o react-pdf
  resolve o valor relativo errado e o rodapé some inteiro.
- **Teste de fumaça do binário** (`cv-document.test.tsx`, ambiente node):
  renderiza en e pt com tudo marcado e trava em ≤ 2 páginas e Geist embutida.

## Iteração — CV para uma vaga (2026-09-18)

Motivação: candidatura a uma vaga Laravel + Angular. O CV padrão abria com o
case study e listava as tecnologias na ordem do site; o recrutador não achava
o que procurava sem ler tudo.

- **Bloco "Vaga específica" no painel**, com três ajustes que vivem em
  `CvSelection` e voltam ao padrão ao recarregar: `focus` (texto livre,
  tecnologias separadas por vírgula — `parseFocus`), `summaryOverride` (vazio
  = `profile.pitch`) e `caseStudyPlacement` (`featured` = callout sob o
  resumo; `compact` = uma linha ao fim do documento).
- **Efeito do foco** (PDF e preview): linha "Stack principal" com chips no
  verde sob o resumo; na stack de cada experiência, os itens que batem saem em
  negrito; em cada categoria de skills, os que batem vão para a frente com o
  chip destacado (`sortByFocus` / `matchesFocus`, match por substring sem
  distinguir caixa — "Laravel" pega "Laravel 12" e "Laravel 8.1").
- **Métricas fora do CV**: testes no CI, downtime de deploy e contagem de
  releases são prova de engenharia no hero do site, não destaque de currículo.
  A seção `metrics` e o toggle foram removidos; o resumo já traz os anos.

## Ajuste — sem selo de vínculo, case sempre no fim (2026-09-18)

- O vínculo (freelance / meio período / tempo integral) saiu do PDF, do preview
  e da trajetória do site: o que importa é o que foi feito, não o formato do
  contrato. `employmentType` segue no domínio só para a linha "em paralelo
  com …" da trajetória.
- O case study perdeu o callout e a opção de posição: é sempre uma seção
  simples ("Link Charts — tagline · link") depois de certificações e educação.
  `caseStudyPlacement` foi removido de `CvSelection`, dos rótulos e do painel.

## Iteração — contribuições na experiência (2026-09-18, branch `feat/g4f-contributions`)

Fonte: levantamento feito na máquina de trabalho do Bruno (git, sessões,
docs), resumido em `~/Documents/curriculo-adicoes-2026-09-18.md`. Só entrou o
que tem força `[git]` ou `[sessões]`; nada marcado `[notas]`, nada nominal
(cliente, sistemas, hosts), nada de métrica interna como destaque.

- **`Experience.highlights`** (opcional): bullets do que o Bruno fez na
  passagem — separado de `projects` (o que o sistema é). Renderizados na
  trajetória do site, no preview e no PDF, depois dos projetos.
- **Skills no PDF viram linha corrida por categoria** ("Frontend: a · b · c"),
  não chips: com sete bullets a mais na G4F o documento passou de duas
  páginas e a linha ocupa ~40% do espaço dos chips. Os termos em foco saem em
  negrito verde. O preview **mantém os chips** — divergência deliberada: na
  tela o grid é mais legível e ajuda a decidir o que incluir.
- **Linha de certificações + educação com `wrap={false}`**: uma linha flex não
  pagina; cortada no pé da página, o react-pdf esmagava as duas colunas uma
  sobre a outra em vez de quebrar. Inteira na página seguinte é o esperado.
- **Escala de espaçamento um passo mais justa** (paddings da página, margens
  de seção/entrada/bullets) para o pior caso — pt, com foco e case compacto —
  continuar em duas páginas (guard em `cv-document.test.tsx`).
- **Skills novas** (pt/en, tags G4F): Prisma 6, MongoDB, Migração de dados
  (ETL), Bitbucket Pipelines, HashiCorp Vault, Gates locais de qualidade,
  Desenvolvimento spec-driven, Orquestração multiagente, Desenvolvimento de
  servidor MCP, RAG · pgvector · grafo de conhecimento.
