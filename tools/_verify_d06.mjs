import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "node:fs";
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1776,height:1400}, deviceScaleFactor:1 });
const errs=[]; p.on("console",m=>{if(m.type()==="error")errs.push(m.text());}); p.on("pageerror",e=>errs.push("PAGEERROR: "+e.message));
// ?baseline скрывает раздел Survey (его нет в Canva-эталоне) — иначе он добавил бы высоту
// и сломал полностраничный дифф (size mismatch). Сравниваем чистый baseline d06 с эталоном.
await p.goto("http://localhost:5173/?d06&noscale&baseline",{waitUntil:"networkidle",timeout:60000});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(2500);
const info=await p.evaluate(()=>{const imgs=[...document.querySelectorAll('img')];return{sections:document.querySelectorAll('section[id]').length,imgs:imgs.length,broken:imgs.filter(i=>i.complete&&i.naturalWidth===0).length,docH:document.documentElement.scrollHeight,scriptFont:document.fonts.check('700 160px "YAD86m_J1ck_0"')};});
console.log("REACT",JSON.stringify(info)); console.log("ERRORS",JSON.stringify(errs.slice(0,5)));
await p.screenshot({path:"refs/ref-render/react_d06_full.png",fullPage:true});
const p2=await b.newPage({viewport:{width:1776,height:1400},deviceScaleFactor:1});
await p2.goto("http://localhost:5173/design06-exact/index.html",{waitUntil:"networkidle",timeout:60000});
await p2.evaluate(()=>document.fonts.ready); await p2.waitForTimeout(2500);
await p2.screenshot({path:"refs/ref-render/static_baseline_full.png",fullPage:true});
await b.close();
const a=PNG.sync.read(fs.readFileSync("refs/ref-render/react_d06_full.png"));
const c=PNG.sync.read(fs.readFileSync("refs/ref-render/static_baseline_full.png"));
console.log("DIMS react",a.width+"x"+a.height,"static",c.width+"x"+c.height);
if(a.width===c.width&&a.height===c.height){const d=new PNG({width:a.width,height:a.height});const n=pixelmatch(a.data,c.data,d.data,a.width,a.height,{threshold:0.1});fs.writeFileSync("refs/ref-render/d06_diff.png",PNG.sync.write(d));console.log("DIFF pixels:",n,"=",(100*n/(a.width*a.height)).toFixed(3)+"%");}else console.log("DIFF skipped: size mismatch");
