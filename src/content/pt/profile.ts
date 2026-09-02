import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  // Autodescrição em primeira pessoa escrita pelo Bruno, sem o rótulo "Sênior"
  // (o cargo indexável não o usa) e sem a frase sobre o nível de inglês — esse
  // dado é objetivo e vive em `languages`, no bloco de contato e no CV.
  pitch:
    "Sou Full Stack Engineer com mais de 10 anos de experiência construindo sistemas de software em toda a stack, do front-end e back-end aos pipelines de CI/CD e à infraestrutura em nuvem com Docker e Kubernetes. Atualmente trabalho principalmente com TypeScript e Node.js, com foco em construir aplicações escaláveis e fáceis de manter.",
  availability: "Aberto a vagas remotas internacionais · UTC−3",
  metaDescription:
    "Full Stack Engineer em Brasília — 10+ anos construindo e operando sistemas em produção com TypeScript, Node.js, React, CI/CD e Kubernetes. Aberto a vagas remotas.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
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
