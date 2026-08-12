import { describe, expect, it } from "vitest";
import { pdfSafe, toPdfText } from "./pdf-text";

describe("toPdfText", () => {
  it("troca caracteres que a Helvetica padrão do PDF não tem", () => {
    expect(toPdfText("PHP 5.6 → 8.2")).toBe("PHP 5.6 -> 8.2");
    expect(toPdfText("CI ≠ Release")).toBe("CI != Release");
    expect(toPdfText("▸ item ✔")).toBe("• item •");
  });

  it("preserva acentos, travessão e ponto médio, que existem no WinAnsi", () => {
    const text = "Brasília · São Paulo — Português (nativo)";
    expect(toPdfText(text)).toBe(text);
  });
});

describe("pdfSafe", () => {
  it("percorre objetos e arrays aninhados", () => {
    const data = {
      profile: { name: "Bruno", headline: "5.6 → 8.2" },
      skills: [{ name: "CI ≠ Release" }],
      count: 3,
      empty: null,
    };
    expect(pdfSafe(data)).toEqual({
      profile: { name: "Bruno", headline: "5.6 -> 8.2" },
      skills: [{ name: "CI != Release" }],
      count: 3,
      empty: null,
    });
  });

  it("não altera a estrutura original", () => {
    const data = { name: "5.6 → 8.2" };
    pdfSafe(data);
    expect(data.name).toBe("5.6 → 8.2");
  });
});
