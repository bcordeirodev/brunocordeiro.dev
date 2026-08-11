# Bruno Cordeiro — [brunocordeiro.dev](https://brunocordeiro.dev)

[![ci](https://github.com/bcordeirodev/brunocordeiro.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/bcordeirodev/brunocordeiro.dev/actions/workflows/ci.yml)

Portfólio pessoal bilíngue (`pt`/`en`), escrito para outros devs: em vez de listar
tecnologias, mostra decisões de engenharia — arquitetura, testes, deploys sem
downtime — com métricas reais extraídas do dia a dia como full-stack engineer.

## Arquitetura

- `src/domain` — tipos de domínio puros (perfil, experiência, skill, case study), sem dependência de framework.
- `src/content/{pt,en}` — conteúdo estático tipado por locale, validado contra o domínio.
- `src/services` — integrações externas (ex.: showcase do GitHub, com cache e fallback estático).
- `src/components` — UI (seções, motion, layout), consumindo domínio + conteúdo via props.
- `src/app/[locale]` — rotas Next.js (App Router) que montam página a partir de conteúdo + componentes.

## Stack

- Next.js 16 (App Router, Cache Components) + React 19
- TypeScript strict, Tailwind CSS 4
- next-intl (i18n `pt`/`en`)
- Motion (animações, respeitando `prefers-reduced-motion`)
- Vitest + Testing Library, Playwright + axe-core
- Vercel (deploy)

## Rodando local

```bash
pnpm install
pnpm dev
```

## Qualidade

- **Vitest** — testes unitários de domínio, conteúdo e componentes.
- **Playwright** — e2e multi-viewport (mobile/tablet/desktop) com varredura de acessibilidade via `@axe-core/playwright`.
- **Lighthouse CI** — budget de performance, acessibilidade, boas práticas e SEO ≥ 95 em cada categoria, como gate obrigatório no CI.

Pipeline de CI roda `typecheck`, `lint`, `format:check`, `test` e `build` (job
`quality`), a suíte e2e (job `e2e`) e o budget do Lighthouse (job
`lighthouse`) a cada push/PR em `main`.

---

Este site também documenta, como conteúdo, o fluxo de engenharia assistida por
IA usado para construí-lo — do brief à revisão de código — como estudo de caso
de como usar essas ferramentas com rigor de engenharia.
