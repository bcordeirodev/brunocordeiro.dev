import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { CopyEmailButton } from "./copy-email-button";

it("copia o e-mail ao clicar", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(
    <CopyEmailButton
      email="bcordeiro.dev@gmail.com"
      copyLabel="copiar e-mail"
      copiedLabel="copiado!"
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: /copiar e-mail/i }));
  expect(writeText).toHaveBeenCalledWith("bcordeiro.dev@gmail.com");
  expect(await screen.findByText(/copiado!/i)).toBeInTheDocument();
});
