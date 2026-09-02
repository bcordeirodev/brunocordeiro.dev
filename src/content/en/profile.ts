import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  subheadline:
    "I've been building systems for over 10 years, from the front end to the back end, including CI/CD pipelines and the Docker and Kubernetes infrastructure they run on. These days I work mostly with TypeScript and Node. My English is B1, close to B2.",
  metaDescription:
    "Senior Full Stack Engineer in Brasília, Brazil — 10+ years from first commit to zero-downtime deploys, with TypeScript, Node.js, React, CI/CD and Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Senior Full Stack Engineer",
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
