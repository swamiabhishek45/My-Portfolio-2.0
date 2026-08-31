import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 900, height: 1400 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

await page.goto("http://localhost:3000/books", { waitUntil: "networkidle" });

await page.locator("#show-website-btn").click({ timeout: 30000 });
await page.waitForTimeout(1200);

const shelf = page.locator("#book-shelf");
await shelf.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await shelf.screenshot({ path: "shots/closed.png" });

const books = page.locator(".book-card button");
for (const [name, index] of [
  ["open-naval", 1],
  ["open-red", 3],
]) {
  await books.nth(index).hover({ timeout: 8000 });
  await page.waitForTimeout(1400);
  await shelf.screenshot({ path: `shots/${name}.png` });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(900);
}

await browser.close();
console.log("done");
