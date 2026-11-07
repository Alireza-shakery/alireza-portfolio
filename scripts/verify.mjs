import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserOptions } from './browser.mjs';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch(browserOptions());
await mkdir('artifacts', { recursive: true });
const report = { routes: [], accessibility: [], interactions: [], errors: [] };
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', (error) => report.errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('Failed to load resource'))
    report.errors.push(message.text());
});
page.on('response', (response) => {
  if (response.status() >= 500) report.errors.push(`HTTP ${response.status()}: ${response.url()}`);
});

try {
  for (const locale of ['en', 'fa']) {
    for (const path of [`/${locale}`, `/${locale}/projects/danafa`]) {
      for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, `${path}: HTTP response`);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('html').getAttribute('lang'), locale);
        assert.equal(
          await page.locator('html').getAttribute('dir'),
          locale === 'fa' ? 'rtl' : 'ltr',
        );
        assert.equal(await page.locator('h1').count(), 1);
        assert.ok(await page.title());
        const headings = await page
          .locator('h1')
          .evaluateAll((elements) =>
            elements.map((el) => parseFloat(getComputedStyle(el).fontSize)),
          );
        assert.ok(
          headings.every((size) => size <= 68),
          `Oversized title on ${path}`,
        );
        const surfaces = await page
          .locator('main section')
          .evaluateAll((elements) => elements.map((el) => getComputedStyle(el).backgroundColor));
        assert.ok(
          surfaces.every((color) => ['rgb(6, 11, 22)', 'rgb(11, 19, 36)'].includes(color)),
          `Unexpected section palette on ${path}`,
        );
        assert.equal(await page.locator('.danafa-preview').count(), 0);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        assert.equal(overflow, false, `Horizontal overflow on ${path} at ${width}px`);
        const brokenImages = await page
          .locator('img')
          .evaluateAll((images) =>
            images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
          );
        assert.deepEqual(brokenImages, []);
        const brokenAnchors = await page
          .locator('a[href*="#"]')
          .evaluateAll((links) =>
            links
              .filter(
                (link) =>
                  link.pathname === location.pathname &&
                  link.hash &&
                  !document.getElementById(decodeURIComponent(link.hash.slice(1))),
              )
              .map((link) => link.href),
          );
        assert.deepEqual(brokenAnchors, []);
        report.routes.push({
          path,
          width,
          status: response.status(),
          overflow,
          brokenImages,
          brokenAnchors,
        });
        if ([390, 1440].includes(width)) {
          const name = `${locale}-${path.includes('projects') ? 'project' : 'home'}-${width}`;
          await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
          const axe = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          report.accessibility.push({
            path,
            width,
            violations: axe.violations.map((item) => ({
              id: item.id,
              impact: item.impact,
              description: item.description,
              nodes: item.nodes.map((node) => ({
                target: node.target,
                summary: node.failureSummary,
              })),
            })),
          });
        }
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/en`);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(
    await page
      .getByRole('button', { name: 'Close navigation', exact: true })
      .first()
      .getAttribute('aria-expanded'),
    'true',
  );
  await page.keyboard.press('Escape');
  assert.equal(
    await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'),
    'false',
  );
  assert.equal(
    await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
    'Open navigation',
  );
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.waitForFunction(() => !document.getElementById('mobile-navigation'));
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: /Projects/ })
    .click();
  await page.waitForURL('**/en#projects');
  assert.equal(await page.locator('#mobile-navigation').count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  report.interactions.push(
    'Mobile navigation, Escape, focus restoration, section navigation, scroll lock cleanup, closing on desktop resize',
  );

  await page.getByRole('button', { name: 'Backend', exact: true }).click();
  assert.equal(await page.locator('.skill-card').count(), 1);
  assert.match(await page.locator('.skill-card').innerText(), /Node.js/);
  await page.getByRole('button', { name: 'All technologies', exact: true }).click();
  assert.equal(await page.locator('.skill-card').count(), 4);
  report.interactions.push('Technology filtering and reset');

  await page.locator('.project-detail-link').click();
  await page.waitForURL('**/en/projects/danafa');
  assert.equal(await page.locator('.gallery-empty .screenshot-placeholder').count(), 1);
  assert.equal(await page.locator('.gallery-controls').count(), 0);
  assert.equal(await page.locator('.danafa-preview').count(), 0);
  assert.equal(
    await page.locator('a[target="_blank"]').filter({ hasText: 'Visit live site' }).count(),
    0,
  );
  report.interactions.push(
    'Project navigation; honest screenshot placeholder; no fabricated preview or gallery controls without images',
  );

  await page.getByRole('link', { name: 'Switch to Persian' }).click();
  await page.waitForURL('**/fa/projects/danafa');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('.gallery-empty .screenshot-placeholder').count(), 1);
  await page.goto(`${base}/en#skills`);
  await page.getByRole('link', { name: 'Switch to Persian' }).click();
  await page.waitForURL('**/fa#skills');
  await page.locator('.menu-toggle').click();
  await page.keyboard.press('Shift+Tab');
  assert.equal(
    await page.locator('.menu-toggle').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Shift+Tab');
  assert.equal(
    await page.locator('.mobile-close').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await page.locator('.menu-toggle').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-navigation').count(), 0);
  report.interactions.push(
    'Persian mobile navigation, forward/backward focus trapping, and Escape',
  );
  report.interactions.push(
    'Language switching preserves project route and section hash; localized image placeholder',
  );

  const missing = await page.goto(`${base}/en/projects/not-a-project`);
  assert.equal(missing.status(), 404);
  assert.match(await page.locator('h1').innerText(), /page not found/i);
  const unknownLocale = await page.goto(`${base}/de`);
  assert.equal(unknownLocale.status(), 404);
  const robots = await context.request.get(`${base}/robots.txt`);
  assert.match(await robots.text(), /Disallow: \//);
  const sitemap = await context.request.get(`${base}/sitemap.xml`);
  assert.equal(sitemap.status(), 200);
  report.interactions.push('404 routes, robots and sitemap without a production origin');

  const detection = await browser.newContext({ locale: 'fa-IR' });
  const detectedPage = await detection.newPage();
  await detectedPage.goto(base);
  assert.ok(detectedPage.url().endsWith('/fa'));
  await detection.close();
  report.interactions.push('Browser-language detection redirects the root to Persian');

  await page.goto(`${base}/en`);
  const reducedAnimations = await page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
  );
  assert.equal(reducedAnimations, 0);
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  for (const section of ['#contact', '.site-footer']) {
    const links = await page.locator(`${section} a.contact-link`).evaluateAll((items) =>
      items.map((item) => ({
        href: item.getAttribute('href'),
        icon: Boolean(item.querySelector('svg')),
      })),
    );
    assert.equal(links.length, 5);
    for (const href of [
      'tel:+989134975033',
      'https://t.me/Alireza_Shakery',
      'https://www.instagram.com/its.shakeri/',
      'https://github.com/Alireza-shakery',
      'https://www.linkedin.com/in/alireza-shakery-705431446',
    ]) {
      assert.ok(links.some((link) => link.href === href && link.icon));
    }
  }
  report.interactions.push(
    'Reduced motion works; all five contact destinations and icons appear in contact/footer; missing email stays hidden',
  );

  const motionContext = await browser.newContext({
    reducedMotion: 'no-preference',
    viewport: { width: 1440, height: 900 },
  });
  const motionPage = await motionContext.newPage();
  motionPage.on('pageerror', (error) => report.errors.push(error.message));
  await motionPage.goto(`${base}/en`);
  await motionPage.waitForTimeout(1300);
  assert.equal(await motionPage.locator('h1').isVisible(), true);
  assert.equal(
    await motionPage
      .locator('.hero-line')
      .first()
      .evaluate((element) => getComputedStyle(element).opacity),
    '1',
  );
  await motionPage
    .locator('.desktop-nav')
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await motionPage.waitForTimeout(1000);
  assert.equal(
    await motionPage
      .locator('.desktop-nav')
      .getByRole('link', { name: 'Projects', exact: true })
      .getAttribute('aria-current'),
    'location',
  );
  await motionPage.locator('#skills').scrollIntoViewIfNeeded();
  await motionPage.waitForTimeout(900);
  assert.equal(await motionPage.locator('.skill-card').first().isVisible(), true);
  await motionContext.close();
  report.interactions.push(
    'Normal motion completes entrances and reveals; desktop active-section navigation updates',
  );

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/en`);
  assert.equal(await staticPage.locator('h1').isVisible(), true);
  assert.equal(await staticPage.locator('#projects h3').first().isVisible(), true);
  await noJs.close();
  report.interactions.push(
    'Core content and project navigation remain rendered without JavaScript',
  );

  const internalPaths = new Set();
  for (const path of ['/en', '/fa', '/en/projects/danafa', '/fa/projects/danafa']) {
    await page.goto(`${base}${path}`);
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((links) => links.map((link) => link.href))) {
      const url = new URL(href);
      if (url.origin === new URL(base).origin) internalPaths.add(url.pathname);
    }
  }
  for (const path of internalPaths)
    assert.equal(
      (await context.request.get(`${base}${path}`)).status(),
      200,
      `Broken internal link ${path}`,
    );
  report.interactions.push(
    `All ${internalPaths.size} unique internal link destinations return 200`,
  );
  assert.deepEqual(report.errors, [], 'Browser runtime errors');
  const violations = report.accessibility.flatMap((result) => result.violations);
  if (violations.length)
    throw new Error(`${violations.length} accessibility findings; see artifacts/verification.json`);
  console.log(
    JSON.stringify(
      {
        responsiveChecks: report.routes.length,
        accessibilityChecks: report.accessibility.length,
        interactions: report.interactions,
        errors: report.errors,
      },
      null,
      2,
    ),
  );
} finally {
  await writeFile('artifacts/verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
