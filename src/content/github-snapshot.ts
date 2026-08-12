import type { GithubShowcase } from "@/domain";

/**
 * Static fallback used when the live GitHub API call fails (rate limit, outage, etc.).
 * Captured via `gh api repos/bcordeirodev/<name>` — refresh periodically to keep it current.
 */
export const githubSnapshot: GithubShowcase = {
  repos: [
    {
      name: "lawyer-hero-envato",
      description:
        "Professional landing page template for lawyers, built with Next.js 15, TypeScript and Tailwind CSS.",
      url: "https://github.com/bcordeirodev/lawyer-hero-envato",
      stars: 1,
      language: "TypeScript",
      pushedAt: "2025-08-10T14:18:37Z",
    },
    {
      name: "lawyer-hero-geovanna",
      description:
        "Landing page for a law firm, built with Next.js 15, TypeScript and Tailwind CSS.",
      url: "https://github.com/bcordeirodev/lawyer-hero-geovanna",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-11-23T20:09:16Z",
    },
    {
      name: "rent-landingpage",
      description:
        "SEO-optimized landing page for a chair rental service, built with Next.js 14 and Tailwind CSS.",
      url: "https://github.com/bcordeirodev/rent-landingpage",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-12-18T18:49:58Z",
    },
    {
      name: "acerbrag",
      description: "Loyalty and rewards program platform built with PHP (Optimuz framework).",
      url: "https://github.com/bcordeirodev/acerbrag",
      stars: 0,
      language: "PHP",
      pushedAt: "2026-08-12T16:12:18Z",
    },
  ],
  // Sem catálogo no fallback: o botão "ver todos" só aparece com dados vivos.
  allRepos: [],
  latestRelease: null,
  source: "snapshot",
};
