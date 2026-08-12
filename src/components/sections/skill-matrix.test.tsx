import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkillMatrix } from "./skill-matrix";

const categories = [
  {
    id: "frontend" as const,
    title: "Frontend",
    skills: [
      {
        name: "React 19",
        proof: "Base de todo o frontend",
        tags: ["Link Charts"],
        links: [{ label: "React", url: "https://react.dev" }],
      },
    ],
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

function renderMatrix() {
  return render(<SkillMatrix categories={categories} officialSiteLabel="site oficial" />);
}

describe("SkillMatrix", () => {
  it("troca de categoria ao clicar na tab", async () => {
    renderMatrix();
    // getByRole("tabpanel") resolve só o painel ativo: os inativos ficam com
    // `hidden` (keepMounted) e fora da árvore de acessibilidade. Um getByText
    // sem escopo passaria mesmo sem o clique — mesmo padrão do e2e.
    expect(
      within(screen.getByRole("tabpanel", { name: "Frontend" })).getByText("React 19"),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Backend & Dados" }));
    const panel = await screen.findByRole("tabpanel", { name: "Backend & Dados" });
    expect(within(panel).getByText("Laravel 12")).toBeInTheDocument();
  });

  it("mostra a origem (tags) de toda skill", () => {
    // `within(container)`: o setup do repo não registra o auto-cleanup da
    // Testing Library, então o DOM do teste anterior ainda existe no body.
    const { container } = renderMatrix();
    // keepMounted deixa os dois painéis no DOM, então as duas origens existem.
    // toHaveTextContent na linha da skill é robusto ao separador visual.
    const reactRow = within(container).getByText("React 19").closest("li");
    expect(reactRow).toHaveTextContent("Link Charts");
    const laravelRow = within(container).getByText("Laravel 12").closest("li");
    expect(laravelRow).toHaveTextContent(/Link Charts.*G4F/);
  });

  it("linka o site oficial da tecnologia em nova aba", () => {
    const { container } = renderMatrix();
    const link = within(container).getByRole("link", { name: "React — site oficial" });
    expect(link).toHaveAttribute("href", "https://react.dev");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("não renderiza âncora em skill sem links", () => {
    const { container } = renderMatrix();
    const laravelRow = within(container).getByText("Laravel 12").closest("li");
    expect(laravelRow?.querySelector("a")).toBeNull();
  });
});
