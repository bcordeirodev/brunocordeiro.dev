import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  // Autodescrição em primeira pessoa escrita pelo Bruno, sem o rótulo "Senior"
  // (o cargo indexável não o usa) e sem a frase sobre o nível de inglês — esse
  // dado é objetivo e vive em `languages`, no bloco de contato e no CV.
  pitch:
    "I'm a Full Stack Engineer with over 10 years of experience building web systems with Laravel and NestJS on the back end and React, Next.js and Angular on the front end, in PHP and TypeScript, from application code to CI/CD pipelines and infrastructure with Docker and Kubernetes. I currently build a large-scale public-sector platform used across 90+ service units with NestJS and Angular, and I have kept Laravel applications in production since 2017.",
  availability: "Open to remote international roles · UTC−3",
  metaDescription:
    "Full Stack Engineer in Brazil — 10+ years building production systems with PHP/Laravel, Node.js/NestJS, React, Angular, CI/CD and Kubernetes. Open to remote roles.",
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
  languages: "Portuguese — native · English — B1, approaching B2",
  location: "Brasília-DF, Brazil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "Aug/2026",
  asOfYm: "2026-08",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "years of experience" },
    { id: "tests", value: 902, suffix: "", label: "tests gating CI" },
    { id: "downtime", value: 0, suffix: "s", label: "of deploy downtime" },
    { id: "releases", value: 50, suffix: "", label: "releases since Mar 2025" },
  ],
};
