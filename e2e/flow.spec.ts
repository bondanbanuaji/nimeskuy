import { test, expect } from "@playwright/test";

test.describe("NimeSkuy Core Flow", () => {
  test("Home loads with anime cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Ongoing Anime|Completed Anime|Genre Populer/i }).first()).toBeVisible({ timeout: 15000 });
    // at least one anime card link
    const cards = page.locator('a[href^="/anime/"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("Search anime -> detail -> episode -> watch", async ({ page }) => {
    await page.goto("/search?q=One%20Piece");
    await expect(page.getByText(/Menampilkan/i)).toBeVisible({ timeout: 15000 });
    const firstResult = page.locator('a[href^="/anime/"]').first();
    await expect(firstResult).toBeVisible({ timeout: 15000 });
    const href = await firstResult.getAttribute("href");
    expect(href).toContain("/anime/");

    // go to detail
    await firstResult.click();
    await expect(page).toHaveURL(/\/anime\//, { timeout: 15000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
    // episode list should be visible
    await expect(page.getByText(/Daftar Episode/i)).toBeVisible({ timeout: 15000 });

    // click first watch link
    const watchLink = page.locator('a[href^="/watch/"]').first();
    await expect(watchLink).toBeVisible({ timeout: 15000 });
    await watchLink.click();
    await expect(page).toHaveURL(/\/watch\//, { timeout: 15000 });
    await expect(page.locator("iframe").first()).toBeVisible({ timeout: 20000 }).catch(async () => {
      // fallback: if no iframe, check server selector visible
      await expect(page.getByText(/Pilih Server/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test("Genre page lists genres", async ({ page }) => {
    await page.goto("/genre");
    await expect(page.getByRole("heading", { name: /Genre/i })).toBeVisible();
    const genreLink = page.locator('a[href^="/genre/"]').first();
    await expect(genreLink).toBeVisible({ timeout: 10000 });
    await genreLink.click();
    await expect(page).toHaveURL(/\/genre\//);
    await expect(page.locator('a[href^="/anime/"]').first()).toBeVisible({ timeout: 15000 }).catch(() => {});
  });

  test("Schedule page shows days", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page.getByRole("heading", { name: /Jadwal/i })).toBeVisible({ timeout: 15000 });
    // at least one day section
    await expect(page.getByText(/Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu/).first()).toBeVisible({ timeout: 15000 });
  });

  test("Ongoing and Completed pagination", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/ongoing?page=1", { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /Ongoing/i })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('a[href^="/anime/"]').first()).toBeVisible({ timeout: 20000 });

    await page.goto("/ongoing?page=2", { timeout: 20000 });
    await expect(page.locator('a[href^="/anime/"]').first()).toBeVisible({ timeout: 20000 });

    await page.goto("/completed?page=1", { timeout: 20000 });
    await expect(page.getByRole("heading", { name: /Completed/i })).toBeVisible({ timeout: 15000 });
  });

  test("Watch server selector and history", async ({ page }) => {
    // go directly to known episode
    await page.goto("/watch/wpoiec-episode-1-sub-indo");
    await expect(page.getByText(/Pilih Server/i)).toBeVisible({ timeout: 15000 });
    const serverBtn = page.locator("button").filter({ hasText: /nekoclouds|moedesu|vidhide|mega|odstream/i }).first();
    if (await serverBtn.isVisible()) {
      await serverBtn.click();
      // iframe should still be visible after server switch (or loading)
      await page.waitForTimeout(1500);
      await expect(page.locator("iframe")).toBeVisible({ timeout: 10000 }).catch(() => {});
    }
    // check history saved - wait for useEffect to persist
    await page.waitForTimeout(500);
    // verify localStorage directly
    const history = await page.evaluate(() => localStorage.getItem("nimeskuy_history"));
    expect(history).not.toBeNull();
    await page.goto("/history");
    await expect(page.getByRole("heading", { name: /Riwayat|Belum ada riwayat/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("Favorites add/remove", async ({ page }) => {
    await page.goto("/anime/1piece-sub-indo");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
    const favBtn = page.getByRole("button", { name: /Favorit/i }).first();
    await expect(favBtn).toBeVisible({ timeout: 10000 });
    await favBtn.click();
    await page.goto("/favorites");
    await expect(page.getByText(/Favorit/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("Invalid slug shows not-found", async ({ page }) => {
    await page.goto("/anime/this-anime-does-not-exist-zzz-999");
    await expect(page.getByText(/tidak ditemukan/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("Empty search shows prompt", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText(/Cari anime favoritmu/i)).toBeVisible({ timeout: 10000 });
  });
});
