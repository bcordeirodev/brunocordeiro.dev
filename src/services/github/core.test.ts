import { describe, expect, it, vi } from "vitest";
import { fetchShowcase, SHOWCASE_REPOS } from "./core";

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
  it("mapeia repos da allowlist na ordem e o último release", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/releases/latest"))
        return Promise.resolve(
          new Response(
            JSON.stringify({
              tag_name: "v1.50.0",
              published_at: "2026-08-01T00:00:00Z",
              html_url: "https://github.com/bcordeirodev/linkchart-backend/releases/tag/v1.50.0",
            }),
          ),
        );
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.source).toBe("live");
    expect(result.repos.map((r) => r.name)).toEqual(SHOWCASE_REPOS);
    expect(result.latestRelease?.tag).toBe("v1.50.0");
  });

  it("propaga erro quando a API falha (fallback é responsabilidade do wrapper)", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 403 }));
    await expect(fetchShowcase(fetchFn as unknown as typeof fetch, undefined)).rejects.toThrow();
  });

  it("usa os pinned repos do perfil quando há token e pins", async () => {
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
                  pinnedItems: { nodes: [pinnedNode("medFlow"), pinnedNode("print-shop-manager")] },
                },
              },
            }),
          ),
        );
      if (url.includes("/releases/latest"))
        return Promise.resolve(new Response("nope", { status: 404 }));
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify([])));
      throw new Error(`unexpected REST call: ${url}`);
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.repos.map((r) => r.name)).toEqual(["medFlow", "print-shop-manager"]);
    expect(result.repos[0]?.language).toBe("PHP");
    expect(result.repos[0]?.stars).toBe(3);
  });

  it("cai para a allowlist REST quando o perfil não tem pins", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/graphql")) return emptyPins();
      if (url.includes("/releases/latest"))
        return Promise.resolve(new Response("nope", { status: 404 }));
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
      if (url.includes("/releases/latest"))
        return Promise.resolve(new Response("nope", { status: 404 }));
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
      if (url.includes("/releases/latest"))
        return Promise.resolve(new Response("nope", { status: 404 }));
      if (url.includes("/users/bcordeirodev/repos"))
        return Promise.resolve(new Response(JSON.stringify(catalog)));
      const name = url.split("/repos/bcordeirodev/")[1]?.split("?")[0] ?? "";
      return Promise.resolve(new Response(JSON.stringify(repoPayload(name))));
    });
    const result = await fetchShowcase(fetchFn as unknown as typeof fetch, "tok");
    expect(result.allRepos.map((r) => r.name)).toEqual(["medFlow", "acerbrag"]);
  });
});
