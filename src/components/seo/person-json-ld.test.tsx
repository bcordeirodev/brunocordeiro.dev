import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonJsonLd } from "./person-json-ld";
import { getContent } from "@/content";

// Forma mínima dos nós do @graph acessados nos asserts — evita `any`
// (bloqueado pelo lint) sem duplicar o schema.org inteiro.
interface Node {
  "@type"?: string;
  "@id"?: string;
  name?: string;
  url?: string;
  inLanguage?: string;
  sameAs?: string[];
  mainEntity?: { "@id": string };
  isPartOf?: { "@id": string };
}

function graphFor(locale: "pt" | "en"): Node[] {
  const { container } = render(
    <PersonJsonLd profile={getContent(locale).profile} locale={locale} />,
  );
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? "{}")["@graph"] ?? [];
}

describe("PersonJsonLd", () => {
  it("emite @graph com WebSite, ProfilePage e Person interligados", () => {
    const graph = graphFor("pt");
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebSite", "ProfilePage", "Person"]));
    const profilePage = graph.find((n) => n["@type"] === "ProfilePage")!;
    const person = graph.find((n) => n["@type"] === "Person")!;
    const website = graph.find((n) => n["@type"] === "WebSite")!;
    expect(profilePage.mainEntity?.["@id"]).toBe(person["@id"]);
    expect(profilePage.isPartOf?.["@id"]).toBe(website["@id"]);
    expect(website.name).toBe("Bruno Cordeiro");
  });
  it("localiza inLanguage e a URL da página", () => {
    const pagePt = graphFor("pt").find((n) => n["@type"] === "ProfilePage")!;
    const pageEn = graphFor("en").find((n) => n["@type"] === "ProfilePage")!;
    expect(pagePt.inLanguage).toBe("pt-BR");
    expect(pagePt.url).toBe("https://brunocordeiro.dev/pt");
    expect(pageEn.inLanguage).toBe("en");
    expect(pageEn.url).toBe("https://brunocordeiro.dev/en");
  });
  it("mantém o Person com sameAs e credenciais", () => {
    const person = graphFor("pt").find((n) => n["@type"] === "Person")!;
    expect(person.sameAs).toContain("https://github.com/bcordeirodev");
    expect(person.sameAs).toContain("https://www.scrum.org/user/1506558");
  });
});
