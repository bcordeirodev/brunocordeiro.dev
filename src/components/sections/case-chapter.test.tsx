import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CaseChapter } from "./case-chapter";

it("renderiza capítulo prose com parágrafos", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "prose",
        id: "product",
        title: "O produto",
        paragraphs: ["Encurtador com analytics."],
      }}
    />,
  );
  expect(screen.getByRole("heading", { name: "O produto" })).toBeInTheDocument();
  expect(screen.getByText("Encurtador com analytics.")).toBeInTheDocument();
});

it("renderiza capítulo stats", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "stats",
        id: "quality",
        title: "Qualidade",
        items: [{ label: "testes", value: "902" }],
      }}
    />,
  );
  expect(screen.getByText("902")).toBeInTheDocument();
});

it("renderiza capítulo grafana com o board (snapshot por default)", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "grafana",
        id: "operations",
        title: "Operação em números",
        intro: "intro",
        board: {
          title: "linkcharts · produção",
          timeRange: "Últimos 30 dias",
          attribution: "dados via Grafana Cloud · Prometheus",
          snapshotLabel: "snapshot",
          liveLabel: "live · Prometheus",
          updatedLabel: "atualizado",
          footer: "rodapé",
        },
        panels: {
          uptime: { title: "uptime 30d", sub: "probe", source: "GitHub Actions" },
          p95: { title: "p95 · redirect", sub: "rota" },
          errors: { title: "erros 5xx", sub: "pct" },
          reqRate: { title: "requisições/min", sub: "média" },
          activity: { title: "commits por mês", sub: "git", source: "git" },
        },
      }}
    />,
  );
  expect(screen.getByRole("heading", { name: "Operação em números" })).toBeInTheDocument();
  expect(screen.getByText("linkcharts · produção")).toBeInTheDocument();
  // sem stats injetados, tudo vem do snapshot; uptime sempre mostra o
  // próprio source (nunca vem do Prometheus) → 3 badges "snapshot"
  // (p95, erros 5xx, req/min).
  expect(screen.getAllByText("snapshot")).toHaveLength(3);
});

it("renderiza capítulo github com o board dos repos (snapshot por default)", () => {
  render(
    <CaseChapter
      chapter={{
        kind: "github",
        id: "github",
        title: "Os repositórios em números",
        intro: "intro dos repos",
        labels: {
          commits: "commits",
          tags: "tags de release",
          latestTag: "última tag",
          lastPush: "último push",
          languages: "linguagens",
          viewRepo: "ver no GitHub",
          liveLabel: "live",
          snapshotLabel: "snapshot",
        },
        repos: {
          frontend: { sub: "Next.js 15 · React 19 · TypeScript" },
          backend: { sub: "Laravel 12 · PHP 8.2" },
        },
      }}
    />,
  );
  expect(screen.getByRole("heading", { name: "Os repositórios em números" })).toBeInTheDocument();
  expect(screen.getByText("intro dos repos")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /linkchart-frontend/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /linkchart-backend/ })).toBeInTheDocument();
  // sem stats injetados, os números vêm do snapshot versionado
  expect(screen.getAllByText("snapshot")).toHaveLength(2);
});
