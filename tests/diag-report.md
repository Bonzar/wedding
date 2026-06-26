# Mobile crash diagnosis (Playwright)

- URL: https://bonzar.github.io/wedding/?d06
- Started: 2026-06-25T09:10:39.866Z
- Updated: 2026-06-25T09:11:22.888Z

## Heap / crash table

| engine | device | scrollMode | peakHeapMB | finalHeapMB | crashes | reloads | errors | note |
|---|---|---|---|---|---|---|---|---|
| chromium | Pixel 7 | fast | 4.1 | 4.1 | 0 | 0 | 0 | beforeScroll=4.0MB |
| chromium | Pixel 7 | slow | 4.2 | 4.2 | 0 | 0 | 0 | beforeScroll=4.0MB |
| chromium | Pixel 7 | fast | 4.2 | 4.2 | 0 | 0 | 1 | eager-load; beforeScroll=4.0MB |
| chromium | Pixel 7 | fast | 4.1 | 4.1 | 0 | 0 | 0 | cpu6x; beforeScroll=4.0MB |
| webkit | iPhone 13 | fast | - | - | 0 | 0 | 0 | no reload |
| webkit | iPhone SE | fast | - | - | 0 | 0 | 0 | no reload |

## Top images by natural pixel area

| basename | naturalW | naturalH | MPx | bytes(KB) | loaded |
|---|---|---|---|---|---|
| tile_1_1-7.png | 1280 | 1280 | 1.64 | 853 | initial |
| tile_1_1-10.png | 1280 | 1228 | 1.57 | 132 | initial |
| tile_1_1-11.png | 1280 | 1195 | 1.53 | 385 | initial |
| photo_2026-06-24_12.30.40.jpeg | 960 | 1280 | 1.23 | 133 | initial |
| photo_2026-06-24_12.30.53.jpeg | 1280 | 960 | 1.23 | 172 | initial |
| photo_2026-06-24_12.31.09.jpeg | 960 | 1280 | 1.23 | 120 | initial |
| photo_2026-06-24_12.31.05.jpeg | 960 | 1280 | 1.23 | 147 | initial |
| photo_2026-06-24_12.30.54.jpeg | 960 | 1280 | 1.23 | 150 | initial |
| photo_2026-06-24_12.30.56.jpeg | 1280 | 960 | 1.23 | 199 | initial |
| 2a2388e813cb85fb095b9a0c836a0688.jpg | 1280 | 937 | 1.20 | 179 | initial |
| tile_1_1-4.png | 1024 | 1024 | 1.05 | 515 | initial |
| photo_2026-06-24_12.30.50.jpeg | 720 | 1280 | 0.92 | 92 | initial |

## Decoded-bitmap memory estimate (the GPU/decode hypothesis)

- Unique images on page: 36
- Total transfer (compressed) bytes: 3.6 MB
- Total DECODED RGBA (W*H*4) if all held simultaneously: 86.0 MB
- Largest single decoded bitmap: 6.25 ... see top table
- Images whose network response arrived AFTER scroll start (fast run): 0

## Lazy-load probe (tests/diag-lazy.mjs, Pixel 7 / Chromium)

- `<img>` elements total: **56**; `loading="lazy"`: **51**; `loading="eager"`: 0
- Image network responses at initial load (before any scroll): **55**
- Image network responses after a full scroll to bottom: **55** (i.e. **0 new fetches** during scroll)
- Root layout uses `transform: matrix(0.231982 ...)` = `scale(0.232)`. The ~15000px logical canvas collapses to `document.body.scrollHeight ≈ 3766px` CSS (only ~4.5 viewports of 839px).
- KEY: because the scaled page is only a few viewports tall, the browser's lazy-load heuristic treats nearly every "lazy" image as near-viewport and **fetches+decodes them all up front**. `loading="lazy"` is effectively defeated by the `transform: scale()` wrapper. So the load is a single bulk spike at page open, not staggered during scroll.

## Assessment

The data PARTIALLY SUPPORTS the hypothesis, with an important refinement. JS heap is a non-signal here: it stays flat at ~4 MB across fast, slow, eager, and 6x-CPU-throttled runs on desktop Chromium, and no crash/reload occurred in any engine (expected — desktop WebKit/Chromium have no per-tab memory cap). The real pressure is the **decoded-bitmap / GPU layer memory**, which JSHeapUsedSize does not measure: 36 unique images (56 elements) at ~1280px on the long edge sum to **~86 MB of decoded RGBA** if held simultaneously, and the heaviest single bitmap is **tile_1_1-7.png at 1280x1280 = 6.25 MB decoded (853 KB on the wire)**.

The twist vs the original "lazy images load during fast scroll" framing: lazy loading is NOT actually deferring anything. The `transform: scale(0.232)` on the canvas shrinks the whole document to ~4.5 viewports, so Chromium (and very likely iOS Safari) fetches and decodes essentially all 55+ images at page open. The crash trigger on a real iPhone is therefore better explained as: the entire ~15000px logical surface lives under one big scaled/composited layer with ~86 MB of decoded image data; fast scrolling forces Safari to repeatedly re-raster/re-composite that oversized layer, and on iOS Safari's hard per-tab memory ceiling that decode+raster working set tips over ("a problem repeatedly occurred"). Slow scrolling gives the compositor time to discard and re-decode tiles, keeping the peak working set low — matching the slow-vs-fast asymmetry the user observed.

**Single biggest image-memory contributor still on the deployed site:** `tile_1_1-7.png` — 1280x1280, ~6.25 MB decoded, 853 KB transfer (the largest by both decoded area and wire size). Next: tile_1_1-11.png (1.53 MPx, 385 KB) and tile_1_1-4.png (1024x1024, 515 KB). Recommended fixes (not applied — investigation only): downscale these PNGs to their displayed size (they render at ~23% scale, so source resolution is ~4x oversized), and reconsider the global `transform: scale()` approach since it nullifies lazy-loading.

## Notes

