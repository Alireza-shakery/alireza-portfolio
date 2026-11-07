# Verification — November 6, 2026

The visitor flow is: enter the English or Persian portfolio → navigate sections or DANAFA → read localized content → filter technology interests or change language → reach the existing verified contact links. No API/database/form submission service is involved.

The full design and validation report is in [REDESIGN.md](REDESIGN.md). Raw evidence is in `artifacts/verification.json`, `artifacts/redesign/performance.json`, and the before/after screenshot folders.

| Check                          | Status  | Evidence                                                                                                   |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------- |
| Lint                           | PASS    | `npm run lint`, exit 0, no warnings/errors                                                                 |
| TypeScript                     | PASS    | `npm run typecheck`, exit 0                                                                                |
| Content tests                  | PASS    | All five tests passed                                                                                      |
| Production build               | PASS    | Both locale homepages and both DANAFA routes prerendered                                                   |
| Production browser suite       | PASS    | 28 responsive checks, 8 axe scans with zero violations, 11 interaction groups, no runtime/hydration errors |
| Normal and reduced motion      | PASS    | Entrances/reveals complete; reduced motion has no running animations                                       |
| No-JavaScript content          | PASS    | Core content and project links remain rendered                                                             |
| Real DANAFA gallery navigation | NOT RUN | The owner has not supplied screenshots; empty gallery behavior is verified                                 |
| Lighthouse / field CWV         | NOT RUN | Lighthouse is not installed; no deployed-site field data                                                   |
| Cloudflare publication         | NOT RUN | No deployment requested or performed                                                                       |

Browser checks run on local production port 3001 through installed Chrome and Playwright. Widths: 320, 360, 390, 768, 1024, 1440, 1920. Axe scans cover `/en`, `/fa`, `/en/projects/danafa`, and `/fa/projects/danafa` at 390 and 1440 pixels. Keyboard checks include Escape and forward/backward focus trapping in the Persian mobile menu, section navigation, scroll-lock cleanup, desktop resize, and language switching with route/hash preservation.

The prior global 404 document caused a hydration warning on unmatched paths. The documented `global-not-found` convention fixes it for the `[locale]` root layout. Final production checks report no hydration errors. Expected resource-console messages for deliberate 404 requests are excluded; page errors, other console errors, and HTTP 5xx responses are captured.

The real DANAFA screenshot is intentionally absent. No generated or illustrative UI is rendered. Its implementation status, technologies, and links remain unverified, rather than inferred.

## Local performance observations

- en / desktop: LCP 736 ms, CLS 0, initial JS transfer 209 KiB.
- fa / desktop: LCP 224 ms, CLS 0, initial JS transfer 209 KiB.
- en / mobile: LCP 1580 ms, CLS 0, initial JS transfer 209 KiB.
- fa / mobile: LCP 1868 ms, CLS 0, initial JS transfer 209 KiB.

Mobile observations configure 4x CPU slowdown, 150 ms latency, and 1.6 Mbps download. These are single cold local lab observations, not field Core Web Vitals, INP, or a Lighthouse score. The JSON also records observed long tasks and interaction durations. They do not certify performance on real devices or networks.

Source CSS decreased from 55,849 to 36,667 bytes; this is source size, not compressed wire size. The existing portrait is unchanged, fonts remain local, and no dependency was added.

The normal Windows account context was needed for native SWC cache ownership checks in this restricted execution environment. No application code was changed to bypass that check.

The deployment architecture is unchanged: locale routes are prerendered, but `output: 'export'` is not enabled, locale Proxy and the Next.js image optimizer remain, and a direct static Cloudflare Pages deployment has not been prepared or verified.
