import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  subheadline:
    "Trabalho como desenvolvedor há mais de 10 anos, hoje principalmente com TypeScript e Node. Gosto de acompanhar o sistema inteiro: escrevo o código, monto o CI/CD e cuido da infraestrutura (Docker, Kubernetes) onde ele roda.",
  metaDescription:
    "Full Stack Engineer sênior em Brasília — há 10+ anos do primeiro commit ao deploy sem downtime, com TypeScript, Node.js, React, CI/CD e Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Full Stack Engineer Sênior",
  languages: "Português (nativo) · Inglês intermediário-avançado (B2)",
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
