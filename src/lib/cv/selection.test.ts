import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { defaultSelection, experienceKey, skillKey } from "./selection";

const content = getContent("pt");

describe("defaultSelection", () => {
  it("marca todas as seções por padrão", () => {
    const sel = defaultSelection(content);
    expect(Object.values(sel.sections)).toHaveLength(7);
    expect(Object.values(sel.sections).every(Boolean)).toBe(true);
  });

  it("cobre todos os itens do conteúdo, todos marcados", () => {
    const sel = defaultSelection(content);
    expect(Object.keys(sel.experiences)).toEqual(content.experiences.map(experienceKey));
    expect(Object.keys(sel.certifications)).toEqual(content.certifications.map((c) => c.name));
    expect(Object.keys(sel.education)).toEqual(content.education.map((e) => e.degree));
    expect(Object.keys(sel.skills)).toEqual(
      content.skillCategories.flatMap((cat) => cat.skills.map((s) => skillKey(cat.id, s.name))),
    );
    const items = { ...sel.experiences, ...sel.skills, ...sel.certifications, ...sel.education };
    expect(Object.values(items).every(Boolean)).toBe(true);
  });

  it("gera chaves de experiência únicas mesmo com empresa repetida", () => {
    expect(experienceKey({ company: "ACME", start: "2020-01" })).not.toBe(
      experienceKey({ company: "ACME", start: "2022-05" }),
    );
  });
});
