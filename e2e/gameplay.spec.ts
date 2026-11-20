import { expect, test, type Page } from "@playwright/test";

/** Replaces Math.random with a seeded generator so dice rolls are reproducible. */
async function seedDice(page: Page, seed: number) {
  await page.addInitScript((initial) => {
    let a = initial;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }, seed);
}

/** Forces every dice roll (0.1 gives 4, 0.9 gives 0); other Math.random callers, such as Next.js itself, are untouched. */
async function fixDice(page: Page, value: number) {
  await page.addInitScript((v) => {
    const original = Math.random;
    Math.random = () => (new Error().stack?.includes("rollDice") ? v : original());
  }, value);
}

const rollButton = (page: Page) => page.getByRole("button", { name: "Roll dice" });
const movable = (page: Page) => page.getByRole("button", { name: /Move \d squares|Enter a piece/ });

test("Human vs Human: rolling then moving hands the turn to the other player", async ({ page }) => {
  await fixDice(page, 0.1); // always rolls 4: first piece lands on a rosette
  await page.goto("/play?mode=human");
  await rollButton(page).click();
  await expect(page.getByTestId("roll-result")).toHaveText("Roll: 4");
  await expect(movable(page).first()).toBeVisible();
  await page.getByRole("button", { name: "Enter a piece" }).click();
  // Square 4 is a rosette, so the same player rolls again.
  await expect(page.getByTestId("game-status")).toContainText("rosette");
  await expect(page.getByTestId("current-player")).toContainText("Player one");
  await expect(page.getByTestId("stock-one")).toContainText(/Waiting\s*6/);
});

test("each player sees seven stones and can select a reserve stone", async ({ page }) => {
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  await expect(page.getByTestId("stock-one").getByRole("img", { name: "Stone in reserve" })).toHaveCount(7);
  await expect(page.getByTestId("stock-two").getByRole("img", { name: "Stone in reserve" })).toHaveCount(7);
  await rollButton(page).click();
  await expect(page.getByTestId("stock-one").getByRole("button", { name: "Enter a piece" })).toBeVisible();
  await expect(page.getByTestId("stock-one").getByRole("img", { name: /cannot enter/ })).toHaveCount(6);
  await page.getByTestId("stock-one").getByRole("button", { name: "Enter a piece" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("stock-one")).toContainText(/On board\s*1/);
});

test("illegal actions are prevented", async ({ page }) => {
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  // Before rolling there is nothing to move.
  await expect(movable(page)).toHaveCount(0);
  await rollButton(page).click();
  // After rolling the player must move: rolling again is disabled.
  await expect(rollButton(page)).toBeDisabled();
  // Only the player's own pieces are offered, and the opponent has none.
  await expect(page.getByRole("button", { name: /Player two piece/ })).toHaveCount(0);
  await expect(page.getByTestId("stock-two").getByRole("button")).toHaveCount(0);
});

test("a roll of zero passes the turn", async ({ page }) => {
  await fixDice(page, 0.9);
  await page.goto("/play?mode=human");
  await rollButton(page).click();
  await expect(page.getByTestId("game-status")).toContainText("rolled 0");
  await expect(page.getByTestId("current-player")).toContainText("Player two");
  await expect(movable(page)).toHaveCount(0);
});

test("Human vs Computer: the computer takes its turn and the human cannot roll meanwhile", async ({ page }) => {
  await fixDice(page, 0.9); // every roll is 0: turns pass back and forth
  await page.goto("/play?mode=computer");
  await rollButton(page).click();
  await expect(page.getByTestId("current-player")).toContainText("(computer)");
  await expect(rollButton(page)).toBeDisabled();
  await expect(page.getByTestId("game-status")).toContainText("Player two rolled 0", { timeout: 5000 });
  await expect(page.getByTestId("current-player")).toContainText("Player one's turn", { timeout: 5000 });
  await expect(rollButton(page)).toBeEnabled();
});

test("a full game ends with a winner and can be restarted", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" }); // skip the dice tumble so hundreds of rolls stay fast
  await seedDice(page, 12345);
  await page.goto("/play?mode=human");
  const turn = page.getByTestId("current-player");
  for (let step = 0; step < 1500; step++) {
    if (/wins/i.test(await turn.innerText())) break;
    if (await rollButton(page).isEnabled()) {
      await rollButton(page).click();
    } else {
      await movable(page).first().click();
    }
  }
  await expect(turn).toContainText(/Player (one|two) wins/);
  await expect(rollButton(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByTestId("game-status")).toContainText("New game started");
  await expect(page.getByTestId("current-player")).toContainText("Player one's turn");
  await expect(page.getByTestId("stock-one")).toContainText(/Finished\s*0/);
  await expect(rollButton(page)).toBeEnabled();
});

test("dice tray is visible before rolling and shows no stale roll", async ({ page }) => {
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  await expect(page.getByTestId("dice-tray")).toBeInViewport();
  await expect(page.getByTestId("roll-result")).toHaveCount(0);
  await rollButton(page).click();
  await expect(page.getByTestId("roll-result")).toHaveText("Roll: 4");
  await page.getByRole("button", { name: "Enter a piece" }).click();
  // The roll is consumed by the move, so the tray must not keep showing it.
  await expect(page.getByTestId("roll-result")).toHaveCount(0);
});

test("reduced motion reveals the roll result immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  await rollButton(page).click();
  await expect(page.getByTestId("roll-result")).toHaveText("Roll: 4", { timeout: 300 });
  await expect(page.getByTestId("dice-tray")).not.toHaveAttribute("data-rolling", "true");
});

test("laptop viewport shows board, panels, dice and roll action together without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 700 });
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  for (const id of ["current-player", "game-status", "stock-one", "stock-two", "dice-tray"]) {
    await expect(page.getByTestId(id)).toBeInViewport({ ratio: 1 });
  }
  await expect(page.getByRole("group", { name: /Board/ })).toBeInViewport({ ratio: 1 });
  await expect(rollButton(page)).toBeInViewport({ ratio: 1 });
  await rollButton(page).click();
  await expect(page.getByTestId("roll-result")).toHaveText("Roll: 4");
  await expect(page.getByTestId("stock-one")).toContainText("Choose a stone to enter");
  await expect(page.getByRole("button", { name: "Enter a piece" })).toBeInViewport({ ratio: 1 });
});

test("phone viewport keeps the board, dice and roll button on the first screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fixDice(page, 0.1);
  await page.goto("/play?mode=human");
  await expect(page.getByRole("group", { name: /Board/ })).toBeInViewport({ ratio: 1 });
  await expect(rollButton(page)).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
