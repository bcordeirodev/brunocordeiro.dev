import type { LinkchartsStats } from "@/domain";

/**
 * Fallback estático usado quando a API do GitHub falha (rate limit, outage)
 * ou em dev sem rede. Capturado via `gh api repos/bcordeirodev/<repo>` +
 * headers Link de /commits e /tags com per_page=1 — atualizar periodicamente.
 */
export const linkchartsStatsSnapshot: LinkchartsStats = {
  frontend: {
    name: "linkchart-frontend",
    url: "https://github.com/bcordeirodev/linkchart-frontend",
    commits: 1030,
    tags: 27,
    latestTag: "v1.19.0",
    pushedAt: "2026-08-14T19:42:16Z",
    languages: [
      { name: "TypeScript", bytes: 2653943 },
      { name: "CSS", bytes: 47241 },
      { name: "JavaScript", bytes: 42753 },
      { name: "Shell", bytes: 7243 },
      { name: "Dockerfile", bytes: 1983 },
    ],
  },
  backend: {
    name: "linkchart-backend",
    url: "https://github.com/bcordeirodev/linkchart-backend",
    commits: 715,
    tags: 23,
    latestTag: "v2.16.0",
    pushedAt: "2026-08-14T19:42:03Z",
    languages: [
      { name: "PHP", bytes: 2470240 },
      { name: "Blade", bytes: 58601 },
      { name: "Shell", bytes: 24518 },
      { name: "HTML", bytes: 21912 },
      { name: "Dockerfile", bytes: 5459 },
    ],
  },
  source: "snapshot",
};
