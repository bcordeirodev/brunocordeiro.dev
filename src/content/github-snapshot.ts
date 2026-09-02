import type { GithubShowcase } from "@/domain";

/**
 * Static fallback used when the live GitHub API call fails (rate limit, outage, etc.).
 * Captured via `gh api repos/bcordeirodev/<name>` — refresh periodically to keep it current.
 */
export const githubSnapshot: GithubShowcase = {
  repos: [
    {
      name: "medFlow",
      description:
        "Medical practice management platform: patients, prescriptions and clinical documents.",
      url: "https://github.com/bcordeirodev/medFlow",
      stars: 0,
      language: "TypeScript",
      pushedAt: "2025-08-15T13:50:53Z",
    },
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
      name: "print-shop-manager",
      description:
        "Print shop management system for material control and printing workflows. Laravel + Blade.",
      url: "https://github.com/bcordeirodev/print-shop-manager",
      stars: 0,
      language: "PHP",
      pushedAt: "2026-08-12T15:41:29Z",
    },
  ],
  // Sem catálogo no fallback: o botão "ver todos" só aparece com dados vivos.
  allRepos: [],
  latestRelease: null,
  source: "snapshot",
};
