import { chromium, webkit, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const URL = process.env.DIAG_URL || 'https://bonzar.github.io/wedding/?d06';
const REPORT = path.resolve('tests/diag-report.md');

const state = {
  url: URL,
  startedAt: new Date().toISOString(),
  rows: [],          // {engine, device, scrollMode, peakHeapMB, finalHeapMB, crashes, reloads, errors, note}
  images: [],        // {basename, naturalW, naturalH, area, bytes, late}
  notes: [],
};

function basename(u) { try { return decodeURIComponent(u.split('?')[0].split('/').pop()); } catch { return u; } }

function flush() {
  const L = [];
  L.push('# Mobile crash diagnosis (Playwright)');
  L.push('');
  L.push(`- URL: ${state.url}`);
  L.push(`- Started: ${state.startedAt}`);
  L.push(`- Updated: ${new Date().toISOString()}`);
  L.push('');
  L.push('## Heap / crash table');
  L.push('');
  L.push('| engine | device | scrollMode | peakHeapMB | finalHeapMB | crashes | reloads | errors | note |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of state.rows) {
    L.push(`| ${r.engine} | ${r.device} | ${r.scrollMode} | ${r.peakHeapMB ?? '-'} | ${r.finalHeapMB ?? '-'} | ${r.crashes ?? 0} | ${r.reloads ?? 0} | ${r.errors ?? 0} | ${r.note ?? ''} |`);
  }
  L.push('');
  L.push('## Top images by natural pixel area');
  L.push('');
  L.push('| basename | naturalW | naturalH | MPx | bytes(KB) | loaded |');
  L.push('|---|---|---|---|---|---|');
  const top = [...state.images].sort((a, b) => b.area - a.area).slice(0, 12);
  for (const im of top) {
    L.push(`| ${im.basename} | ${im.naturalW} | ${im.naturalH} | ${(im.area/1e6).toFixed(2)} | ${(im.bytes/1024).toFixed(0)} | ${im.late ? 'LATE(scroll)' : 'initial'} |`);
  }
  L.push('');
  // decoded bitmap memory estimate (RGBA = W*H*4)
  const uniq = new Map();
  for (const im of state.images) if (!uniq.has(im.basename)) uniq.set(im.basename, im);
  const list = [...uniq.values()];
  const totalDecoded = list.reduce((s, im) => s + im.area * 4, 0);
  const totalBytes = list.reduce((s, im) => s + (im.bytes || 0), 0);
  const lateCount = list.filter(im => im.late).length;
  L.push('## Decoded-bitmap memory estimate (the GPU/decode hypothesis)');
  L.push('');
  L.push(`- Unique images on page: ${list.length}`);
  L.push(`- Total transfer (compressed) bytes: ${(totalBytes/1048576).toFixed(1)} MB`);
  L.push(`- Total DECODED RGBA (W*H*4) if all held simultaneously: ${(totalDecoded/1048576).toFixed(1)} MB`);
  L.push(`- Largest single decoded bitmap: ${list.length ? Math.max(...list.map(i=>i.area*4))/1048576 : 0} ... see top table`);
  L.push(`- Images whose network response arrived AFTER scroll start (fast run): ${lateCount}`);
  L.push('');
  if (state.assessment) { L.push('## Assessment'); L.push(''); L.push(state.assessment); L.push(''); }
  L.push('## Notes');
  L.push('');
  for (const n of state.notes) L.push(`- ${n}`);
  L.push('');
  fs.writeFileSync(REPORT, L.join('\n'));
}

function note(s) { state.notes.push(s); console.log('NOTE:', s); flush(); }

// fast scroll: ~600px steps, ~80ms waits, top->bottom->top, repeated
async function fastScroll(page, passes = 3, onTick) {
  for (let p = 0; p < passes; p++) {
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= h; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
      if (onTick) await onTick();
    }
    for (let y = h; y >= 0; y -= 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
      if (onTick) await onTick();
    }
  }
}

// slow scroll: 150px steps, ~400ms waits, one pass top->bottom
async function slowScroll(page, onTick) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= h; y += 150) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(400);
    if (onTick) await onTick();
  }
}

async function collectImages(page, lateThresholdMs, navStart) {
  // capture natural sizes + whether loaded after navStart+threshold
  return page.evaluate(({ navStart, lateThresholdMs }) => {
    const out = [];
    for (const img of Array.from(document.images)) {
      if (!img.naturalWidth) continue;
      out.push({
        url: img.currentSrc || img.src,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      });
    }
    return out;
  }, { navStart, lateThresholdMs });
}

async function runChromiumHeap(scrollMode, opts = {}) {
  const device = devices['Pixel 7'];
  const browser = await chromium.launch();
  const row = { engine: 'chromium', device: 'Pixel 7', scrollMode, peakHeapMB: 0, finalHeapMB: 0, crashes: 0, reloads: 0, errors: 0, note: opts.label || '' };
  let context, page;
  const imgResp = new Map(); // url -> bytes
  const imgLate = new Map(); // url -> bool (response arrived after scroll start)
  let scrollStart = Infinity;
  let t0 = Date.now();
  try {
    context = await browser.newContext({ ...device });
    page = await context.newPage();
    if (opts.eagerInit) {
      await page.addInitScript(() => {
        const force = (img) => { try { img.loading = 'eager'; } catch {} };
        const mo = new MutationObserver((muts) => {
          for (const m of muts) for (const n of m.addedNodes) {
            if (n.nodeType === 1) {
              if (n.tagName === 'IMG') force(n);
              n.querySelectorAll && n.querySelectorAll('img').forEach(force);
            }
          }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('img').forEach(force));
      });
    }
    page.on('crash', () => { row.crashes++; });
    page.on('pageerror', () => { row.errors++; });
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) row.reloads++; });
    page.on('response', (resp) => {
      const ct = resp.request().resourceType();
      if (ct === 'image') {
        const u = resp.url();
        resp.body().then(b => imgResp.set(u, b.length)).catch(() => {});
        imgLate.set(u, Date.now() >= scrollStart);
      }
    });

    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');
    if (opts.cpuThrottle) await client.send('Emulation.setCPUThrottlingRate', { rate: opts.cpuThrottle });

    const sampleHeap = async () => {
      try {
        const m = await client.send('Performance.getMetrics');
        const used = m.metrics.find(x => x.name === 'JSHeapUsedSize')?.value || 0;
        const mb = used / 1048576;
        if (mb > row.peakHeapMB) row.peakHeapMB = mb;
        row.finalHeapMB = mb;
      } catch {}
    };

    t0 = Date.now();
    await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1500);
    row.reloads = 0; // reset; initial nav doesn't count as reload
    await sampleHeap();
    const beforeScroll = row.finalHeapMB;

    scrollStart = Date.now();
    if (scrollMode === 'fast') await fastScroll(page, opts.passes || 3, sampleHeap);
    else await slowScroll(page, sampleHeap);

    await page.waitForTimeout(800);
    await sampleHeap();

    // collect natural sizes once at end
    const imgs = await collectImages(page);
    const byUrl = new Map(imgs.map(i => [i.url, i]));
    if (!opts.skipImageReport) {
      for (const [u, im] of byUrl) {
        const bytes = imgResp.get(u) || 0;
        state.images.push({ basename: basename(u), naturalW: im.naturalW, naturalH: im.naturalH, area: im.naturalW * im.naturalH, bytes, late: imgLate.get(u) || false });
      }
    }
    row.peakHeapMB = +row.peakHeapMB.toFixed(1);
    row.finalHeapMB = +row.finalHeapMB.toFixed(1);
    row.note = (row.note ? row.note + '; ' : '') + `beforeScroll=${beforeScroll.toFixed(1)}MB`;
  } catch (e) {
    row.note = (row.note ? row.note + '; ' : '') + 'ERR:' + (e.message || e).slice(0, 80);
  } finally {
    state.rows.push(row); flush();
    try { await browser.close(); } catch {}
  }
  return row;
}

async function runWebkit(deviceName) {
  const device = devices[deviceName];
  const row = { engine: 'webkit', device: deviceName, scrollMode: 'fast', peakHeapMB: '-', finalHeapMB: '-', crashes: 0, reloads: 0, errors: 0, note: '' };
  let browser;
  try {
    browser = await webkit.launch();
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();
    page.on('crash', () => { row.crashes++; });
    page.on('pageerror', () => { row.errors++; });
    let navs = 0;
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) navs++; });
    await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1200);
    navs = 0; // first nav baseline
    await fastScroll(page, 4);
    await page.waitForTimeout(600);
    row.reloads = navs;
    row.note = navs > 0 ? 'main-frame renavigated (reload)' : 'no reload';
  } catch (e) {
    row.note = 'ERR:' + (e.message || e).slice(0, 90);
  } finally {
    state.rows.push(row); flush();
    try { await browser?.close(); } catch {}
  }
  return row;
}

async function main() {
  flush();
  // 1. Chromium fast vs slow (fast first, captures image report)
  await withTimeout(runChromiumHeap('fast', { lateMs: 4000, passes: 3 }), 90000, 'chromium-fast');
  await withTimeout(runChromiumHeap('slow', { lateMs: 4000, skipImageReport: true }), 90000, 'chromium-slow');
  // 2. eager experiment
  await withTimeout(runChromiumHeap('fast', { lateMs: 4000, passes: 3, eagerInit: true, skipImageReport: true, label: 'eager-load' }), 90000, 'chromium-eager');
  // 4. CPU throttle (do before webkit since webkit slower)
  await withTimeout(runChromiumHeap('fast', { lateMs: 4000, passes: 2, cpuThrottle: 6, skipImageReport: true, label: 'cpu6x' }), 90000, 'chromium-cpu6');
  // 3. webkit
  await withTimeout(runWebkit('iPhone 13'), 90000, 'wk-13');
  await withTimeout(runWebkit('iPhone SE'), 90000, 'wk-se');
  flush();
  console.log('DONE');
}

function withTimeout(p, ms, label) {
  let t;
  const guard = new Promise((res) => { t = setTimeout(() => { note(`TIMEOUT ${label} after ${ms}ms`); res(null); }, ms); });
  return Promise.race([p, guard]).finally(() => clearTimeout(t));
}

main().catch(e => { note('FATAL:' + (e.message || e)); flush(); });
