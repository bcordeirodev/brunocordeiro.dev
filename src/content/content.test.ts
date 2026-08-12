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
    expect(en.experiences.map((e) => e.stacks.length)).toEqual(
      pt.experiences.map((e) => e.stacks.length),
    );
    expect(en.experiences.map((e) => e.projects.length)).toEqual(
      pt.experiences.map((e) => e.projects.length),
    );
    expect(en.caseStudy.chapters.map((c) => c.id)).toEqual(pt.caseStudy.chapters.map((c) => c.id));
  });
  it("toda experiência tem stacks e pelo menos um projeto", () => {
    for (const locale of locales) {
      for (const exp of getContent(locale).experiences) {
        expect(exp.stacks.length, `${locale}: ${exp.company} sem stacks`).toBeGreaterThan(0);
        expect(exp.projects.length, `${locale}: ${exp.company} sem projetos`).toBeGreaterThan(0);
      }
    }
  });
  it("cargos seguem a nomenclatura padronizada por locale", () => {
    const ptRoles = new Set([
      "Desenvolvedor Full Stack",
      "Desenvolvedor Frontend",
      "Desenvolvedor PHP",
      "Desenvolvedor PHP Jr",
    ]);
    const enRoles = new Set([
      "Full Stack Developer",
      "Frontend Developer",
      "PHP Developer",
      "Junior PHP Developer",
    ]);
    for (const exp of getContent("pt").experiences)
      expect(ptRoles.has(exp.role), `pt: ${exp.company} → ${exp.role}`).toBe(true);
    for (const exp of getContent("en").experiences)
      expect(enRoles.has(exp.role), `en: ${exp.company} → ${exp.role}`).toBe(true);
  });
  it("não contém dados proibidos", () => {
    const raw = JSON.stringify(getContent("pt")) + JSON.stringify(getContent("en"));
    expect(raw).not.toMatch(/98363-1107|Quadra 11|Esplanada/i);
  });
  it("não contém vazamentos de nome real de projeto/infra nem notas de auditoria interna", () => {
    const raw = JSON.stringify(getContent("pt")) + JSON.stringify(getContent("en"));
    expect(raw).not.toMatch(/itamaraty|e-?consular|e-?folhas|harbor\.|\.local|sem evid[êe]ncia/i);
  });
});
