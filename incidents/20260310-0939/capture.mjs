import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5173/portfolio/';

const sections = ['#about', '#experience', '#projects', '#contact'];
const sectionNames = ['about', 'experience', 'projects', 'contact'];

async function captureViewport(browser, width, height, label) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  console.log(`[${label}] Navigating to ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  const heroPath = path.join(SCREENSHOTS_DIR, `hero-${label}.png`);
  await page.screenshot({ path: heroPath, fullPage: false });
  console.log(`[${label}] Saved hero-${label}.png`);

  for (let i = 0; i < sections.length; i++) {
    const selector = sections[i];
    const name = sectionNames[i];
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, selector);
    await page.waitForTimeout(1400);
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}-${label}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[${label}] Saved ${name}-${label}.png`);
  }

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  await captureViewport(browser, 1440, 900, 'desktop');
  await captureViewport(browser, 375, 812, 'mobile');

  await browser.close();
  console.log('All screenshots captured.');
})();
