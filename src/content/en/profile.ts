import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  // Autodescrição em primeira pessoa escrita pelo Bruno, sem o rótulo "Senior"
  // (o cargo indexável não o usa) e sem a frase sobre o nível de inglês — esse
  // dado é objetivo e vive em `languages`, no bloco de contato e no CV.
  pitch:
    "I'm a Full Stack Engineer with over 10 years of experience building software systems across the full stack, from front-end and back-end development to CI/CD pipelines and cloud infrastructure using Docker and Kubernetes. I currently work primarily with TypeScript and Node.js, with a strong focus on building scalable and maintainable applications.",
  availability: "Open to remote international roles · UTC−3",
  metaDescription:
    "Full Stack Engineer in Brazil — 10+ years building and operating production systems with TypeScript, Node.js, React, CI/CD and Kubernetes. Open to remote roles.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
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
