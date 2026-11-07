# Alireza Shakeri — Personal portfolio

A bilingual portfolio built with Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, Motion, next-intl, and Lucide. English uses Geist Variable; Persian uses Vazirmatn Variable with RTL layout. Fonts are self-hosted.

The Dark Blue design uses a near-black navy background, restrained blue accents, compact typography, a real portrait, and a project showcase that only displays owner-supplied screenshots. See [REDESIGN.md](REDESIGN.md) for the design review, before/after evidence, validation results, and remaining inputs.

## Run locally

Use Node.js 22.13 or newer (verified with Node 24):

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000/en or http://127.0.0.1:3000/fa. `/` detects the browser language, remembers a selected locale, and defaults to English. On Windows with PowerShell script execution disabled, use `npm.cmd`.

There is no database, authentication service, contact form backend, or required secret. Images and fonts are local. If SWC reports an untrusted cache owner in an isolated Windows account, run the development command from a terminal under your normal Windows account; no source-code workaround is required.

## Edit content

| File                                   | Content                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/content/profile.ts`               | Name, title, introduction, biography, portrait, optional personal photos, technology interests |
| `src/content/projects.ts`              | Projects, case studies, screenshots, confirmed technologies and links                          |
| `src/content/contacts.ts`              | Enabled contact destinations, labels, ordering, phone visibility                               |
| `src/content/site.ts`                  | Verified production origin and social image path                                               |
| `messages/en.json`, `messages/fa.json` | Translated interface text and metadata                                                         |
| `src/app/globals.css`                  | Design tokens, component styles, responsive rules, reduced motion                              |
| `src/app/fonts.ts`                     | Shared local variable fonts                                                                    |

The biography and approach are suggested wording based on the brief, without invented experience or achievements. Technology entries are labeled as interests. Confirm wording and proficiency before changing those labels.

## Projects and the real DANAFA screenshot

Project entries generate `/en/projects/[slug]` and `/fa/projects/[slug]` automatically. Keep unique lowercase hyphenated slugs and supply both translations. `technologies`, `liveUrl`, `repositoryUrl`, and implemented features must contain confirmed information only. Unknown links stay `null` and are hidden.

DANAFA is an online education and webinar project. Its prior implementation status remains labeled **Project concept** until confirmed by the owner. Its role, stack, completed capabilities, and links have not been independently verified. The former illustrative product UI has been removed.

The real screenshot has not been supplied. When received:

1. Save an optimized copy at `public/images/projects/danafa/cover.webp` (or preserve `.png` if better for legibility).
2. Set the DANAFA `cover.src` in `src/content/projects.ts` to `/images/projects/danafa/cover.webp`, matching the actual extension.
3. Confirm the existing English and Persian alt text describes the supplied screenshot accurately.

The cover appears in the homepage browser frame and is used by the detail gallery until additional `screenshots` are supplied. Both use `object-fit: contain` to retain the entire screenshot, with no perspective effect. A full-size image link appears in the gallery. Navigation controls appear only when there are multiple real images. No stock, generated, or fabricated screenshots are used as fallbacks.

For more screenshots, add translated `Photo` entries to `screenshots`; no component changes are needed. The current browser test verifies the no-image state. When real images are added, update that assertion and verify gallery navigation on the actual media.

## Personal photos and contact links

The existing portrait remains at `public/images/profile/hero.png`. Additional personal photos can be configured in `profile.photos`; unset entries do not produce empty decorative panels. A reserved image container prevents layout jumps.

The five verified phone, Instagram, Telegram, GitHub, and LinkedIn destinations remain configured. External links use `noopener noreferrer`. Disabled or invalid links stay hidden, and absent email does not produce a disconnected form. `phoneVisibility: 'reveal'` is supported as a visual preference; enabled numbers are still sent to the browser.

## Validation

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

For browser checks, start the built site in a separate terminal:

```sh
npm run start -- --port 3001
npm run test:browser
node scripts/measure-performance.mjs
```

The scripts use installed Chrome on Windows when found, or Playwright Chromium. Set `CHROME_PATH` to override the executable and `TEST_BASE_URL` to override the site URL. No Windows drive path is embedded in the scripts.

Browser checks cover the two homepages and two project pages at 320, 360, 390, 768, 1024, 1440, and 1920 pixels; RTL/LTR, overflow, heading size, dark section colors, loaded images, internal anchors, navigation, language/route/hash preservation, technology filters, root locale detection, reduced motion, no-JavaScript content, valid contact destinations, and 404/robots/sitemap behavior. Axe scans run on all four pages at 390 and 1440 pixels.

`node scripts/capture-redesign.mjs` captures desktop/mobile pages and localized 404 states in `artifacts/redesign/after/`. `CAPTURE_STAGE=before` changes the destination for a future baseline. Performance measurements are single local lab observations with documented throttling, not field Core Web Vitals or a Lighthouse score. Evidence is saved under ignored `artifacts/`.

## Deployment preparation

No deployment is performed by these commands. The verified production HTTPS origin belongs in `NEXT_PUBLIC_SITE_URL` before launch. Without it, the existing noindex behavior, restrictive robots.txt, and empty sitemap remain intentional. Rebuild after changing it. `node scripts/generate-social.mjs` regenerates the 1200 × 630 Dark Blue social image.

The current configuration prerenders the locale pages but does **not** enable `output: 'export'`. Locale routing still uses `src/proxy.ts`, and Next.js Image still uses its optimizer. Direct static hosting on Cloudflare Pages therefore needs a separate deployment preparation step. This redesign keeps the current routing and rendering architecture and adds no backend dependency. It does not claim to have verified a Cloudflare deployment.

The root layout is under `[locale]`; Next.js's documented `experimental.globalNotFound` option provides a separate document for unmatched paths and prevents nested-document hydration errors. Known project 404s retain the localized layout. The generic fallback offers links in both languages.

## Still needed

- The real DANAFA screenshot and confirmed stack, role, completed features, and available project links.
- Optional additional personal photos and a verified email address.
- Final review of biography/approach wording and the production domain.
