import { describe, expect, it } from "vitest";
import { buildPageMetadata, languageAlternates, languageTag, SITE_URL } from "./site";

describe("languageAlternates", () => {
  it("emite pt, pt-BR, en e x-default", () => {
    const alt = languageAlternates("");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt`);
    expect(alt["en"]).toBe(`${SITE_URL}/en`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/pt`);
  });
  it("propaga o path para todas as línguas", () => {
    const alt = languageAlternates("/link-charts");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt/link-charts`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt/link-charts`);
    expect(alt["en"]).toBe(`${SITE_URL}/en/link-charts`);
  });
});

describe("languageTag", () => {
  it("mapeia locale para a tag BCP 47 canônica", () => {
    expect(languageTag("pt")).toBe("pt-BR");
    expect(languageTag("en")).toBe("en");
  });
});

describe("buildPageMetadata", () => {
  it("mantém canonical, OG e twitter coerentes por locale", () => {
    const meta = buildPageMetadata({ locale: "en", title: "T", description: "D" });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/en`);
    expect(meta.openGraph).toMatchObject({ url: `${SITE_URL}/en`, locale: "en_US" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
