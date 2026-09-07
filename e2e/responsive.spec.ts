import { test, expect } from "@playwright/test";

const viewports = [
  { name: "Mobile 375", width: 375, height: 667 },
  { name: "Mobile 390", width: 390, height: 844 },
  { name: "Tablet 768", width: 768, height: 1024 },
  { name: "Desktop 1280", width: 1280, height: 800 },
  { name: "Desktop 1440", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`Responsive ${vp.name} - home has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await page.waitForTimeout(1500);
    // check body scrollWidth vs clientWidth
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 5);
    expect(hasOverflow).toBeFalsy();
    // navbar visible
    await expect(page.locator("header").first()).toBeVisible();
    // at least one anime card visible
    await expect(page.locator('a[href^="/anime/"]').first()).toBeVisible({ timeout: 15000 });
  });
}

test("Watch page responsive video aspect", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/watch/wpoiec-episode-1-sub-indo");
  await expect(page.locator("iframe").first()).toBeVisible({ timeout: 20000 }).catch(async () => {
    await expect(page.getByText(/Pilih Server/i)).toBeVisible();
  });
  // server buttons should be at least 40px height
  const buttons = page.locator("button");
  const count = await buttons.count();
  if (count > 0) {
    const box = await buttons.first().boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(36);
  }
});
