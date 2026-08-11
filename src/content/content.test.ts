import { describe, expect, it } from "vitest";
import { getContent, locales } from "@/content";

describe("conteúdo", () => {
  it("valida contra o domínio em todos os locales", () => {
    for (const locale of locales) expect(() => getContent(locale)).not.toThrow();
  });
  it("pt e en têm paridade estrutural", () => {
    const pt = getContent("pt");
    const en = getContent("en");
    expect(en.skillCategories.map((c) => c.id)).toEqual(pt.skillCategories.map((c) => c.id));
    expect(en.skillCategories.map((c) => c.skills.length)).toEqual(
      pt.skillCategories.map((c) => c.skills.length),
    );
    expect(en.experiences.map((e) => e.company)).toEqual(pt.experiences.map((e) => e.company));
    expect(en.caseStudy.chapters.map((c) => c.id)).toEqual(pt.caseStudy.chapters.map((c) => c.id));
  });
  it("não contém dados proibidos", () => {
    const raw = JSON.stringify(getContent("pt")) + JSON.stringify(getContent("en"));
    expect(raw).not.toMatch(/98363-1107|Quadra 11|Esplanada/i);
  });
});
