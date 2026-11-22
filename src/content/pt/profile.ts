import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  // Autodescrição em primeira pessoa escrita pelo Bruno, sem o rótulo "Sênior"
  // (o cargo indexável não o usa) e sem a frase sobre o nível de inglês — esse
  // dado é objetivo e vive em `languages`, no bloco de contato e no CV.
  pitch:
    "Sou Full Stack Engineer com mais de 10 anos de experiência construindo sistemas web com Laravel e NestJS no back-end e React, Next.js e Angular no front-end, em PHP e TypeScript, do código da aplicação aos pipelines de CI/CD e à infraestrutura com Docker e Kubernetes. Hoje desenvolvo uma plataforma de grande porte do setor público, usada em mais de 90 unidades, com NestJS e Angular, e mantenho aplicações Laravel em produção desde 2017.",
  availability: "Aberto a vagas remotas internacionais · UTC−3",
  metaDescription:
    "Full Stack Engineer em Brasília — 10+ anos construindo sistemas em produção com PHP/Laravel, Node.js/NestJS, React, Angular, CI/CD e Kubernetes. Aberto a vagas remotas.",
  // Ordem = ênfase (decidida pelo Bruno em 2026-11-22): Laravel, Node.js com
  // NestJS, React com Next.js e só então Angular, com menos destaque que
  // antes. A linha alimenta o hero, a OG image e o destaque das stacks na
  // trajetória.
  stackHighlights: [
    "Laravel · PHP",
    "Node.js · NestJS",
    "React · Next.js",
    "Angular",
    "TypeScript",
    "Docker · K8s",
  ],
  role: "Full Stack Engineer",
  languages: "Português — nativo · Inglês — B1, quase B2",
  location: "Brasília-DF, Brasil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "ago/2026",
  asOfYm: "2026-08",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "anos de carreira" },
    { id: "tests", value: 902, suffix: "", label: "testes no gate do CI" },
    { id: "downtime", value: 0, suffix: "s", label: "de downtime em deploy" },
    { id: "releases", value: 50, suffix: "", label: "releases desde mar/2025" },
  ],
};
