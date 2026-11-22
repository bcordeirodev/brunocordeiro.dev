import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { getContent } from "@/content";
import { Hero } from "./hero";

// TransitionLink depende do router do Next e do provider de view transitions;
// aqui só interessa o href, então o link vira um <a> simples.
vi.mock("@/components/motion/transition-link", () => ({
  TransitionLink: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const { profile } = getContent("en");

function renderHero() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <Hero profile={profile} />
    </NextIntlClientProvider>,
  );
}

describe("Hero", () => {
  it("mostra cargo, pitch e a linha de disponibilidade do perfil", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    expect(screen.getByText(profile.pitch)).toBeInTheDocument();
    expect(screen.getByText(profile.availability)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`^${profile.role} · `))).toBeInTheDocument();
  });

  it("deriva os chips de stack de stackHighlights, na ordem do conteúdo", () => {
    renderHero();
    const list = screen.getByRole("list", { name: /core stack/i });
    const chips = Array.from(list.querySelectorAll("li")).map((li) => li.textContent);
    expect(chips).toEqual(profile.stackHighlights);
  });

  it("não mostra a linha de métricas (testes, downtime, releases)", () => {
    renderHero();
    expect(screen.queryByText(/tests gating ci|deploy downtime|releases since/i)).toBeNull();
  });

  it("tem um link para o GitHub com o rótulo de código e alvo externo", () => {
    renderHero();
    const link = screen.getByRole("link", { name: /view my code on github/i });
    expect(link).toHaveAttribute("href", profile.github);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("faz do LinkedIn a ação principal: é o primeiro link e o único botão cheio", () => {
    renderHero();
    const links = screen.getAllByRole("link");
    const linkedin = screen.getByRole("link", { name: /contact me on linkedin/i });
    expect(links[0]).toBe(linkedin);
    expect(linkedin).toHaveAttribute("href", profile.linkedin);
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", expect.stringContaining("noopener"));
    const filled = links.filter((link) => link.className.split(" ").includes("bg-primary"));
    expect(filled).toEqual([linkedin]);
  });

  it("mostra o e-mail escrito, como link mailto, com o botão de copiar ao lado", () => {
    renderHero();
    const mail = screen.getByRole("link", { name: new RegExp(profile.email, "i") });
    expect(mail).toHaveAttribute("href", `mailto:${profile.email}`);
    expect(mail).toHaveTextContent(profile.email);
    expect(screen.getByRole("button", { name: /copy email/i })).toBeInTheDocument();
  });

  it("mantém o CV como link secundário para /cv", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute("href", "/cv");
  });
});
