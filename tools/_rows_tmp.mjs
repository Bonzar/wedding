import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img,X0s,X1s,thr] = process.argv.slice(2);
const X0=+X0s,X1=+X1s,T=+(thr||215);
const s = PNG.sync.read(readFileSync(img));
const W=s.width,H=s.height;
const dark=(x,y)=>{const i=(y*W+x)<<2;const r=s.data[i],g=s.data[i+1];return (r<T&&g<T);};
let runs=[]; let inRun=false,start=0;
for(let y=0;y<H;y++){
  let c=0; for(let x=X0;x<X1;x++) if(dark(x,y)) c++;
  const isLine = c>(X1-X0)*0.5; // ruler spans most of band
  if(isLine&&!inRun){inRun=true;start=y;} else if(!isLine&&inRun){inRun=false;runs.push([start,y-1]);}
}
console.log(img.split('/').pop(),'ruler rows (band x'+X0+'..'+X1+'):');
for(const [a,b] of runs) console.log('  y',(a/2).toFixed(0)+'л..'+(b/2).toFixed(0)+'л center',((a+b)/4).toFixed(0)+'л');
