import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { browserOptions } from './browser.mjs';
const font = (
  await readFile('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')
).toString('base64');
const browser = await chromium.launch(browserOptions());
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<html><head><style>
  @font-face{font-family:Geist;src:url(data:font/woff2;base64,${font})}
  *{box-sizing:border-box}body{margin:0;font-family:Geist,sans-serif;background:radial-gradient(ellipse at 90% 20%,#12295180,transparent 60%),#060b16;color:#f1f5f9;padding:60px 75px;width:1200px;height:630px}
  .top{display:flex;align-items:center;gap:15px;font-size:13px;color:#93c5fd;letter-spacing:2px}.rule{width:32px;height:1px;background:#60a5fa}
  h1{font-size:78px;letter-spacing:-4px;font-weight:550;line-height:1.12;margin:65px 0 24px}
  .role{font-size:24px;color:#93c5fd}.bottom{position:absolute;bottom:45px;left:75px;right:75px;display:flex;justify-content:space-between;padding-top:24px;border-top:1px solid #60a5fa29;color:#a0aec4;font-size:14px}
  .mark{position:absolute;right:95px;top:190px;width:190px;height:190px;border:1px solid #60a5fa80;border-radius:16px;display:grid;place-items:center;font-size:110px;letter-spacing:-9px;font-weight:550}.mark span{color:#60a5fa}
  </style></head><body><div class="top"><span class="rule"></span>PERSONAL PORTFOLIO</div><h1>Alireza<br>Shakeri</h1><div class="role">Full-Stack Developer</div><div class="mark"><div>a<span>.</span></div></div><div class="bottom"><span>Projects, technologies, and contact.</span><span>AS / 01</span></div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await mkdir('public/images/og', { recursive: true });
  await page.screenshot({ path: 'public/images/og/social.png' });
  console.log('Generated public/images/og/social.png (1200 x 630).');
} finally {
  await browser.close();
}
