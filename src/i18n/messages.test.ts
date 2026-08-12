import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";

function collectKeyPaths(messages: object, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? collectKeyPaths(value as object, path)
      : [path];
  });
}

describe("paridade de mensagens pt/en", () => {
  it("pt e en têm as mesmas chaves", () => {
    const ptKeys = collectKeyPaths(pt).sort();
    const enKeys = collectKeyPaths(en).sort();
    expect(ptKeys).toEqual(enKeys);
  });
});

describe("common.stars (pluralização ICU)", () => {
  it("en: usa singular para 1 e plural para 0/2+", () => {
    const t = createTranslator({ locale: "en", messages: en });
    expect(t("common.stars", { count: 1 })).toBe("1 star");
    expect(t("common.stars", { count: 0 })).toBe("0 stars");
    expect(t("common.stars", { count: 2 })).toBe("2 stars");
  });

  it("pt: usa singular para 1 e plural para 0/2+", () => {
    // O CLDR/ICU agrupa 0 na categoria "one" para pt (mesma categoria de 1),
    // o que produziria "0 estrela" sem a cláusula exata `=0` na mensagem.
    // Os dados reais do snapshot (github-snapshot.ts) têm 3 dos 4 repos com
    // stars: 0, então este caso é coberto explicitamente, não só o de count: 1.
    const t = createTranslator({ locale: "pt", messages: pt });
    expect(t("common.stars", { count: 1 })).toBe("1 estrela");
    expect(t("common.stars", { count: 0 })).toBe("0 estrelas");
    expect(t("common.stars", { count: 2 })).toBe("2 estrelas");
  });
});
