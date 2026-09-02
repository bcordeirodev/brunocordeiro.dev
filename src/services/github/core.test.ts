import { describe, expect, it, vi } from "vitest";
import { fetchLinkchartsStats, fetchShowcase, SHOWCASE_REPOS } from "./core";

it("a allowlist de destaque tem exatamente 3 repos", () => {
  expect(SHOWCASE_REPOS).toEqual(["medFlow", "lawyer-hero-envato", "print-shop-manager"]);
});

const repoPayload = (name: string) => ({
  name,
  description: "d",
  html_url: `https://github.com/bcordeirodev/${name}`,
  stargazers_count: 2,
  language: "TypeScript",
  pushed_at: "2026-08-01T00:00:00Z",
  private: false,
  fork: false,
});

const emptyPins = () =>
  Promise.resolve(new Response(JSON.stringify({ data: { user: { pinnedItems: { nodes: [] } } } })));

describe("fetchShowcase", () => {
  it("mapeia repos da allowlist na ordem", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.source).toBe("live");
    expect(result.repos.map((r) => r.name)).toEqual(SHOWCASE_REPOS);
  });

  it("deriva o último release da tag mais recente do backend (repos migrados não têm Releases)", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/linkchart-backend/tags"))
        return Promise.resolve(
          new Response(
            JSON.stringify([
              {
                name: "v2.16.0",
                commit: {
                  sha: "abc123",
                  url: "https://api.github.com/repos/bcordeirodev/linkchart-backend/commits/abc123",
                },
              },
            ]),
          ),
        );
      if (url.endsWith("/commits/abc123"))
        return Promise.resolve(
          new Response(JSON.stringify({ commit: { committer: { date: "2026-08-01T12:00:00Z" } } })),
        );
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.latestRelease).toEqual({
      tag: "v2.16.0",
      publishedAt: "2026-08-01T12:00:00Z",
      url: "https://github.com/bcordeirodev/linkchart-backend/releases/tag/v2.16.0",
    });
  });

  it("propaga erro quando a API falha (fallback é responsabilidade do wrapper)", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 403 }));
    await expect(fetchShowcase(fetchFn as unknown as typeof fetch, undefined)).rejects.toThrow();
  });

  it("usa até 3 pinned repos do perfil quando há token e pins", async () => {
    const pinnedNode = (name: string) => ({
      name,
      description: "pinned",
      url: `https://github.com/bcordeirodev/${name}`,
      stargazerCount: 3,
      primaryLanguage: { name: "PHP" },
      pushedAt: "2026-08-12T00:00:00Z",
    });
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql"))
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user: {
                  pinnedItems: {
                    nodes: [
                      pinnedNode("medFlow"),
                      pinnedNode("print-shop-manager"),
                      pinnedNode("lawyer-hero-envato"),
                      pinnedNode("rent-landingpage"),
                    ],
                  },
                },
              },
            }),
          ),
        );
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      throw new Error(`unexpected REST call: ${url}`);
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    // 3 em destaque: o restante fica no diálogo "ver todos", não no grid.
    expect(result.repos.map((r) => r.name)).toEqual([
      "medFlow",
      "print-shop-manager",
      "lawyer-hero-envato",
    ]);
    expect(result.repos[0]?.language).toBe("PHP");
    expect(result.repos[0]?.stars).toBe(3);
  });

  it("cai para a allowlist REST quando o perfil não tem pins", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.repos.map((r) => r.name)).toEqual(SHOWCASE_REPOS);
  });

  it("sem token nem tenta GraphQL: vai direto à allowlist REST", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) throw new Error("GraphQL não deve ser chamado sem token");
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, undefined);
    expect(result.repos.map((r) => r.name)).toEqual(SHOWCASE_REPOS);
  });

  it("lista allRepos públicos, sem forks e sem o repo de config do perfil", async () => {
    const catalog = [
      repoPayload("medFlow"),
      { ...repoPayload("bcordeirodev") },
      { ...repoPayload("algum-fork"), fork: true },
      { ...repoPayload("privado"), private: true },
      repoPayload("acerbrag"),
    ];
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify(catalog)));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.allRepos.map((r) => r.name)).toEqual(["medFlow", "acerbrag"]);
  });
});

describe("fetchLinkchartsStats", () => {
  const linkHeader = (repo: string, resource: string, last: number) => ({
    Link: `<https://api.github.com/repos/bcordeirodev/${repo}/${resource}?per_page=1&page=2>; rel="next", <https://api.github.com/repos/bcordeirodev/${repo}/${resource}?per_page=1&page=${last}>; rel="last"`,
  });

  const statsFetchMock = () =>
    vi.fn().mockImplementation((url: string) => {
      const isFrontend = url.includes("linkchart-frontend");
      const repo = isFrontend ? "linkchart-frontend" : "linkchart-backend";
      if (url.endsWith("/languages"))
        return Promise.resolve(
          new Response(
            JSON.stringify(
              isFrontend
                ? { CSS: 47241, TypeScript: 2653943, JavaScript: 42753 }
                : { PHP: 2470240, Blade: 58601 },
            ),
          ),
        );
      if (url.includes("/tags"))
        return Promise.resolve(
          new Response(JSON.stringify([{ name: isFrontend ? "v1.19.0" : "v2.16.0" }]), {
            headers: linkHeader(repo, "tags", isFrontend ? 27 : 23),
          }),
        );
      if (url.includes("/commits"))
        return Promise.resolve(
          new Response(JSON.stringify([{ sha: "abc" }]), {
            headers: linkHeader(repo, "commits", isFrontend ? 1030 : 715),
          }),
        );
      return Promise.resolve(
        new Response(
          JSON.stringify({
            html_url: `https://github.com/bcordeirodev/${repo}`,
            pushed_at: "2026-08-14T19:42:16Z",
          }),
        ),
      );
    });

  it("conta commits e tags pelo header Link e ordena linguagens por bytes", async () => {
    const result = await fetchLinkchartsStats(statsFetchMock() as unknown as typeof fetch, "tok");
    expect(result.source).toBe("live");
    expect(result.frontend).toEqual({
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
      ],
    });
    expect(result.backend.commits).toBe(715);
    expect(result.backend.tags).toBe(23);
    expect(result.backend.latestTag).toBe("v2.16.0");
  });

  it("sem header Link usa o tamanho da página como contagem", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/languages"))
        return Promise.resolve(new Response(JSON.stringify({ PHP: 10 })));
      if (url.includes("/tags")) return Promise.resolve(new Response(JSON.stringify([])));
      if (url.includes("/commits"))
        return Promise.resolve(new Response(JSON.stringify([{ sha: "só-um" }])));
      return Promise.resolve(
        new Response(
          JSON.stringify({
            html_url: "https://github.com/bcordeirodev/x",
            pushed_at: "2026-08-14T00:00:00Z",
          }),
        ),
      );
    });
    const result = await fetchLinkchartsStats(fetchFn as unknown as typeof fetch, undefined);
    expect(result.frontend.commits).toBe(1);
    expect(result.frontend.tags).toBe(0);
    expect(result.frontend.latestTag).toBeNull();
  });

  it("propaga erro quando a API falha (fallback é responsabilidade do wrapper)", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 403 }));
    await expect(
      fetchLinkchartsStats(fetchFn as unknown as typeof fetch, undefined),
    ).rejects.toThrow();
  });
});
