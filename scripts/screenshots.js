// scripts/screenshots.js
// Automatically captures UI screenshots from the running app with Playwright.
//
// Usage:
//   1. Start the app:        npm run dev   (or npm run build && npm run start)
//   2. In another terminal:  npm run screenshots
//
// Override the target URL or the developer used for sample pages:
//   BASE_URL=http://localhost:3000 SAMPLE_DEV=torvalds SAMPLE_REPO=linux npm run screenshots

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SAMPLE_DEV = process.env.SAMPLE_DEV || "torvalds";
const SAMPLE_REPO = process.env.SAMPLE_REPO || "linux";
const COMPARE_A = process.env.COMPARE_A || "torvalds";
const COMPARE_B = process.env.COMPARE_B || "gaearon";

const OUT_DIR = path.join(process.cwd(), "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const shots = [
  { file: "homepage.png", url: "/" },
  { file: "search-page.png", url: `/search?q=${SAMPLE_DEV}` },
  { file: "developer-profile.png", url: `/developer/${SAMPLE_DEV}` },
  { file: "repository-explorer.png", url: `/repository/${SAMPLE_DEV}/${SAMPLE_REPO}` },
  { file: "compare-developers.png", url: `/compare?a=${COMPARE_A}&b=${COMPARE_B}` },
  { file: "dashboard.png", url: "/dashboard" },
];

async function settle(page) {
  // Wait for network + give Framer Motion entrance animations time to finish.
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1400);
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // crisp, retina-quality images
    colorScheme: "dark",
  });
  const page = await context.newPage();

  for (const shot of shots) {
    const target = `${BASE_URL}${shot.url}`;
    process.stdout.write(`📸  ${shot.file}  ←  ${target}\n`);
    try {
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 });
      await settle(page);
      await page.screenshot({
        path: path.join(OUT_DIR, shot.file),
        fullPage: true,
      });
    } catch (err) {
      console.warn(`⚠️   Skipped ${shot.file}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✅  Saved ${shots.length} screenshots to /screenshots`);
})();
