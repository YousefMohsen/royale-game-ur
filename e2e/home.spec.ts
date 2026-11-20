import { expect, test } from "@playwright/test";

test("home page shows the app name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

for (const mode of ["Human vs Computer", "Human vs Human"]) {
  test(`${mode} starts a game in one click`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: new RegExp(mode) }).click();
    await expect(page.getByRole("heading", { level: 1, name: mode })).toBeVisible();
    await expect(page.getByTestId("game-status")).toContainText("New game started");
  });
}

test("keyboard reaches all actions with a visible focus", async ({ page }) => {
  await page.goto("/");
  for (const name of [/Human vs Computer/, /Human vs Human/, /How to play/]) {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAccessibleName(name);
    await expect(focused).toHaveCSS("outline-style", "solid");
  }
});

test("rules page is reachable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "How to play" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "How to play" })).toBeVisible();
});

test("board shows a roll result and can be restarted", async ({ page }) => {
  await page.goto("/play?mode=human");
  await expect(page.getByTestId("current-player")).toContainText("Player one");
  await page.getByRole("button", { name: "Roll dice" }).click();
  await expect(page.getByTestId("game-status")).toContainText("rolled");
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(page.getByTestId("game-status")).toContainText("New game started");
});
