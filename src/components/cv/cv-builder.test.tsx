import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { pdf } from "@react-pdf/renderer";
import { getContent } from "@/content";
import { testLabels } from "./test-labels";
import { CvBuilder } from "./cv-builder";

// interceptados também pelo import() dinâmico do handler de download
vi.mock("@react-pdf/renderer", () => ({
  pdf: vi.fn(() => ({ toBlob: async () => new Blob(["pdf"]) })),
}));
vi.mock("./cv-document", () => ({ CvDocument: () => null }));

const content = getContent("pt");

describe("CvBuilder", () => {
  it("desmarcar seção no painel remove a seção do preview", async () => {
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    expect(screen.getByRole("heading", { name: "Certificações" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Certificações" }));
    expect(screen.queryByRole("heading", { name: "Certificações" })).not.toBeInTheDocument();
  });

  it("baixa o PDF via object URL", async () => {
    const createObjectURL = vi.fn(() => "blob:cv");
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    await userEvent.click(screen.getByRole("button", { name: "Baixar PDF" }));
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:cv");
  });

  it("mostra erro traduzido quando a geração falha", async () => {
    vi.mocked(pdf).mockImplementationOnce(() => {
      throw new Error("boom");
    });
    render(<CvBuilder content={content} locale="pt" labels={testLabels} />);
    await userEvent.click(screen.getByRole("button", { name: "Baixar PDF" }));
    expect(await screen.findByText(testLabels.downloadError)).toBeInTheDocument();
  });
});
