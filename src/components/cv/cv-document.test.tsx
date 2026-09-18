// @vitest-environment node
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";
import { getContent, type Locale } from "@/content";
import { buildCvData } from "@/lib/cv/build-cv-data";
import { registerCvFonts } from "@/lib/cv/fonts";
import { defaultSelection } from "@/lib/cv/selection";
import { testLabels } from "./test-labels";

// Fora do browser a fonte precisa vir do disco, e o react-pdf fica com a
// primeira fonte registrada por peso — por isso o registro precede o import.
registerCvFonts(path.resolve(process.cwd(), "public/fonts/cv"));
const { CvDocument } = await import("./cv-document");

const countPages = (pdf: Buffer) => pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g)?.length;

async function render(locale: Locale) {
  const content = getContent(locale);
  const data = buildCvData(content, defaultSelection(content), locale);
  return renderToBuffer(<CvDocument data={data} locale={locale} labels={testLabels} />);
}

describe("CvDocument", () => {
  it("cabe em duas páginas com tudo selecionado, nos dois locales", async () => {
    for (const locale of ["en", "pt"] as const) {
      const pdf = await render(locale);
      expect(countPages(pdf), locale).toBeLessThanOrEqual(2);
    }
  }, 30_000);

  it("embute a Geist em vez de cair na Helvetica padrão", async () => {
    const pdf = (await render("pt")).toString("latin1");
    expect(pdf).toMatch(/\/BaseFont\s*\/[A-Z]{6}\+Geist/);
    expect(pdf).not.toMatch(/\/BaseFont\s*\/Helvetica/);
  }, 30_000);
});
