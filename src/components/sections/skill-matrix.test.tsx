import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkillMatrix } from "./skill-matrix";

const categories = [
  {
    id: "frontend" as const,
    title: "Frontend",
    skills: [{ name: "React 19", proof: "Base de todo o frontend", tags: ["Link Charts"] }],
  },
  {
    id: "backend" as const,
    title: "Backend & Dados",
    skills: [
      {
        name: "Laravel 12",
        proof: "PHP 8.2, em produção desde 2025",
        tags: ["Link Charts", "G4F"],
      },
    ],
  },
];

describe("SkillMatrix", () => {
  it("troca de categoria ao clicar na tab", async () => {
    render(<SkillMatrix categories={categories} />);
    expect(screen.getByText("React 19")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Backend & Dados" }));
    expect(await screen.findByText("Laravel 12")).toBeInTheDocument();
  });

  it("mostra a origem (tags) de toda skill", () => {
    // `within(container)`: o setup do repo não registra o auto-cleanup da
    // Testing Library, então o DOM do teste anterior ainda existe no body.
    const { container } = render(<SkillMatrix categories={categories} />);
    // keepMounted deixa os dois painéis no DOM, então as duas origens existem
    expect(within(container).getByText("Link Charts")).toBeInTheDocument();
    expect(within(container).getByText("Link Charts · G4F")).toBeInTheDocument();
  });
});
