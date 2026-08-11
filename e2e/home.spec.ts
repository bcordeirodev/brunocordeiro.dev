import { expect, test } from "@playwright/test";

test("home pt renderiza seções e troca de tab", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/full-stack/i);
  await page.getByRole("tab", { name: /backend/i }).click();
  await expect(page.getByText("Laravel 12").first()).toBeVisible();
});

test("switcher troca para /en", async ({ page }) => {
  await page.goto("/pt");
  await page.getByRole("link", { name: /^en$/i }).click();
  await expect(page).toHaveURL(/\/en/);
});

test("raiz redireciona para /pt", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/pt$/);
});
