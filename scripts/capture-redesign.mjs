import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserOptions } from './browser.mjs';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const stage = process.env.CAPTURE_STAGE || 'after';
if (!['before', 'after'].includes(stage)) throw new Error('CAPTURE_STAGE must be before or after');
const dir = `artifacts/redesign/${stage}`;
const browser = await chromium.launch(browserOptions());
const report = [];
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await mkdir(dir, { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    for (const route of [
      '/en',
      '/fa',
      '/en/projects/danafa',
      '/fa/projects/danafa',
      '/en/projects/missing',
      '/fa/projects/missing',
      '/de',
    ]) {
      const response = await page.goto(`${base}${route}`, {
        waitUntil: 'networkidle',
        timeout: 90000,
      });
      await page.evaluate(() => document.fonts.ready);
      const name = route.slice(1).replaceAll('/', '-');
      await page.screenshot({ path: `${dir}/${name}-${width}.png`, fullPage: true });
      await page.screenshot({ path: `${dir}/${name}-${width}-viewport.png` });
      report.push({
        route,
        width,
        status: response.status(),
        headings: await page
          .locator('h1,h2')
          .evaluateAll((items) =>
            items.map((el) => ({ text: el.textContent, size: getComputedStyle(el).fontSize })),
          ),
      });
    }
  }
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(`Captured ${report.length} pages in ${dir}`);
} finally {
  await browser.close();
}
