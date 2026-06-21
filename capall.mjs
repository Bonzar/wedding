import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const base='https://lysfilter.my.canva.site/design06';
const b=await puppeteer.launch({executablePath:CHROME, headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars']});
async function shot(url,out){
  const p=await b.newPage();
  await p.setViewport({width:440,height:2600,deviceScaleFactor:2});
  await p.goto(url,{waitUntil:'networkidle2',timeout:90000});
  await new Promise(r=>setTimeout(r,3500));
  await p.screenshot({path:out});
  await p.close();
  const fs=await import('fs'); return fs.statSync(out).size;
}
let prev=0;
console.log('hero', await shot(base,'refs/ref-render/p_hero.png'));
for(let n=0;n<8;n++){
  const sz=await shot(base+'/#page-'+n, `refs/ref-render/p_${n}.png`);
  console.log('page',n,sz, sz===prev?'(SAME as prev)':'');
  prev=sz;
}
await b.close();
