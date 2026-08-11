import type { Profile } from "@/domain";

export const profile: Profile = {
  name: "Bruno Cordeiro",
  headline: "End-to-end full-stack engineering",
  subheadline: "From commit to zero-downtime deploy — 10+ years building systems that stay up.",
  location: "Brasília-DF, Brazil",
  email: "bcordeiro.dev@gmail.com",
  github: "https://github.com/bcordeirodev",
  linkedin: "https://www.linkedin.com/in/bruno-c-a85561142/",
  metricsAsOf: "Aug/2026",
  metrics: [
    { id: "years", value: 10, suffix: "+", label: "years of career" },
    { id: "tests", value: 902, suffix: "", label: "tests in Link Charts' CI" },
    { id: "downtime", value: 0, suffix: "s", label: "deploy downtime" },
    { id: "releases", value: 50, suffix: "", label: "production releases" },
  ],
};
