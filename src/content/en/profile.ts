import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full Stack Engineer",
  pitch:
    "I build and operate production systems from the first commit to deployment — backend architecture, reliable APIs and zero-downtime delivery, mostly with TypeScript and Node.js.",
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
