import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalBlock } from "./terminal-block";

describe("TerminalBlock", () => {
  it("renderiza título e todas as linhas em ordem", () => {
    render(<TerminalBlock title="deploy.sh" lines={["$ make deploy", "✔ done"]} />);
    expect(screen.getByText("deploy.sh")).toBeInTheDocument();
    const lines = screen.getAllByTestId("terminal-line");
    expect(lines.map((l) => l.textContent)).toEqual(["$ make deploy", "✔ done"]);
  });
});
