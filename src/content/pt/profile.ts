import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Engenharia full-stack de ponta a ponta",
  subheadline: "Do commit ao deploy zero-downtime — 10+ anos construindo sistemas que ficam de pé.",
  role: "Desenvolvedor Full-Stack Sênior",
  languages: "Português (nativo) · Inglês avançado (C1)",
  location: "Brasília-DF, Brasil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "ago/2026",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "anos de carreira" },
    { id: "tests", value: 902, suffix: "", label: "testes automatizados bloqueando cada merge" },
    { id: "downtime", value: 0, suffix: "s", label: "de downtime em produção" },
    { id: "releases", value: 50, suffix: "", label: "releases em produção" },
  ],
};
