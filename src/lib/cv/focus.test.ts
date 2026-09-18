import { describe, expect, it } from "vitest";
import { matchesFocus, parseFocus, sortByFocus } from "./focus";

describe("parseFocus", () => {
  it("separa por vírgula, apara espaços e ignora vazios e repetidos", () => {
    expect(parseFocus(" Laravel, Angular ,, php, laravel ")).toEqual(["Laravel", "Angular", "php"]);
    expect(parseFocus("")).toEqual([]);
    expect(parseFocus(" , ")).toEqual([]);
  });
});

describe("matchesFocus", () => {
  it("bate por substring sem distinguir caixa", () => {
    expect(matchesFocus("Laravel 12", ["laravel"])).toBe(true);
    expect(matchesFocus("Angular Material + Fuse", ["Angular"])).toBe(true);
    expect(matchesFocus("React 19", ["Angular", "Laravel"])).toBe(false);
    expect(matchesFocus("React 19", [])).toBe(false);
  });
});

describe("sortByFocus", () => {
  it("traz os matches para a frente mantendo a ordem relativa", () => {
    const items = ["Next.js 15", "React 19", "Angular 22", "TypeScript", "Angular Material"];
    expect(sortByFocus(items, (s) => s, ["angular"])).toEqual([
      "Angular 22",
      "Angular Material",
      "Next.js 15",
      "React 19",
      "TypeScript",
    ]);
  });

  it("sem foco devolve a lista intacta", () => {
    const items = ["b", "a"];
    expect(sortByFocus(items, (s) => s, [])).toBe(items);
  });
});
