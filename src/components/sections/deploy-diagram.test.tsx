import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getContent, locales } from "@/content";
import { DeployDiagram } from "./deploy-diagram";

function deployOf(locale: (typeof locales)[number]) {
  const chapter = getContent(locale).caseStudy.chapters.find(
    (c) => c.id === "pipeline" && c.kind === "terminal",
  );
  if (chapter?.kind !== "terminal" || !chapter.deploy) {
    throw new Error(`capítulo de deploy ausente em ${locale}`);
  }
  return chapter.deploy;
}

describe("DeployDiagram", () => {
  it("desenha a esteira, as duas cores e o veredito", () => {
    render(<DeployDiagram diagram={deployOf("pt")} title="Deploy blue/green" />);

    expect(screen.getByRole("img", { name: "Deploy blue/green" })).toBeInTheDocument();
    for (const label of [
      "tag",
      "build",
      "ghcr",
      "rsync",
      "nginx",
      "blue · versão anterior",
      "green · versão nova",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText(/downtime medido: 0s/)).toBeInTheDocument();
  });

  it("expõe a região rolável ao teclado com nome acessível", () => {
    render(<DeployDiagram diagram={deployOf("pt")} title="Deploy blue/green" />);
    expect(screen.getByRole("region", { name: "Deploy blue/green" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  // Mesmo contrato do architecture-diagram: coordenadas fixas, então cada
  // limite é a largura útil da caixa / 0,6em do Geist Mono.
  it.each(locales)("mantém os rótulos de %s dentro do orçamento de largura", (locale) => {
    const d = deployOf(locale);
    const within = (limit: number, ...values: string[]) => {
      for (const value of values) expect(value.length).toBeLessThanOrEqual(limit);
    };
    within(18, ...d.steps.map((s) => s.title)); // chips de 169px, a 12.5
    within(27, ...d.steps.map((s) => s.sub)); // idem, a 10
    within(24, d.proxy.title);
    within(28, d.proxy.sub); // pill de 320px
    within(40, d.blue.title, d.green.title); // cards de 340px, a 13
    within(49, ...d.blue.lines, ...d.green.lines); // idem, a 10.5
    within(45, d.blue.edge, d.green.edge); // alinhados à direita do card
    within(100, d.verdict, d.rollback); // linha inteira de 756px
    within(12, d.bands.pipeline, d.bands.cutover, d.bands.check); // gutter de 84px
  });
});
