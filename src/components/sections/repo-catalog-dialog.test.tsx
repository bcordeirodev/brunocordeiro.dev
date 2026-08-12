import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { RepoCatalogDialog, type RepoCatalogItem } from "./repo-catalog-dialog";

const items: RepoCatalogItem[] = [
  {
    name: "medFlow",
    description: "Medical practice management platform.",
    url: "https://github.com/bcordeirodev/medFlow",
    language: "TypeScript",
    stars: 0,
    updatedLabel: "atualizado em ago/2025",
  },
  {
    name: "acerbrag",
    description: null,
    url: "https://github.com/bcordeirodev/acerbrag",
    language: "PHP",
    stars: 0,
    updatedLabel: "atualizado em ago/2026",
  },
];

function setup() {
  render(
    <RepoCatalogDialog
      items={items}
      triggerLabel="ver todos os 2 projetos"
      titleLabel="todos os projetos"
      closeLabel="fechar"
    />,
  );
  return document.querySelector("dialog") as HTMLDialogElement;
}

it("abre o modal com a lista completa e links ao clicar no gatilho", async () => {
  const dialog = setup();
  expect(dialog.open).toBe(false);
  await userEvent.click(screen.getByRole("button", { name: /ver todos os 2 projetos/i }));
  expect(dialog.open).toBe(true);
  expect(screen.getByText("medFlow")).toBeInTheDocument();
  expect(screen.getByText("Medical practice management platform.")).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /acerbrag/i });
  expect(link).toHaveAttribute("href", "https://github.com/bcordeirodev/acerbrag");
});

it("fecha o modal pelo botão de fechar", async () => {
  const dialog = setup();
  await userEvent.click(screen.getByRole("button", { name: /ver todos os 2 projetos/i }));
  expect(dialog.open).toBe(true);
  await userEvent.click(screen.getByRole("button", { name: /fechar/i }));
  expect(dialog.open).toBe(false);
});
