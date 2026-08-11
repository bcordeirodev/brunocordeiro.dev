import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CaseChapter } from "./case-chapter";

it("renderiza capítulo prose com parágrafos", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "prose",
        id: "product",
        title: "O produto",
        paragraphs: ["Encurtador com analytics."],
      }}
    />,
  );
  expect(screen.getByRole("heading", { name: "O produto" })).toBeInTheDocument();
  expect(screen.getByText("Encurtador com analytics.")).toBeInTheDocument();
});

it("renderiza capítulo stats", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "stats",
        id: "quality",
        title: "Qualidade",
        items: [{ label: "testes", value: "902" }],
      }}
    />,
  );
  expect(screen.getByText("902")).toBeInTheDocument();
});
