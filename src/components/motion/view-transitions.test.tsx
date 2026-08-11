import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ViewTransitionsProvider, useSetFinishViewTransition } from "./view-transitions";

function Consumer({ onFinish }: { onFinish: () => void }) {
  const setFinishViewTransition = useSetFinishViewTransition();
  // Real call sites always pass an updater (`() => resolve`), never the
  // function directly — passing it bare would make React treat it as a
  // `useState` updater and invoke it immediately with the previous state.
  return <button onClick={() => setFinishViewTransition(() => onFinish)}>trigger</button>;
}

describe("useSetFinishViewTransition", () => {
  it("lança erro quando usado fora de um ViewTransitionsProvider", () => {
    function Broken() {
      useSetFinishViewTransition();
      return null;
    }
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Broken />)).toThrow(
      "useSetFinishViewTransition must be used within a ViewTransitionsProvider",
    );
    consoleError.mockRestore();
  });
});

describe("ViewTransitionsProvider", () => {
  it("invoca a função de finish assim que ela é registrada, então a limpa", () => {
    const finish = vi.fn();
    render(
      <ViewTransitionsProvider>
        <Consumer onFinish={finish} />
      </ViewTransitionsProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "trigger" }));

    expect(finish).toHaveBeenCalledTimes(1);
  });
});
