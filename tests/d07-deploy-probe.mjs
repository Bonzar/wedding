import { webkit, devices } from '@playwright/test';
const URL = process.env.U || 'https://bonzar.github.io/wedding/';
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errs = [];
page.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,140)); });
page.on('pageerror', e => errs.push('PAGEERROR: '+String(e).slice(0,180)));
await page.goto(URL, { waitUntil:'load', timeout:60000 }).catch(e=>errs.push('GOTO: '+e.message.slice(0,120)));
await page.waitForTimeout(4000);
const r = await page.evaluate(() => {
  const root = document.querySelector('.d07-root');
  const cs = root ? getComputedStyle(root) : null;
  return {
    title: document.title,
    rootEl: document.getElementById('root')?.childElementCount ?? 'no #root',
    d07root: !!root,
    rootWidth: cs?.width, rootOpacity: cs?.opacity, containerType: cs?.containerType,
    sections: document.querySelectorAll('section.rGeu6w').length,
    bodyText: (document.body.innerText||'').replace(/\s+/g,' ').slice(0,80),
    innerWidth: window.innerWidth, docScrollW: document.documentElement.scrollWidth,
  };
});
console.log('URL:', URL);
console.log(JSON.stringify(r, null, 2));
console.log('CONSOLE ERRORS:', errs.length ? '\n - '+errs.join('\n - ') : 'none');
await page.screenshot({ path: 'tests/d07-deploy-shot.png' });
await b.close();
