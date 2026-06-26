import { webkit, devices } from '@playwright/test';
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil:'load', timeout:60000 });
await page.waitForTimeout(3500);
const r = await page.evaluate(() => {
  const root = document.querySelector('.d07-root');
  const wrap = root?.parentElement;
  const cs = root ? getComputedStyle(root) : null;
  return {
    innerWidth: window.innerWidth,
    docScrollW: document.documentElement.scrollWidth,
    bodyScrollW: document.body.scrollWidth,
    hOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    rootWidthComputed: cs?.width,
    rootContainerType: cs?.containerType,
    wrapOverflowX: wrap ? getComputedStyle(wrap).overflowX : null,
    sections: document.querySelectorAll('section.rGeu6w').length,
    rootOpacity: cs?.opacity,
    heroFrameW: (()=>{ const e=document.querySelector('[data-eid="hero/frame"]'); return e?Math.round(e.getBoundingClientRect().width):null; })(),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
