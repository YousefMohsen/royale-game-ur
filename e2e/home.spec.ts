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

test("rules page has a logical heading structure", async ({ page }) => {
  await page.goto("/rules");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const name of ["Objective", "Rolling", "Moving", "Captures", "Rosettes and safe squares", "Passing", "Winning"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
});

test("rules open in a new tab and keep the game unchanged", async ({ page, context }) => {
  await page.goto("/play?mode=human");
  await page.getByRole("button", { name: "Roll dice" }).click();
  const status = await page.getByTestId("game-status").innerText();
  const [rules] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: /How to play/ }).click(),
  ]);
  await expect(rules.getByRole("heading", { level: 1, name: "How to play" })).toBeVisible();
  await rules.close();
  await expect(page.getByTestId("game-status")).toHaveText(status);
});

test("game fits a narrow screen without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.getByRole("link", { name: /Human vs Human/ }).click();
  await expect(page.getByTestId("game-status")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
