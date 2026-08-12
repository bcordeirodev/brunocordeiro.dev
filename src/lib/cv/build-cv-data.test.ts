import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { buildCvData } from "./build-cv-data";
import { defaultSelection, experienceKey, skillKey } from "./selection";

const content = getContent("pt");

describe("buildCvData", () => {
  it("com seleção default inclui todas as seções", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    expect(data.summary).toBe(content.profile.subheadline);
    expect(data.metrics).toEqual(content.profile.metrics);
    expect(data.experiences).toEqual(content.experiences);
    expect(data.skillCategories).toEqual(content.skillCategories);
    expect(data.certifications).toEqual(content.certifications);
    expect(data.education).toEqual(content.education);
    expect(data.caseStudy).toEqual({
      title: content.caseStudy.title,
      tagline: content.caseStudy.tagline,
      url: "https://brunocordeiro.dev/pt/link-charts",
    });
  });

  it("perfil/contatos sempre presentes, mesmo com tudo desmarcado", () => {
    const sel = defaultSelection(content);
    sel.sections = {
      summary: false,
      metrics: false,
      experiences: false,
      skills: false,
      certifications: false,
      education: false,
      caseStudy: false,
    };
    const data = buildCvData(content, sel, "pt");
    expect(data.profile).toEqual(content.profile);
    expect(data.summary).toBeNull();
    expect(data.metrics).toBeNull();
    expect(data.experiences).toBeNull();
    expect(data.skillCategories).toBeNull();
    expect(data.certifications).toBeNull();
    expect(data.education).toBeNull();
    expect(data.caseStudy).toBeNull();
  });

  it("filtra itens individuais desmarcados", () => {
    const sel = defaultSelection(content);
    const dropped = content.experiences[0]!;
    sel.experiences[experienceKey(dropped)] = false;
    const data = buildCvData(content, sel, "pt");
    expect(data.experiences).toHaveLength(content.experiences.length - 1);
    expect(data.experiences).not.toContainEqual(dropped);
  });

  it("categoria de skill sem itens marcados some; seção com zero itens vira null", () => {
    const sel = defaultSelection(content);
    const cat = content.skillCategories[0]!;
    for (const s of cat.skills) sel.skills[skillKey(cat.id, s.name)] = false;
    const partial = buildCvData(content, sel, "pt");
    expect(partial.skillCategories?.some((c) => c.id === cat.id)).toBe(false);

    for (const c of content.skillCategories)
      for (const s of c.skills) sel.skills[skillKey(c.id, s.name)] = false;
    expect(buildCvData(content, sel, "pt").skillCategories).toBeNull();
  });

  it("seção desmarcada esconde tudo mesmo com itens marcados", () => {
    const sel = defaultSelection(content);
    sel.sections.certifications = false;
    expect(buildCvData(content, sel, "pt").certifications).toBeNull();
  });

  it("usa o locale na URL do case study", () => {
    const data = buildCvData(content, defaultSelection(content), "en");
    expect(data.caseStudy?.url).toBe("https://brunocordeiro.dev/en/link-charts");
  });
});
