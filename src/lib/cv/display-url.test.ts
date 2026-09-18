import { describe, expect, it } from "vitest";
import { displayUrl } from "./display-url";

describe("displayUrl", () => {
  it("remove esquema, www. e barra final", () => {
    expect(displayUrl("https://www.scrum.org/user/1506558")).toBe("scrum.org/user/1506558");
    expect(displayUrl("https://github.com/bcordeirodev/")).toBe("github.com/bcordeirodev");
    expect(displayUrl("http://example.com")).toBe("example.com");
  });

  it("preserva o caminho e a query", () => {
    expect(displayUrl("https://brunocordeiro.dev/en/cv?x=1")).toBe("brunocordeiro.dev/en/cv?x=1");
  });
});
