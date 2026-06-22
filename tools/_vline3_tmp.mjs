import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img,thr] = process.argv.slice(2);
const T=+(thr||215);
const s = PNG.sync.read(readFileSync(img));
const W=s.width,H=s.height;
const dark=(x,y)=>{const i=(y*W+x)<<2;const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return (r<T&&g<T);};
let best={len:0,x:-1,top:-1,bot:-1};
for(let x=395;x<485;x++){
  let cur=0,curTop=0;
  for(let y=0;y<H;y++){
    if(dark(x,y)){ if(cur===0)curTop=y; cur++; if(cur>best.len){best={len:cur,x,top:curTop,bot:y};} }
    else cur=0;
  }
}
const f=(n)=>`${(n/2).toFixed(0)}л`;
console.log(`${img.split('/').pop()} thr${T}: vline x=${(best.x/2).toFixed(0)}л top=${f(best.top)} bot=${f(best.bot)} len=${f(best.len)}`);
