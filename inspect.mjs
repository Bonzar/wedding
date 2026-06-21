import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b=await puppeteer.launch({executablePath:CHROME, headless:'new', args:['--no-sandbox','--disable-gpu']});
const p=await b.newPage();
await p.setViewport({width:440,height:1400,deviceScaleFactor:1});
await p.goto('https://lysfilter.my.canva.site/design06',{waitUntil:'networkidle2',timeout:90000});
await new Promise(r=>setTimeout(r,2500));
const r=await p.evaluate(()=>{
  const sc=[];
  document.querySelectorAll('*').forEach(el=>{
    if(el.scrollHeight-el.clientHeight>200 && el.clientHeight>200)
      sc.push({tag:el.tagName,id:el.id,cls:(el.className||'').toString().slice(0,40),sh:el.scrollHeight,ch:el.clientHeight});
  });
  const pages=[...document.querySelectorAll('[id^="page"],[id*="page-"],[data-page],section')].slice(0,25)
    .map(el=>({tag:el.tagName,id:el.id,cls:(el.className||'').toString().slice(0,24),h:Math.round(el.getBoundingClientRect().height)}));
  return {scrollables:sc.slice(0,8), pages, bodyH:document.body.scrollHeight, winH:innerHeight};
});
console.log(JSON.stringify(r,null,1));
await b.close();
