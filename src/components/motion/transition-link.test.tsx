import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const setFinishViewTransitionMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("./view-transitions", () => ({
  useSetFinishViewTransition: () => setFinishViewTransitionMock,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    className,
    onClick,
    children,
  }: {
    href: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

import { TransitionLink } from "./transition-link";

function stubViewTransitionSupport(supported: boolean) {
  if (supported) {
    Object.defineProperty(document, "startViewTransition", {
      value: vi.fn((callback: () => Promise<void> | void) => {
        // A real browser defers the "after" snapshot until this resolves;
        // for these unit tests we only need `callback` to actually run so
        // we can observe what TransitionLink does inside it.
        void callback();
        return {
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
          skipTransition: () => {},
        };
      }),
      configurable: true,
    });
  } else {
    Reflect.deleteProperty(document, "startViewTransition");
  }
}

function stubReducedMotion(reduced: boolean) {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: reduced }) as unknown as typeof window.matchMedia;
}

describe("TransitionLink", () => {
  beforeEach(() => {
    pushMock.mockClear();
    setFinishViewTransitionMock.mockClear();
    stubViewTransitionSupport(false);
  });

  afterEach(() => {
    cleanup();
  });

  it("renderiza o link com o href resolvido", () => {
    render(<TransitionLink href="/link-charts">Case study</TransitionLink>);
    expect(screen.getByRole("link", { name: "Case study" })).toHaveAttribute(
      "href",
      "/link-charts",
    );
  });

  it("navega via document.startViewTransition quando o browser suporta a API e sem reduced motion", () => {
    stubViewTransitionSupport(true);
    stubReducedMotion(false);

    render(<TransitionLink href="/link-charts">Case study</TransitionLink>);
    fireEvent.click(screen.getByRole("link", { name: "Case study" }));

    expect(document.startViewTransition).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/link-charts");
    expect(setFinishViewTransitionMock).toHaveBeenCalledTimes(1);
  });

  it("não intercepta a navegação quando o browser não suporta a View Transitions API", () => {
    stubViewTransitionSupport(false);
    stubReducedMotion(false);

    render(<TransitionLink href="/link-charts">Case study</TransitionLink>);
    fireEvent.click(screen.getByRole("link", { name: "Case study" }));

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("não intercepta a navegação quando o usuário prefere reduced motion", () => {
    stubViewTransitionSupport(true);
    stubReducedMotion(true);

    render(<TransitionLink href="/link-charts">Case study</TransitionLink>);
    fireEvent.click(screen.getByRole("link", { name: "Case study" }));

    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("não intercepta cliques com teclas modificadoras (ex: abrir em nova aba)", () => {
    stubViewTransitionSupport(true);
    stubReducedMotion(false);

    render(<TransitionLink href="/link-charts">Case study</TransitionLink>);
    fireEvent.click(screen.getByRole("link", { name: "Case study" }), { metaKey: true });

    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
