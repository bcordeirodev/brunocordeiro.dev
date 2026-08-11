import { expect, test } from "@playwright/test";

test("home pt renderiza seções e troca de tab", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/full-stack/i);
  await page.getByRole("tab", { name: /backend/i }).click();
  // Scoped to the active tabpanel: with all 9 skill categories now kept
  // mounted in the DOM for SEO (see skill-matrix.tsx), "Laravel 12" also
  // appears in the (hidden) Languages panel's PHP proof text, so an
  // unscoped getByText().first() could match the wrong, hidden element.
  // getByRole("tabpanel") only resolves the visible panel because inactive
  // panels carry the `hidden` attribute, which removes them (and their
  // text) from the accessibility tree Playwright queries.
  await expect(page.getByRole("tabpanel").getByText("Laravel 12").first()).toBeVisible();
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
