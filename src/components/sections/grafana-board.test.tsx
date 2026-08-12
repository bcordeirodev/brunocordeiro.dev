import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { CaseChapter, GrafanaStats } from "@/domain";
import { GrafanaBoard } from "./grafana-board";

const chapter: Extract<CaseChapter, { kind: "grafana" }> = {
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
    footer: "rodapé do board",
  },
  panels: {
    uptime: { title: "uptime 30d", sub: "probe externo", source: "GitHub Actions" },
    p95: { title: "p95 · redirect", sub: "rota crítica" },
    errors: { title: "erros 5xx", sub: "percentual" },
    reqRate: { title: "requisições/min", sub: "média 24h" },
    activity: { title: "commits por mês", sub: "git real", source: "git log" },
  },
};

const stats: GrafanaStats = {
  fetchedAt: "2026-08-12T10:00:00Z",
  uptime30dPct: 99.0,
  p95RedirectMs: 180,
  errorRate5xxPct: 0.4,
  reqPerMin: 12,
  live: { uptime30dPct: false, p95RedirectMs: true, errorRate5xxPct: true, reqPerMin: true },
};

it("renderiza chrome do board, painéis e valores formatados", () => {
  render(<GrafanaBoard chapter={chapter} stats={stats} locale="pt" />);
  expect(screen.getByText("linkcharts · produção")).toBeInTheDocument();
  expect(screen.getByText("Últimos 30 dias")).toBeInTheDocument();
  expect(screen.getByText("dados via Grafana Cloud · Prometheus")).toBeInTheDocument();
  expect(screen.getByText("rodapé do board")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /uptime/ })).toBeInTheDocument();
  expect(screen.getByText("GitHub Actions")).toBeInTheDocument();
  // uptime nunca é live (fonte é o GitHub Actions), e mesmo assim o painel
  // não ganha o badge "snapshot" — a origem dele é o badge próprio acima.
  expect(screen.queryByText("snapshot")).not.toBeInTheDocument();
  expect(screen.getAllByText("live · Prometheus")).toHaveLength(3);
  expect(screen.getByText("git log")).toBeInTheDocument();
  expect(screen.getByText("180 ms")).toBeInTheDocument();
  expect(screen.getByText("0,4%")).toBeInTheDocument();
  expect(document.querySelector('svg[fill="#f46800"]')).toBeInTheDocument();
});

it("colore o p95 por threshold (vermelho acima de 800 ms)", () => {
  render(<GrafanaBoard chapter={chapter} stats={{ ...stats, p95RedirectMs: 950 }} locale="pt" />);
  expect(screen.getByText("950 ms")).toHaveStyle({ color: "#f2495c" });
});

it("marca painéis vindos de snapshot", () => {
  render(
    <GrafanaBoard
      chapter={chapter}
      stats={{
        ...stats,
        live: {
          uptime30dPct: false,
          p95RedirectMs: false,
          errorRate5xxPct: false,
          reqPerMin: true,
        },
      }}
      locale="pt"
    />,
  );
  // só p95 e erros ganham "snapshot" — uptime tem badge de fonte própria
  expect(screen.getAllByText("snapshot")).toHaveLength(2);
  expect(screen.getAllByText("live · Prometheus")).toHaveLength(1);
});
