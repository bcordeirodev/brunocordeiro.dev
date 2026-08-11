import {
  githubRepoSchema,
  githubReleaseSchema,
  githubShowcaseSchema,
  type GithubShowcase,
} from "@/domain";

export const SHOWCASE_REPOS = [
  "lawyer-hero-envato",
  "lawyer-hero-geovanna",
  "rent-landingpage",
  "acerbrag",
] as const;
const OWNER = "bcordeirodev";
const RELEASE_REPO = "linkchart-backend";

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

export async function fetchShowcase(
  fetchFn: typeof fetch,
  token: string | undefined,
): Promise<GithubShowcase> {
  const repoResults = await Promise.all(
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
  return githubShowcaseSchema.parse({ repos: repoResults, latestRelease, source: "live" });
}
