import { describe, expect, it } from "vitest";
import { experienceSchema, siteContentSchema, skillSchema } from "@/domain";

describe("domain schemas", () => {
  it("aceita skill válida e rejeita evidence desconhecida", () => {
    expect(
      skillSchema.safeParse({ name: "TypeScript", evidence: "production", proof: "Link Charts" })
        .success,
    ).toBe(true);
    expect(skillSchema.safeParse({ name: "X", evidence: "guru", proof: "?" }).success).toBe(false);
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
