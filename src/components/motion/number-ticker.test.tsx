import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { NumberTicker } from "./number-ticker";

it("SSR mostra o valor final imediatamente", () => {
  render(<NumberTicker value={902} suffix="" />);
  expect(screen.getByText("902")).toBeInTheDocument();
});
