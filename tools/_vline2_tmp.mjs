import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img] = process.argv.slice(2);
const s = PNG.sync.read(readFileSync(img));
const W=s.width,H=s.height;
const dark=(x,y)=>{const i=(y*W+x)<<2;const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return (r<170&&g<170&&b<190);};
let best={len:0,x:-1,top:-1,bot:-1};
for(let x=395;x<485;x++){
  let cur=0,curTop=0;
  for(let y=0;y<H;y++){
    if(dark(x,y)){ if(cur===0)curTop=y; cur++; if(cur>best.len){best={len:cur,x,top:curTop,bot:y};} }
    else cur=0;
  }
}
const f=(n)=>`${n}px(${(n/2).toFixed(0)}л)`;
console.log(`${img.split('/').pop()}: longest vline x=${best.x}(${(best.x/2).toFixed(0)}л) top=${f(best.top)} bot=${f(best.bot)} len=${f(best.len)}`);
