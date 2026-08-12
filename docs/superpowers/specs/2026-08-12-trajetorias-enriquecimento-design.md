# Enriquecimento da seção Trajetórias — design

Data: 2026-08-12
Status: aprovado em conversa (design); pendências listadas ao final
Fontes: `../curriculum/profile-data/` (00-PERFIL-MASTER, 01-curriculo, 11-linkedin, 14-g4f-econsular-stacks) + respostas diretas do Bruno (2026-08-12)

## Objetivo

A seção de trajetórias está incompleta frente ao levantamento do currículo: Ebserh sem stack/projeto, VegaIT sem contexto, G4F sem o projeto de folha de pagamento e sem as stacks de alto valor do projeto consular, projetos ausentes na Plug Digital, Harbor ausente na Basis, e nomenclatura de cargos inconsistente (mistura de idiomas e 3 variações de "PHP").

## Abordagem

**Só dados** — tudo cabe no schema atual (`experienceSchema`: `stacks` + `projects`). Nenhuma mudança de domínio, schema ou UI. Arquivos alterados:

- `src/content/pt/experiences.ts`
- `src/content/en/experiences.ts`

Evolução futura (fora de escopo): campo `summary` por experiência.

## Padronização de cargos (decisão do Bruno, 2026-08-12)

Um nome por tipo de cargo, consistente dentro de cada idioma:

| Tipo                            | PT                       | EN                   |
| ------------------------------- | ------------------------ | -------------------- |
| Full stack (G4F, Ebserh, Basis) | Desenvolvedor Full Stack | Full Stack Developer |
| Frontend (VegaIT)               | Desenvolvedor Frontend   | Frontend Developer   |
| PHP (PROS, Transoft)            | Desenvolvedor PHP        | PHP Developer        |
| PHP júnior (Plug Digital)       | Desenvolvedor PHP Jr     | Junior PHP Developer |

Correções resultantes: PT deixa de usar títulos em inglês (G4F, VegaIT, PROS) e "Programador PHP (Jr)" (Transoft, Plug); EN deixa de usar "PHP Programmer"/"Junior PHP Programmer".

## Mudanças por experiência

### G4F Soluções Corporativas

**Stacks — adicionar** (fonte: `14-g4f-econsular-stacks.md`, decisão: os 4 grupos):

- PT: `hCaptcha + biometria facial`, `DOMPurify`, `CSP por request/HSTS`, `Geração documental (PDF/xlsx)`, `E-mail transacional (MJML)`, `Bamboo`, `Harbor`
- EN: `hCaptcha + facial biometrics`, `DOMPurify`, `Per-request CSP/HSTS`, `Document generation (PDF/xlsx)`, `Transactional email (MJML)`, `Bamboo`, `Harbor`

**Projetos — adicionar** (nome genérico, decisão do Bruno — consistente com a regra do E-consular):

- PT: **Sistema de folha de pagamento consular (setor público federal)** — "Gestão da folha de pagamento de funcionários dos consulados no exterior"
- EN: **Consular payroll system (federal public sector)** — "Payroll management for consulate employees abroad"

### VegaIT

**Projetos — adicionar** (fonte: Bruno, 2026-08-12; coerente com repo privado `hotel`/"SIM" de 2022):

- PT: **SIM – Manutenção** — "Gestão de manutenção hoteleira: QR code de equipamentos, cadastros de andares, quartos e objetos, ordens de serviço"
- EN: **SIM – Maintenance** — "Hotel maintenance management: equipment QR codes, floor/room/asset registries, service orders"

**Stacks — ajustar**: `Azure DevOps` → `Azure DevOps (Pipelines)`; adicionar `ESLint/tsc`.

### Ebserh

Card hoje vazio. Fonte: Bruno (2026-08-12) — sistema de gestão hospitalar com Laravel + React/TS + PostgreSQL, pipeline e testes unitários; versões inferidas pelas datas de release da janela set/2021–jun/2022 (React 18 saiu mar/2022; Laravel 9 saiu fev/2022; TS 4.4–4.7; PostgreSQL 14 saiu set/2021).

**Stacks**:

- PT: `React 17`, `TypeScript 4`, `Laravel 8`, `PHP 7.4/8.0`, `PostgreSQL 13`, `Jest`, `PHPUnit 9`, `Pipeline CI/CD`
- EN: `React 17`, `TypeScript 4`, `Laravel 8`, `PHP 7.4/8.0`, `PostgreSQL 13`, `Jest`, `PHPUnit 9`, `CI/CD pipeline`

**Projetos**:

- PT: **Sistema de gestão hospitalar** — "Controle de orçamentos e cadastros de hospitais e setores para a rede de hospitais universitários federais"
- EN: **Hospital management system** — "Budget control and hospital/department registries for the federal university hospital network"

### Basis Tecnologia

**Stacks — adicionar**: `Harbor` (citado no CV na fase Basis; hoje só Rancher está no site). PT e EN.

## Localizações (LinkedIn ao vivo, verificado em 2026-08-12)

O LinkedIn traz localização em todas as posições; o site só exibe em G4F e Ebserh. Adicionar `location`:

| Empresa      | LinkedIn          | Site (PT / EN)                                        |
| ------------ | ----------------- | ----------------------------------------------------- |
| VegaIT       | Brazil            | Brasil / Brazil                                       |
| Basis        | Brasília, DF      | Brasília-DF                                           |
| PROS         | Brasília, DF      | Brasília-DF                                           |
| Transoft     | Brasília e Região | Brasília-DF (normalizado ao formato já usado no site) |
| Plug Digital | Brasília e Região | Brasília-DF (normalizado)                             |

### Partido Republicano da Ordem Social

Apenas padronização de cargo (tabela acima). Projetos e stacks inalterados.

### Transoft

Apenas padronização de cargo. Datas/vínculo mantidos (decisão do Bruno: sobreposição com Plug em jun–nov/2017 existiu mesmo).

### Plug Digital

**Projetos — adicionar** (fonte: CV; decisão do Bruno — repetição com PROS é fiel à história):

- PT: **SGP / GPES** — "Gestão partidária e pesquisas estratégicas"
- EN: **SGP / GPES** — "Party management and strategic research systems"

## Adendo (2026-08-12, feedback do Bruno pós-primeira implementação)

- **Ebserh**: pipeline era **Azure Pipelines** (substitui o genérico "Pipeline CI/CD"); adicionar Docker, **Portainer**, Git, ESLint/Prettier/tsc e **Eloquent (migrations, factories, API Resources)** — tratamento de dados do Laravel para a web.
- **VegaIT**: era atuação frontend — adicionar **React Query** e Prettier (`ESLint/tsc` → `ESLint/Prettier/tsc`).
- **Basis**: os sistemas eram do **governo federal** — anotar nas descrições de SECIC e Pátria Voluntária.
- **Plug Digital**: PHP era **5.6**; jQuery com plugins (datepicker, carousel, gráficos); **framework próprio com CLI**, documentado com padrões de mercado (PSRs/PHPDoc já constavam no card).

## Validação

1. Suíte de testes do repo (o `domain.test.ts` valida os conteúdos contra o schema Zod).
2. `tsc`/lint conforme scripts do projeto.
3. Conferência visual da seção em pt e en (dev server).

## Pendências

Todas resolvidas em 2026-08-12:

1. ~~LinkedIn ao vivo~~ — perfil re-checado logado via Playwright: as 7 posições batem com `11-linkedin.md` (datas, cargos, vínculos); único delta são as localizações por posição, incorporadas na seção "Localizações".
2. ~~Nome público "SIM – Manutenção"~~ — aprovado pelo Bruno ("pode deixar").
3. ~~Versões Ebserh~~ — aprovadas como inferidas.
