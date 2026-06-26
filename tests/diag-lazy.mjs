import { chromium, devices } from '@playwright/test';
const URL = 'https://bonzar.github.io/wedding/?d06';
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['Pixel 7'] });
const page = await ctx.newPage();
let imgResponses = 0;
page.on('response', r => { if (r.request().resourceType() === 'image') imgResponses++; });
await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForTimeout(2000);
const atLoad = imgResponses;
const stats = await page.evaluate(() => {
  const imgs = [...document.images];
  return {
    total: imgs.length,
    lazyAttr: imgs.filter(i => i.loading === 'lazy').length,
    eagerAttr: imgs.filter(i => i.loading === 'eager').length,
    complete: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
    notYetDecoded: imgs.filter(i => !i.naturalWidth).length,
    scaleTransform: getComputedStyle(document.querySelector('[style*="scale"]')||document.body).transform,
    bodyH: document.body.scrollHeight,
    vh: innerHeight,
  };
});
// scroll fully then recount
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2000);
const afterScroll = imgResponses;
console.log(JSON.stringify({ imgResponsesAtLoad: atLoad, imgResponsesAfterScroll: afterScroll, ...stats }, null, 2));
await b.close();
