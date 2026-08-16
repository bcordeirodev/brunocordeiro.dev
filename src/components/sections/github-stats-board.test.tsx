import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { CaseChapter, LinkchartsStats } from "@/domain";
import { GithubStatsBoard } from "./github-stats-board";

const chapter: Extract<CaseChapter, { kind: "github" }> = {
  kind: "github",
  id: "github",
  title: "Os repositórios em números",
  intro: "intro",
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
};

const stats: LinkchartsStats = {
  frontend: {
    name: "linkchart-frontend",
    url: "https://github.com/bcordeirodev/linkchart-frontend",
    commits: 1030,
    tags: 27,
    latestTag: "v1.19.0",
    pushedAt: "2026-08-14T19:42:16Z",
    languages: [
      { name: "TypeScript", bytes: 960 },
      { name: "CSS", bytes: 30 },
      { name: "Shell", bytes: 10 },
    ],
  },
  backend: {
    name: "linkchart-backend",
    url: "https://github.com/bcordeirodev/linkchart-backend",
    commits: 715,
    tags: 23,
    latestTag: "v2.16.0",
    pushedAt: "2026-08-14T19:42:03Z",
    languages: [{ name: "PHP", bytes: 100 }],
  },
  source: "live",
};

it("renderiza os dois repos com link, contagens formatadas no locale e última tag", () => {
  render(<GithubStatsBoard chapter={chapter} stats={stats} locale="pt" />);
  const frontendLink = screen.getByRole("link", { name: /linkchart-frontend/ });
  expect(frontendLink).toHaveAttribute(
    "href",
    "https://github.com/bcordeirodev/linkchart-frontend",
  );
  expect(screen.getByRole("link", { name: /linkchart-backend/ })).toHaveAttribute(
    "href",
    "https://github.com/bcordeirodev/linkchart-backend",
  );
  expect(screen.getByText("1.030")).toBeInTheDocument();
  expect(screen.getByText("715")).toBeInTheDocument();
  expect(screen.getByText("v1.19.0")).toBeInTheDocument();
  expect(screen.getByText("v2.16.0")).toBeInTheDocument();
  expect(screen.getByText("Next.js 15 · React 19 · TypeScript")).toBeInTheDocument();
  expect(screen.getAllByText("live")).toHaveLength(2);
  expect(screen.queryByText("snapshot")).not.toBeInTheDocument();
});

it("mostra o badge snapshot quando os dados não são live", () => {
  render(
    <GithubStatsBoard chapter={chapter} stats={{ ...stats, source: "snapshot" }} locale="pt" />,
  );
  expect(screen.getAllByText("snapshot")).toHaveLength(2);
  expect(screen.queryByText("live")).not.toBeInTheDocument();
});

it("desenha a barra de linguagens com percentual por bytes", () => {
  render(<GithubStatsBoard chapter={chapter} stats={stats} locale="pt" />);
  expect(screen.getByText("TypeScript 96%")).toBeInTheDocument();
  expect(screen.getByText("CSS 3%")).toBeInTheDocument();
  expect(screen.getByText("Shell 1%")).toBeInTheDocument();
  expect(screen.getByText("PHP 100%")).toBeInTheDocument();
  const bar = screen.getByRole("img", { name: /linguagens.*linkchart-frontend/i });
  expect(bar).toBeInTheDocument();
});

it("formata o último push como data numérica compacta no locale", () => {
  render(<GithubStatsBoard chapter={chapter} stats={stats} locale="pt" />);
  expect(screen.getAllByText("14/08/2026")).toHaveLength(2);
});

it("mostra o ícone do GitHub junto ao nome de cada repo", () => {
  render(<GithubStatsBoard chapter={chapter} stats={stats} locale="pt" />);
  expect(document.querySelectorAll('[data-icon="github"]')).toHaveLength(2);
});
