import type { GithubShowcase } from "@/domain";

/**
 * Static fallback used when the live GitHub API call fails (rate limit, outage, etc.).
 * Captured via `gh api repos/bcordeirodev/<name>` — refresh periodically to keep it current.
 */
export const githubSnapshot: GithubShowcase = {
  repos: [
    {
      name: "lawyer-hero-envato",
      description: "Landing page profissional para advogados",
      url: "https://github.com/bcordeirodev/lawyer-hero-envato",
      stars: 1,
      language: "TypeScript",
      pushedAt: "2025-08-10T14:18:37Z",
    },
    {
      name: "lawyer-hero-geovanna",
      description: "Lading page para advogados.",
      url: "https://github.com/bcordeirodev/lawyer-hero-geovanna",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-11-23T20:09:16Z",
    },
    {
      name: "rent-landingpage",
      description: "Landing for rent chairs",
      url: "https://github.com/bcordeirodev/rent-landingpage",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-12-18T18:49:58Z",
    },
    {
      name: "acerbrag",
      description: "Repositório usado no desenvolvimento da solução referente a empresa Acerbrag.",
      url: "https://github.com/bcordeirodev/acerbrag",
      stars: 0,
      language: "PHP",
      pushedAt: "2017-10-31T19:49:09Z",
    },
  ],
  latestRelease: null,
  source: "snapshot",
};
