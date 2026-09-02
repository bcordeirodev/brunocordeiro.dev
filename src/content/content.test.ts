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
    // Links de site oficial são idênticos nos dois locales (label + url),
    // por categoria/índice — o conteúdo é duplicado por locale e sem este
    // guard as listas driftariam silenciosamente.
    expect(en.skillCategories.map((c) => c.skills.map((s) => s.links ?? null))).toEqual(
      pt.skillCategories.map((c) => c.skills.map((s) => s.links ?? null)),
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
      "Full Stack Engineer",
      "Desenvolvedor Frontend",
      "Desenvolvedor PHP",
      "Desenvolvedor PHP Jr",
    ]);
    const enRoles = new Set([
      "Full Stack Engineer",
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
    // \bharbor\. segue bloqueando hostnames de registry interno (harbor.corp…)
    // sem acusar o site oficial do projeto, goharbor.io ("go"+"harbor" é uma
    // palavra só, sem boundary antes de "harbor").
    expect(raw).not.toMatch(/itamaraty|e-?consular|e-?folhas|\bharbor\.|\.local|sem evid[êe]ncia/i);
  });
  it("perfil traz campos de SEO dentro do orçamento de caracteres", () => {
    for (const locale of locales) {
      const { profile } = getContent(locale);
      expect(profile.metaDescription.length).toBeGreaterThanOrEqual(80);
      expect(profile.metaDescription.length).toBeLessThanOrEqual(170);
      expect(profile.stackHighlights.length).toBeGreaterThanOrEqual(3);
      expect(profile.stackHighlights.length).toBeLessThanOrEqual(6);
    }
  });
  it("perfil posiciona sem marcador de senioridade e com disponibilidade", () => {
    for (const locale of locales) {
      const { profile } = getContent(locale);
      expect(profile.role).toBe("Full Stack Engineer");
      expect(profile.metaDescription).not.toMatch(/s[eê]nior/i);
      expect(profile.pitch.length).toBeGreaterThan(40);
      expect(profile.availability).toMatch(/remot/i);
      expect(profile.languages).toMatch(/B1/);
      // nível publicado é B1 (quase B2), nunca "— B2" como nível principal
      expect(profile.languages).not.toMatch(/—\s*B2\b/);
    }
  });
});
