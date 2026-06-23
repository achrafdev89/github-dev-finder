// scripts/demo.js
// Records a demo walkthrough with Playwright, then assembles assets/demo.gif.
//
// Flow: open site → search a developer → view profile → open a repository → compare developers.
//
// Usage:
//   1. Start the app:        npm run dev
//   2. In another terminal:  npm run demo
//
// Requirements:
//   - Playwright (records a .webm video)
//   - ffmpeg on your PATH (converts the video to an optimized GIF)
//     macOS:   brew install ffmpeg
//     Ubuntu:  sudo apt install ffmpeg
//     Windows: choco install ffmpeg   (or download from ffmpeg.org)

const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SAMPLE_DEV = process.env.SAMPLE_DEV || "torvalds";
const COMPARE_A = process.env.COMPARE_A || "torvalds";
const COMPARE_B = process.env.COMPARE_B || "gaearon";

const ASSETS_DIR = path.join(process.cwd(), "assets");
const TMP_DIR = path.join(process.cwd(), ".demo-tmp");
const VIEWPORT = { width: 1280, height: 800 };

const pause = (page, ms = 1200) => page.waitForTimeout(ms);

async function typeSlowly(page, selector, text) {
  await page.click(selector);
  await page.fill(selector, "");
  await page.type(selector, text, { delay: 90 });
}

(async () => {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  // 1. Open the site
  console.log("🎬  Opening site…");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await pause(page, 2000);

  // 2. Search for a developer
  console.log("🔍  Searching developer…");
  const searchInput = 'input[aria-label="Search GitHub developers"]';
  if (await page.locator(searchInput).count()) {
    await typeSlowly(page, searchInput, SAMPLE_DEV);
    await pause(page, 600);
    await page.keyboard.press("Enter");
  } else {
    await page.goto(`${BASE_URL}/search?q=${SAMPLE_DEV}`, { waitUntil: "networkidle" });
  }
  await page.waitForLoadState("networkidle").catch(() => {});
  await pause(page, 2200);

  // 3. View a profile
  console.log("👤  Viewing profile…");
  await page.goto(`${BASE_URL}/developer/${SAMPLE_DEV}`, { waitUntil: "networkidle" });
  await pause(page, 2400);
  await page.mouse.wheel(0, 700);
  await pause(page, 1800);

  // 4. Open repositories
  console.log("📦  Opening repository…");
  const repoLink = page.locator('a[href^="/repository/"]').first();
  if (await repoLink.count()) {
    await repoLink.click();
  }
  await page.waitForLoadState("networkidle").catch(() => {});
  await pause(page, 2400);
  await page.mouse.wheel(0, 600);
  await pause(page, 1600);

  // 5. Compare developers
  console.log("⚖️   Comparing developers…");
  await page.goto(`${BASE_URL}/compare?a=${COMPARE_A}&b=${COMPARE_B}`, {
    waitUntil: "networkidle",
  });
  await pause(page, 3000);

  await context.close(); // flushes the video file
  await browser.close();

  // Find the recorded video
  const video = fs
    .readdirSync(TMP_DIR)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => path.join(TMP_DIR, f))[0];

  if (!video) {
    console.error("❌  No video was recorded.");
    process.exit(1);
  }

  // Convert to an optimized GIF with ffmpeg (palette pass for clean colors)
  const out = path.join(ASSETS_DIR, "demo.gif");
  const palette = path.join(TMP_DIR, "palette.png");
  const fps = 12;
  const width = 960;

  console.log("🛠️   Converting to GIF (ffmpeg)…");
  try {
    execSync(
      `ffmpeg -y -i "${video}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos,palettegen" "${palette}"`,
      { stdio: "ignore" },
    );
    execSync(
      `ffmpeg -y -i "${video}" -i "${palette}" -lavfi "fps=${fps},scale=${width}:-1:flags=lanczos [x]; [x][1:v] paletteuse" "${out}"`,
      { stdio: "ignore" },
    );
    console.log(`\n✅  Saved demo GIF to ${out}`);
  } catch (err) {
    console.error("❌  ffmpeg failed. Is ffmpeg installed and on your PATH?");
    console.error(`    The raw recording is here: ${video}`);
    process.exit(1);
  }

  // Cleanup
  try {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  } catch {}
})();
