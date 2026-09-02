import {
  githubRepoSchema,
  githubReleaseSchema,
  githubShowcaseSchema,
  githubRepoStatsSchema,
  linkchartsStatsSchema,
  type GithubRepoStats,
  type GithubShowcase,
  type LinkchartsStats,
} from "@/domain";

// 3 repos em destaque no grid da home. Pins do perfil têm precedência (até
// FEATURED_COUNT); esta allowlist é o fallback sem pins ou sem token
// (ex.: dev local). O catálogo completo continua no diálogo "ver todos".
export const FEATURED_COUNT = 3;
export const SHOWCASE_REPOS = ["medFlow", "lawyer-hero-envato", "print-shop-manager"] as const;
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

// Os repos migrados do GitLab têm tags semver mas nenhum GitHub Release, então
// o "último release" vem da tag mais recente; a data sai do commit apontado.
async function fetchLatestBackendTag(fetchFn: typeof fetch, token: string | undefined) {
  const tags = (await getJson(
    fetchFn,
    `https://api.github.com/repos/${OWNER}/${RELEASE_REPO}/tags?per_page=1`,
    token,
  )) as Array<{ name?: string; commit?: { url?: string } }>;
  const [tag] = tags;
  if (!tag?.name || !tag.commit?.url) throw new Error(`no tags in ${RELEASE_REPO}`);
  const commit = (await getJson(fetchFn, tag.commit.url, token)) as {
    commit?: { committer?: { date?: string } };
  };
  return githubReleaseSchema.parse({
    tag: tag.name,
    publishedAt: commit.commit?.committer?.date,
    url: `https://github.com/${OWNER}/${RELEASE_REPO}/releases/tag/${tag.name}`,
  });
}

export async function fetchShowcase(
  fetchFn: typeof fetch,
  token: string | undefined,
): Promise<GithubShowcase> {
  // GitHub's GraphQL API (the only way to read profile pins) always requires
  // auth, so without a token we go straight to the curated REST allowlist.
  const pinned = token ? (await fetchPinnedRepos(fetchFn, token)).slice(0, FEATURED_COUNT) : [];
  const [repoResults, allRepos] = await Promise.all([
    pinned.length > 0 ? Promise.resolve(pinned) : fetchAllowlistRepos(fetchFn, token),
    fetchAllRepos(fetchFn, token),
  ]);
  const latestRelease = await fetchLatestBackendTag(fetchFn, token).catch(() => null);
  return githubShowcaseSchema.parse({
    repos: repoResults,
    allRepos,
    latestRelease,
    source: "live",
  });
}

const LINKCHARTS_REPOS = { frontend: "linkchart-frontend", backend: "linkchart-backend" } as const;

// Conta itens paginados sem baixar tudo: com per_page=1, o rel="last" do
// header Link diz o total de páginas = total de itens; sem header, a própria
// página já é a coleção inteira.
function countFromLink(res: Response, pageLength: number): number {
  const match = res.headers.get("link")?.match(/[?&]page=(\d+)[^>]*>; rel="last"/);
  return match ? Number(match[1]) : pageLength;
}

async function getPage(
  fetchFn: typeof fetch,
  url: string,
  token: string | undefined,
): Promise<{ items: unknown[]; count: number }> {
  const res = await fetchFn(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`github ${res.status} for ${url}`);
  const items = (await res.json()) as unknown[];
  return { items, count: countFromLink(res, items.length) };
}

async function fetchRepoStats(
  fetchFn: typeof fetch,
  name: string,
  token: string | undefined,
): Promise<GithubRepoStats> {
  const base = `https://api.github.com/repos/${OWNER}/${name}`;
  const [info, languages, tagsPage, commitsPage] = await Promise.all([
    getJson(fetchFn, base, token) as Promise<Record<string, unknown>>,
    getJson(fetchFn, `${base}/languages`, token) as Promise<Record<string, number>>,
    getPage(fetchFn, `${base}/tags?per_page=1`, token),
    getPage(fetchFn, `${base}/commits?per_page=1`, token),
  ]);
  const latestTag = (tagsPage.items[0] as { name?: string } | undefined)?.name ?? null;
  return githubRepoStatsSchema.parse({
    name,
    url: info.html_url,
    commits: commitsPage.count,
    tags: tagsPage.count,
    latestTag,
    pushedAt: info.pushed_at,
    languages: Object.entries(languages)
      .map(([language, bytes]) => ({ name: language, bytes }))
      .sort((a, b) => b.bytes - a.bytes),
  });
}

export async function fetchLinkchartsStats(
  fetchFn: typeof fetch,
  token: string | undefined,
): Promise<LinkchartsStats> {
  const [frontend, backend] = await Promise.all([
    fetchRepoStats(fetchFn, LINKCHARTS_REPOS.frontend, token),
    fetchRepoStats(fetchFn, LINKCHARTS_REPOS.backend, token),
  ]);
  return linkchartsStatsSchema.parse({ frontend, backend, source: "live" });
}
