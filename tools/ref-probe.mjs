import { chromium } from "playwright-core";
const URL = "https://lysfilter.my.canva.site/design06/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const r = {};
  r.bodyScroll = [document.body.scrollWidth, document.body.scrollHeight];
  r.docScroll = [document.documentElement.scrollWidth, document.documentElement.scrollHeight];
  r.inner = [window.innerWidth, window.innerHeight];
  // крупнейшие по высоте элементы
  const els = [...document.querySelectorAll("*")];
  const big = els.map((e) => {
    const b = e.getBoundingClientRect();
    return { tag: e.tagName, cls: (e.className && e.className.toString && e.className.toString().slice(0, 40)) || "", w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top) };
  }).filter((x) => x.h > 1500).sort((a, b) => b.h - a.h).slice(0, 12);
  r.tallElements = big;
  // элементы с transform scale
  r.scaled = els.filter((e) => { const t = getComputedStyle(e).transform; return t && t !== "none"; })
    .slice(0, 6).map((e) => ({ tag: e.tagName, cls: (e.className && e.className.toString && e.className.toString().slice(0,30))||"", transform: getComputedStyle(e).transform }));
  // есть ли скролл-контейнер с overflow
  r.overflowScroll = els.filter((e) => { const o = getComputedStyle(e).overflowY; return (o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight + 100; })
    .slice(0,6).map((e)=>({ tag:e.tagName, cls:(e.className&&e.className.toString&&e.className.toString().slice(0,30))||"", scrollH:e.scrollHeight, clientH:e.clientHeight }));
  return r;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
