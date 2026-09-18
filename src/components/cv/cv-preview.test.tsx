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

  it("mostra vínculo, duração e a linha de stack de cada experiência", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    const first = content.experiences[0]!;
    expect(
      screen.getAllByText(testLabels.employmentTypes[first.employmentType], { exact: false })
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/\d+ anos?( \d+ mes(es)?)?|\d+ mes(es)?/).length).toBeGreaterThan(0);
    expect(screen.getByText(first.stacks.join(" · "), { exact: false })).toBeInTheDocument();
    // a descrição de cada sistema entra no preview e no PDF
    expect(screen.getByText(first.projects[0]!.description, { exact: false })).toBeInTheDocument();
  });

  it("coloca o case study antes das experiências e encurta os links", () => {
    const data = buildCvData(content, defaultSelection(content), "pt");
    render(<CvPreview data={data} locale="pt" labels={testLabels} />);
    const caseTitle = screen.getByRole("heading", { name: content.caseStudy.title });
    const experiences = screen.getByRole("heading", { name: "Experiências" });
    expect(
      caseTitle.compareDocumentPosition(experiences) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText("github.com/bcordeirodev")).toBeInTheDocument();
    expect(screen.queryByText(/^https:\/\//)).not.toBeInTheDocument();
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
