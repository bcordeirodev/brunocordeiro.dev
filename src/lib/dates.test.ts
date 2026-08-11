import { describe, expect, it } from "vitest";
import { formatDuration, formatPeriod } from "./dates";

describe("formatPeriod", () => {
  it("formata período fechado em pt", () => {
    expect(formatPeriod("2016-01", "2017-11", "pt", "atual")).toBe("jan 2016 – nov 2017");
  });
  it("usa currentLabel quando end é null", () => {
    expect(formatPeriod("2022-03", null, "en", "present")).toBe("Mar 2022 – present");
  });
});

describe("formatDuration", () => {
  it("conta meses de forma inclusiva como o LinkedIn", () => {
    expect(formatDuration("2022-03", null, "pt", "2026-08")).toBe("4 anos 6 meses");
  });
  it("formata períodos fechados em pt", () => {
    expect(formatDuration("2021-09", "2022-06", "pt")).toBe("10 meses");
    expect(formatDuration("2016-01", "2017-11", "pt")).toBe("1 ano 11 meses");
  });
  it("usa singular e abreviações do en", () => {
    expect(formatDuration("2024-01", "2024-12", "en")).toBe("1 yr");
    expect(formatDuration("2024-01", "2024-01", "en")).toBe("1 mo");
  });
});
