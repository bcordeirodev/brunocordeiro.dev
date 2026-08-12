import { describe, expect, it } from "vitest";
import { experienceSchema, siteContentSchema, skillSchema, grafanaStatsSchema } from "@/domain";

describe("domain schemas", () => {
  it("aceita skill com tags e rejeita skill sem tags", () => {
    expect(
      skillSchema.safeParse({
        name: "TypeScript",
        proof: "strict mode em ~570 arquivos",
        tags: ["Link Charts"],
      }).success,
    ).toBe(true);
    expect(skillSchema.safeParse({ name: "X", proof: "?", tags: [] }).success).toBe(false);
    expect(skillSchema.safeParse({ name: "X", proof: "?" }).success).toBe(false);
  });
  it("aceita links https de site oficial e rejeita http/lista vazia", () => {
    const base = { name: "React 19", proof: "base do frontend", tags: ["Link Charts"] };
    expect(
      skillSchema.safeParse({ ...base, links: [{ label: "React", url: "https://react.dev" }] })
        .success,
    ).toBe(true);
    expect(skillSchema.safeParse(base).success).toBe(true);
    expect(
      skillSchema.safeParse({ ...base, links: [{ label: "React", url: "http://react.dev" }] })
        .success,
    ).toBe(false);
    expect(skillSchema.safeParse({ ...base, links: [] }).success).toBe(false);
  });
  it("valida datas YYYY-MM e end null como atual", () => {
    expect(
      experienceSchema.safeParse({
        company: "G4F",
        role: "Full Stack Developer",
        employmentType: "freelance",
        start: "2022-03",
        end: null,
        stacks: ["Next.js"],
        projects: [],
      }).success,
    ).toBe(true);
    expect(
      experienceSchema.safeParse({
        company: "X",
        role: "Y",
        employmentType: "full-time",
        start: "03/2022",
        end: null,
        stacks: ["a"],
        projects: [],
      }).success,
    ).toBe(false);
  });
  it("rejeita SiteContent sem seções obrigatórias", () => {
    expect(siteContentSchema.safeParse({}).success).toBe(false);
  });
});

describe("grafanaStatsSchema", () => {
  it("aceita stats válidos e rejeita uptime fora de 0–100", () => {
    const valid = {
      fetchedAt: "2026-08-01T00:00:00Z",
      uptime30dPct: 99.0,
      p95RedirectMs: 180,
      errorRate5xxPct: 0.4,
      reqPerMin: 12,
      live: {
        uptime30dPct: false,
        p95RedirectMs: false,
        errorRate5xxPct: false,
        reqPerMin: false,
      },
    };
    expect(() => grafanaStatsSchema.parse(valid)).not.toThrow();
    expect(() => grafanaStatsSchema.parse({ ...valid, uptime30dPct: 101 })).toThrow();
  });
});
