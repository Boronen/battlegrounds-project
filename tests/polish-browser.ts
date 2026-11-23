import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.BROWSER_EXECUTABLE ||
    (process.platform === "win32"
      ? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
      : undefined),
});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(
      (process.env.PLATFORM_TEST_URL || "http://127.0.0.1:5173") +
        "/#/gyakorlas",
    );
    await page.getByRole("button", { name: "Mérkőzés indítása" }).click();
    await page
      .getByRole("button")
      .filter({ hasText: "Őt választom" })
      .first()
      .click();
    await page.locator(".shop .tribe-surface").first().waitFor();
    const images = page.locator("img.tribe-surface, img.game-icon");
    assert.ok(await images.count());
    await images.evaluateAll(async (nodes) =>
      Promise.all(nodes.map((node) => (node as HTMLImageElement).decode())),
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const cue = await page.request.get(new URL("/art/impact.gif", page.url()).href);
    assert.equal((await cue.body()).subarray(0, 3).toString(), "GIF");
    await page.close();
  }
  console.log("Desktop and mobile game artwork loaded.");
} finally {
  await browser.close();
}
