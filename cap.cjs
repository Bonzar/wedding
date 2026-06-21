const puppeteer = require('puppeteer-core');
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
(async()=>{
  const b=await puppeteer.launch({executablePath:CHROME, headless:'new', args:['--no-sandbox','--hide-scrollbars','--disable-gpu']});
  const p=await b.newPage();
  await p.setViewport({width:440,height:1400,deviceScaleFactor:2});
  await p.goto('https://lysfilter.my.canva.site/design06',{waitUntil:'networkidle2',timeout:90000});
  await p.evaluate(async()=>{await new Promise(res=>{let y=0;const t=setInterval(()=>{window.scrollBy(0,500);y+=500;if(y>=document.body.scrollHeight+3000){clearInterval(t);res();}},110);});});
  await new Promise(r=>setTimeout(r,4000));
  await p.evaluate(()=>window.scrollTo(0,0));
  await new Promise(r=>setTimeout(r,1500));
  const H=await p.evaluate(()=>document.body.scrollHeight);
  console.log('scrollHeight=',H);
  await p.screenshot({path:'refs/ref-render/design06_scroll.png', fullPage:true});
  await b.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
