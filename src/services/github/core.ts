import {
  githubRepoSchema,
  githubReleaseSchema,
  githubShowcaseSchema,
  type GithubShowcase,
} from "@/domain";

// Curated fallback shown when the profile has no pinned repos (or no token
// for the GraphQL pinned query — e.g. local dev). Pins take precedence.
export const SHOWCASE_REPOS = [
  "medFlow",
  "lawyer-hero-envato",
  "rent-landingpage",
  "print-shop-manager",
  "flutter-iesb-app",
  "internal-management-system",
] as const;
const OWNER = "bcordeirodev";
const RELEASE_REPO = "linkchart-backend";
// Profile-config repo (README do perfil), sem valor de portfólio no catálogo.
const PROFILE_CONFIG_REPO = "bcordeirodev";

const PINNED_QUERY = `query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          primaryLanguage { name }
          pushedAt
        }
      }
    }
  }
}`;

function headers(token: string | undefined): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getJson(
  fetchFn: typeof fetch,
  url: string,
  token: string | undefined,
): Promise<unknown> {
  const res = await fetchFn(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`github ${res.status} for ${url}`);
  return res.json();
}

async function fetchPinnedRepos(fetchFn: typeof fetch, token: string) {
  const res = await fetchFn("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query: PINNED_QUERY, variables: { login: OWNER } }),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: {
      user?: {
        pinnedItems?: {
          nodes?: Array<{
            name?: string;
            description?: string | null;
            url?: string;
            stargazerCount?: number;
            primaryLanguage?: { name?: string } | null;
            pushedAt?: string;
          }>;
        };
      };
    };
  };
  const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
  return nodes.map((node) =>
    githubRepoSchema.parse({
      name: node.name,
      description: node.description ?? null,
      url: node.url,
      stars: node.stargazerCount,
      language: node.primaryLanguage?.name ?? null,
      pushedAt: node.pushedAt,
    }),
  );
}

async function fetchAllowlistRepos(fetchFn: typeof fetch, token: string | undefined) {
  return Promise.all(
    SHOWCASE_REPOS.map(async (name) => {
      const raw = (await getJson(
        fetchFn,
        `https://api.github.com/repos/${OWNER}/${name}`,
        token,
      )) as Record<string, unknown>;
      return githubRepoSchema.parse({
        name: raw.name,
        description: raw.description,
        url: raw.html_url,
        stars: raw.stargazers_count,
        language: raw.language,
        pushedAt: raw.pushed_at,
      });
    }),
  );
}

async function fetchAllRepos(fetchFn: typeof fetch, token: string | undefined) {
  const raw = (await getJson(
    fetchFn,
    `https://api.github.com/users/${OWNER}/repos?per_page=100&type=owner&sort=pushed`,
    token,
  )) as Array<Record<string, unknown>>;
  return raw
    .filter(
      (repo) => repo.private !== true && repo.fork !== true && repo.name !== PROFILE_CONFIG_REPO,
    )
    .map((repo) =>
      githubRepoSchema.parse({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        pushedAt: repo.pushed_at,
      }),
    );
}

export async function fetchShowcase(
  fetchFn: typeof fetch,
  token: string | undefined,
): Promise<GithubShowcase> {
  // GitHub's GraphQL API (the only way to read profile pins) always requires
  // auth, so without a token we go straight to the curated REST allowlist.
  const pinned = token ? await fetchPinnedRepos(fetchFn, token) : [];
  const [repoResults, allRepos] = await Promise.all([
    pinned.length > 0 ? Promise.resolve(pinned) : fetchAllowlistRepos(fetchFn, token),
    fetchAllRepos(fetchFn, token),
  ]);
  const latestRelease = await getJson(
    fetchFn,
    `https://api.github.com/repos/${OWNER}/${RELEASE_REPO}/releases/latest`,
    token,
  )
    .then((raw) => {
      const r = raw as Record<string, unknown>;
      return githubReleaseSchema.parse({
        tag: r.tag_name,
        publishedAt: r.published_at,
        url: r.html_url,
      });
    })
    .catch(() => null);
  return githubShowcaseSchema.parse({
    repos: repoResults,
    allRepos,
    latestRelease,
    source: "live",
  });
}
