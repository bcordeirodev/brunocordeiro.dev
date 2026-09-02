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
    expect(screen.getByText(content.profile.headline)).toBeInTheDocument();
    expect(screen.queryByText(/s[eê]nior/i)).not.toBeInTheDocument();
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
