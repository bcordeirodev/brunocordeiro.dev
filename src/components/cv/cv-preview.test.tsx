import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { buildCvData } from "@/lib/cv/build-cv-data";
import { defaultSelection } from "@/lib/cv/selection";
import { testLabels } from "./test-labels";
import { CvPreview } from "./cv-preview";

const content = getContent("pt");

describe("CvPreview", () => {
  it("mostra contatos e todas as seções com seleção default", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    expect(screen.getByRole("heading", { name: content.profile.name })).toBeInTheDocument();
    expect(screen.getByText(content.profile.email)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experiências" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certificações" })).toBeInTheDocument();
    expect(screen.getByText(content.experiences[0]!.company, { exact: false })).toBeInTheDocument();
  });

  it("usa o headline como cargo, sem marcador de senioridade", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    // `role` e `headline` são a mesma string hoje, então não dá para afirmar
    // que o cargo está ausente; o que precisa valer é: nenhum marcador de
    // senioridade em lugar nenhum do preview, resumo incluído.
    // `selector`: o mesmo cargo aparece nas experiências; aqui interessa o header.
    expect(
      screen.getByText(content.profile.headline, { selector: "header p" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/s[eê]nior/i)).not.toBeInTheDocument();
  });

  it("mostra duração, descrição e a linha de stack de cada experiência, sem selo de vínculo", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    const first = content.experiences[0]!;
    expect(screen.queryByText(/freelance|meio período|tempo integral/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/\d+ anos?( \d+ mes(es)?)?|\d+ mes(es)?/).length).toBeGreaterThan(0);
    // a linha de stack é um <p> com um <span> por tecnologia (para o destaque
    // do foco), então o match é pelo texto completo do parágrafo
    expect(
      screen.getByText(
        (_, node) =>
          node?.tagName === "P" && node.textContent === `Stack: ${first.stacks.join(" · ")}`,
      ),
    ).toBeInTheDocument();
    // a descrição de cada sistema entra no preview e no PDF
    expect(screen.getByText(first.projects[0]!.description, { exact: false })).toBeInTheDocument();
  });

  it("fecha com o case study numa seção simples depois de tudo e encurta os links", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    const caseSection = screen.getByRole("heading", { name: "Case study" });
    const education = screen.getByRole("heading", { name: "Educação" });
    expect(
      education.compareDocumentPosition(caseSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.getByText("github.com/bcordeirodev")).toBeInTheDocument();
    expect(screen.queryByText(/^https:\/\//)).not.toBeInTheDocument();
  });

  it("com foco: linha de stack principal e skills em foco na frente", () => {
    const sel = defaultSelection(content);
    sel.focus = "Laravel, Angular";
    sel.summaryOverride = "Resumo para a vaga.";
    const data = buildCvData(content, sel, "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    expect(screen.getByText("Stack principal:")).toBeInTheDocument();
    expect(screen.getByText("Resumo para a vaga.")).toBeInTheDocument();
    const frontend = content.skillCategories.find((c) => c.id === "frontend")!;
    const firstChip = screen.getByText(frontend.title).parentElement!.querySelector("span")!;
    expect(firstChip.textContent).toMatch(/angular/i);
  });

  it("omite seção nula mas mantém contatos", () => {
    const sel = defaultSelection(content);
    sel.sections.experiences = false;
    const data = buildCvData(content, sel, "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    expect(screen.queryByRole("heading", { name: "Experiências" })).not.toBeInTheDocument();
    expect(screen.getByText(content.profile.email)).toBeInTheDocument();
  });
});
