import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonJsonLd } from "./person-json-ld";
import { getContent } from "@/content";

describe("PersonJsonLd", () => {
  it("emite JSON-LD válido com sameAs", () => {
    const { container } = render(<PersonJsonLd profile={getContent("pt").profile} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent ?? "{}");
    expect(data["@type"]).toBe("Person");
    expect(data.sameAs).toContain("https://github.com/bcordeirodev");
    expect(data.sameAs).toContain("https://www.scrum.org/user/1506558");
  });
});
