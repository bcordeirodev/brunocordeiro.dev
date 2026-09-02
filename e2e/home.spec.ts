import { expect, test } from "@playwright/test";

test("home en renderiza seções e troca de tab", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/bruno/i);
  await page.getByRole("tab", { name: /backend/i }).click();
  // Scoped to the active tabpanel: all 5 skill categories are kept mounted
  // in the DOM for SEO (see skill-matrix.tsx), and "Laravel 12" also appears
  // in the Backend panel's PHP proof text, so an unscoped
  // getByText().first() could match a hidden element elsewhere.
  // getByRole("tabpanel") only resolves the visible panel because inactive
  // panels carry the `hidden` attribute, which removes them (and their
  // text) from the accessibility tree Playwright queries.
  await expect(page.getByRole("tabpanel").getByText("Laravel 12").first()).toBeVisible();
});

test("switcher troca para /pt", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: /^pt$/i }).click();
  await expect(page).toHaveURL(/\/pt/);
});

test("raiz redireciona para /en", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("home en: hero vende primeiro, projetos antes da stack, nav em inglês", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByText(/open to remote international roles/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /view my code on github/i })).toHaveAttribute(
    "href",
    /github\.com/,
  );

  const nav = page.getByRole("navigation");
  // next-intl localiza o href; aceita "/en#projects" ou "/en/#projects"
  await expect(nav.getByRole("link", { name: /^projects$/i })).toHaveAttribute(
    "href",
    /\/en\/?#projects$/,
  );
  await expect(nav.getByRole("link", { name: /^experience$/i })).toHaveAttribute(
    "href",
    /\/en\/?#experience$/,
  );
  await expect(nav.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
    "href",
    /\/en\/?#contact$/,
  );

  // Ordem no DOM: projetos (#projects) vem antes da stack (#stack).
  const projectsTop = await page
    .locator("#projects")
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const stackTop = await page
    .locator("#stack")
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(projectsTop).toBeLessThan(stackTop);
});
