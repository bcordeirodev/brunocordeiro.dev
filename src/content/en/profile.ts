import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  subheadline:
    "For 10+ years I've taken systems from first commit to production — these days mostly with TypeScript and Node, also owning the CI/CD pipelines and the infrastructure (Docker, Kubernetes) that keep them running.",
  metaDescription:
    "Senior Full Stack Engineer in Brasília, Brazil — 10+ years from first commit to zero-downtime deploys, with TypeScript, Node.js, React, CI/CD and Kubernetes.",
  stackHighlights: ["TypeScript", "Node.js", "React", "Next.js", "Docker · K8s"],
  role: "Senior Full Stack Engineer",
  languages: "Portuguese (native) · English — upper intermediate (B2)",
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
