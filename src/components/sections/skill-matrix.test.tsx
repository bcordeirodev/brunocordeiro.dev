import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkillMatrix } from "./skill-matrix";

const categories = [
  {
    id: "languages" as const,
    title: "Linguagens",
    skills: [
      {
        name: "TypeScript",
        evidence: "production" as const,
        proof: "Link Charts",
        highlight: true,
      },
    ],
  },
  {
    id: "backend" as const,
    title: "Backend",
    skills: [
      {
        name: "Laravel 12",
        evidence: "production" as const,
        proof: "Link Charts",
        highlight: false,
      },
    ],
  },
];
const labels = {
  production: "em produção",
  professional: "profissional",
  project: "projeto",
  certified: "certificado",
  academic: "acadêmico",
  declared: "declarado",
};

describe("SkillMatrix", () => {
  it("troca de categoria ao clicar na tab", async () => {
    render(<SkillMatrix categories={categories} labels={labels} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Backend" }));
    expect(await screen.findByText("Laravel 12")).toBeInTheDocument();
  });
});
