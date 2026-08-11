import { describe, expect, it } from "vitest";
import { formatPeriod } from "./dates";

describe("formatPeriod", () => {
  it("formata período fechado em pt", () => {
    expect(formatPeriod("2016-01", "2017-11", "pt", "atual")).toBe("jan 2016 – nov 2017");
  });
  it("usa currentLabel quando end é null", () => {
    expect(formatPeriod("2022-03", null, "en", "present")).toBe("Mar 2022 – present");
  });
});
