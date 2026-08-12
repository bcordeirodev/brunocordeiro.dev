import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "Full-stack developer",
  subheadline:
    "For 10+ years I've taken systems from first commit to production — these days mostly with TypeScript and Node, also owning the CI/CD pipelines and the infrastructure (Docker, Kubernetes) that keep them running.",
  role: "Senior Full-Stack Developer",
  languages: "Portuguese (native) · English — advanced (C1)",
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
