import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
// rprof: row profile within an X range -> vertical runs (top/bottom) of non-paper content
const [img, x0s, x1s, y0s, y1s, fracS] = process.argv.slice(2);
const X0=+x0s, X1=+x1s, Y0=+y0s, Y1=+y1s, FRAC=fracS?+fracS:0.06;
const s = PNG.sync.read(readFileSync(img));
const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
const span=X1-X0;
const thr=Math.max(2,Math.floor(span*FRAC));
let runs=[],st=-1;
for(let y=Y0;y<Math.min(Y1,s.height);y++){
  let c=0;for(let x=X0;x<X1;x++)if(nonPaper((y*W+x)<<2))c++;
  if(c>=thr){if(st<0)st=y;}else{if(st>=0){runs.push([st,y-1]);st=-1;}}
}
if(st>=0)runs.push([st,Math.min(Y1,s.height)-1]);
const merged=[];for(const r of runs){if(merged.length&&r[0]-merged[merged.length-1][1]<20)merged[merged.length-1][1]=r[1];else merged.push([...r]);}
console.log(img.split('/').pop(),'X',X0,X1,'thr',thr);
for(const[a,b]of merged)console.log(`  Y ${a}..${b} h=${b-a}px(${((b-a)/2).toFixed(0)}лог) top=${a}px(${(a/2).toFixed(0)}лог)`);
