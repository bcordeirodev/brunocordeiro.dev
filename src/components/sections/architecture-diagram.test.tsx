import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getContent, locales } from "@/content";
import { ArchitectureDiagram } from "./architecture-diagram";

function architectureOf(locale: (typeof locales)[number]) {
  const chapter = getContent(locale).caseStudy.chapters.find(
    (c) => c.id === "architecture" && c.kind === "prose",
  );
  if (chapter?.kind !== "prose" || !chapter.architecture) {
    throw new Error(`capítulo de arquitetura ausente em ${locale}`);
  }
  return chapter.architecture;
}

describe("ArchitectureDiagram", () => {
  it("desenha os nós da rota crítica e a cauda assíncrona", () => {
    const diagram = architectureOf("pt");
    render(<ArchitectureDiagram diagram={diagram} title="Arquitetura" />);

    expect(screen.getByRole("img", { name: "Arquitetura" })).toBeInTheDocument();
    for (const label of [
      "Cloudflare",
      "nginx",
      "Next.js 15 · React 19",
      "Laravel 12 · PHP 8.2",
      "/r/{slug}",
      "PostgreSQL 15",
      "Redis 7",
      "Worker de cliques",
      "DigitalOcean · um droplet",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("expõe a região rolável ao teclado com nome acessível", () => {
    render(<ArchitectureDiagram diagram={architectureOf("pt")} title="Arquitetura" />);
    const region = screen.getByRole("region", { name: "Arquitetura" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  // O SVG tem coordenadas fixas: rótulo comprido vaza do card em vez de
  // reposicionar o layout. Cada limite abaixo é a largura útil da caixa
  // dividida pelo avanço do Geist Mono (0,6em), arredondado para baixo.
  it.each(locales)("mantém os rótulos de %s dentro do orçamento de largura", (locale) => {
    const d = architectureOf(locale);
    const within = (limit: number, ...values: string[]) => {
      for (const value of values) expect(value.length).toBeLessThanOrEqual(limit);
    };
    within(41, ...d.web.lines, ...d.api.lines); // cards de 290px, texto a 10.5
    within(48, d.edge.cdn.sub, d.edge.proxy.sub); // pills de 320px
    within(29, d.clients.browser.sub, d.clients.bots.sub); // pills de 200px
    within(34, d.data.db.sub, d.data.cache.sub, d.data.worker.sub); // pills de 236px
    within(28, d.data.db.title, d.data.cache.title, d.data.worker.title); // idem, a 13
    within(36, d.hotPath.route);
    within(44, d.hotPath.sub);
    within(16, d.hotPath.human, d.hotPath.bot); // vão do x=497 até o card do Next.js
    within(25, d.link.top, d.link.bottom); // vão do 390 ao 566, centrados no eixo
    within(28, d.host); // tarja de 176px que interrompe a moldura do servidor
    within(11, d.bands.clients, d.bands.edge, d.bands.app, d.bands.data); // gutter de 84px
    within(80, d.trace);
    within(60, d.data.writeback);
  });
});
