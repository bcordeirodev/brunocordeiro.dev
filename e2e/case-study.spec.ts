import { expect, test } from "@playwright/test";

test("navega do card do case study até /en/link-charts e verifica capítulo pipeline", async ({
  page,
}) => {
  await page.goto("/en");
  await page.getByRole("link", { name: /read the full case study/i }).click();
  await expect(page).toHaveURL(/\/en\/link-charts$/);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Link Charts");

  const pipelineChapter = page.locator("#pipeline");
  await expect(pipelineChapter).toBeVisible();
  await expect(
    pipelineChapter.getByRole("heading", { name: /blue\/green deploy by tag/i }),
  ).toBeVisible();

  const externalLink = page.getByRole("link", { name: /linkcharts\.com\.br/i });
  await expect(externalLink).toHaveAttribute("href", "https://linkcharts.com.br");
  await expect(externalLink).toHaveAttribute("target", "_blank");
});
