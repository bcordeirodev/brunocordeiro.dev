import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Desenvolvedor full-stack",
  subheadline:
    "Há mais de 10 anos levo sistemas do primeiro commit à produção — hoje principalmente com TypeScript e Node, cuidando também do CI/CD e da infraestrutura (Docker, Kubernetes) que os mantém no ar.",
  metaDescription:
    "Desenvolvedor full-stack sênior em Brasília — há 10+ anos do primeiro commit ao deploy sem downtime, com TypeScript, Node.js, React, CI/CD e Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Desenvolvedor Full-Stack Sênior",
  languages: "Português (nativo) · Inglês avançado (C1)",
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
