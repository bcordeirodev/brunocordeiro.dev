import { describe, expect, it, vi } from "vitest";
import { fetchShowcase, SHOWCASE_REPOS } from "./core";

const repoPayload = (name: string) => ({
  name,
  description: "d",
  html_url: `https://github.com/bcordeirodev/${name}`,
  stargazers_count: 2,
  language: "TypeScript",
  pushed_at: "2026-08-01T00:00:00Z",
});

describe("fetchShowcase", () => {
  it("mapeia repos da allowlist na ordem e o último release", async () => {
    const fetchFn = vi.fn().mockImplementation((url: string) => {
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
});
