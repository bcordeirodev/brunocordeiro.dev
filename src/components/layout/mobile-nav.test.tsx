import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNav, type NavItem } from "./mobile-nav";

// Os dois links dependem do router do Next/next-intl; aqui só interessam o
// href e o rótulo, então viram <a> simples.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, className, children }: React.ComponentProps<"a">) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/motion/transition-link", () => ({
  TransitionLink: ({ href, className, children }: React.ComponentProps<"a">) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const items: NavItem[] = [
  { href: "/#experience", label: "Experience" },
  { href: "/link-charts", label: "Link Charts", isRoute: true },
  { href: "/#contact", label: "Contact" },
];

function renderNav() {
  return render(<MobileNav items={items} label="Menu" />);
}

describe("MobileNav", () => {
  it("começa fechado: só o botão, sem os links", () => {
    renderNav();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("abre ao clicar e lista os links na ordem recebida", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getByRole("button", { name: "Menu" }));

    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    const nav = screen.getByRole("navigation");
    expect(button).toHaveAttribute("aria-controls", nav.id);
    const links = Array.from(nav.querySelectorAll("a")).map((a) => [
      a.textContent,
      a.getAttribute("href"),
    ]);
    expect(links).toEqual(items.map((item) => [item.label, item.href]));
  });

  it("fecha ao clicar num link", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(screen.getByRole("link", { name: "Contact" }));
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("fecha com Escape e devolve o foco ao botão", async () => {
    const user = userEvent.setup();
    renderNav();
    const button = screen.getByRole("button", { name: "Menu" });
    await user.click(button);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(button).toHaveFocus();
  });

  it("fecha ao clicar fora", async () => {
    const user = userEvent.setup();
    render(
      <>
        <MobileNav items={items} label="Menu" />
        <p>outside</p>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
