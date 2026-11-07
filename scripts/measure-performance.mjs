import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserOptions } from './browser.mjs';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch(browserOptions());
const report = [];
try {
  for (const mobile of [false, true]) {
    for (const locale of ['en', 'fa']) {
      const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        deviceScaleFactor: mobile ? 2 : 1,
        isMobile: mobile,
        hasTouch: mobile,
        reducedMotion: 'no-preference',
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      if (mobile) {
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: 200000,
          uploadThroughput: 93750,
        });
      }
      await page.addInitScript(() => {
        window.__portfolioMetrics = { lcp: 0, cls: 0, shifts: [], interactions: [], longTasks: [] };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__portfolioMetrics.lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__portfolioMetrics.cls += entry.value;
              window.__portfolioMetrics.shifts.push(entry.value);
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            window.__portfolioMetrics.longTasks.push(entry.duration);
        }).observe({ type: 'longtask', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.interactionId) window.__portfolioMetrics.interactions.push(entry.duration);
          }
        }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
      });
      await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      const initial = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        return {
          lcpMs: Math.round(window.__portfolioMetrics.lcp),
          cls: window.__portfolioMetrics.cls,
          ttfbMs: Math.round(nav.responseStart),
          jsTransferKiB: Math.round(
            resources
              .filter((r) => r.initiatorType === 'script')
              .reduce((sum, r) => sum + r.transferSize, 0) / 1024,
          ),
          imageTransferKiB: Math.round(
            resources
              .filter((r) => r.initiatorType === 'img' || r.name.includes('/_next/image?'))
              .reduce((sum, r) => sum + r.transferSize, 0) / 1024,
          ),
          longTasks: window.__portfolioMetrics.longTasks.length,
          observedBlockingMs: Math.round(
            window.__portfolioMetrics.longTasks.reduce(
              (sum, duration) => sum + Math.max(0, duration - 50),
              0,
            ),
          ),
        };
      });
      await page.locator('.skill-filters button').nth(2).click();
      await page.waitForTimeout(300);
      if (mobile) {
        await page.locator('.menu-toggle').click();
        await page.keyboard.press('Escape');
      }
      const events = await page.evaluate(() => window.__portfolioMetrics.interactions);
      report.push({
        locale,
        device: mobile ? 'mobile' : 'desktop',
        throttling: mobile ? '4x CPU, 150ms latency, 1.6Mbps download' : 'none',
        ...initial,
        maxObservedInteractionMs: events.length ? Math.max(...events) : null,
        errors,
      });
      await context.close();
    }
  }
  await mkdir('artifacts/redesign', { recursive: true });
  await writeFile(
    'artifacts/redesign/performance.json',
    JSON.stringify(
      {
        note: 'One cold local lab run per locale/device; observed interaction durations are not a field INP measurement. No Lighthouse score is implied.',
        results: report,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
