import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { getContent } from "@/content";

describe("sitemap", () => {
  it("usa lastModified estável derivado de asOfYm", () => {
    const expected = `${getContent("pt").profile.asOfYm}-01`;
    for (const entry of sitemap()) expect(entry.lastModified).toBe(expected);
  });
  it("cobre home, link-charts e cv nos dois locales com alternates pt", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://brunocordeiro.dev/pt");
    expect(urls).toContain("https://brunocordeiro.dev/pt/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/pt/cv");
    expect(urls).toContain("https://brunocordeiro.dev/en");
    expect(urls).toContain("https://brunocordeiro.dev/en/link-charts");
    expect(urls).toContain("https://brunocordeiro.dev/en/cv");
    const home = entries.find((e) => e.url === "https://brunocordeiro.dev/pt");
    expect(home?.alternates?.languages).toHaveProperty("pt");
    expect(home?.alternates?.languages).toHaveProperty("pt-BR");
  });
});
