import { describe, expect, it } from "vitest";
import { aiStatsSchema } from "@/domain";
import { aiStats } from "./ai-stats";

describe("ai-stats content", () => {
  it("valida contra o schema", () => {
    expect(() => aiStatsSchema.parse(aiStats)).not.toThrow();
  });
  it("não vaza vendor, projetos nem paths", () => {
    const raw = JSON.stringify(aiStats);
    expect(raw).not.toMatch(/claude|anthropic|link-?charts|\/Users\//i);
  });
});
