import { describe, expect, it } from "vitest";
import { buildPageMetadata, languageAlternates, languageTag, ogImageUrl, SITE_URL } from "./site";

describe("languageAlternates", () => {
  it("emite pt, pt-BR, en e x-default (en é o locale padrão)", () => {
    const alt = languageAlternates("");
    expect(alt["pt"]).toBe(`${SITE_URL}/pt`);
    expect(alt["pt-BR"]).toBe(`${SITE_URL}/pt`);
    expect(alt["en"]).toBe(`${SITE_URL}/en`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/en`);
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

describe("ogImageUrl", () => {
  it("aponta para a rota de OG image do locale", () => {
    expect(ogImageUrl("pt")).toBe(`${SITE_URL}/pt/opengraph-image/card`);
    expect(ogImageUrl("en")).toBe(`${SITE_URL}/en/opengraph-image/card`);
  });
});

describe("buildPageMetadata", () => {
  it("mantém canonical, OG e twitter coerentes por locale", () => {
    const meta = buildPageMetadata({ locale: "en", title: "T", description: "D" });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/en`);
    expect(meta.openGraph).toMatchObject({ url: `${SITE_URL}/en`, locale: "en_US" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
  // Rotas que declaram `openGraph` substituem o do pai por inteiro e perdem a
  // imagem da convenção de arquivo — link-charts e cv ficaram sem `og:image`
  // em produção até 2026-08-13. O guard trava as duas tags.
  it("sempre emite og:image e twitter:image apontando para a rota do locale", () => {
    for (const locale of ["pt", "en"] as const) {
      const meta = buildPageMetadata({
        locale,
        path: "/link-charts",
        title: "T",
        description: "D",
      });
      const images = meta.openGraph?.images;
      expect(images, `${locale}: openGraph.images ausente`).toBeDefined();
      expect(images).toMatchObject([
        { url: ogImageUrl(locale), width: 1200, height: 630, type: "image/png" },
      ]);
      expect(meta.twitter).toMatchObject({ images: [ogImageUrl(locale)] });
    }
  });
});
