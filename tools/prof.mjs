import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img, y0s, y1s, fracS] = process.argv.slice(2);
const Y0=+y0s, Y1=+y1s, FRAC=fracS?+fracS:0.12;
const s = PNG.sync.read(readFileSync(img));
const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
const col=new Int32Array(W);
for(let y=Y0;y<Math.min(Y1,s.height);y++)for(let x=0;x<W;x++)if(nonPaper((y*W+x)<<2))col[x]++;
const thr=Math.max(2,Math.floor((Y1-Y0)*FRAC));
let runs=[],st=-1;
for(let x=0;x<W;x++){if(col[x]>=thr){if(st<0)st=x;}else{if(st>=0){runs.push([st,x-1]);st=-1;}}}
if(st>=0)runs.push([st,W-1]);
const merged=[];for(const r of runs){if(merged.length&&r[0]-merged[merged.length-1][1]<25)merged[merged.length-1][1]=r[1];else merged.push([...r]);}
console.log(img.split('/').pop(),'y',Y0,Y1,'thr',thr);
for(const[a,b]of merged)console.log(`  X ${a}..${b} w=${b-a}px(${((b-a)/2).toFixed(0)}лог) cx=${((a+b)/2).toFixed(0)}px(${((a+b)/4).toFixed(0)}лог)`);
