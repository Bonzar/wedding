import { PNG } from "pngjs";import { readFileSync } from "node:fs";
const [img,X0s,X1s,Y0s,Y1s,thS]=process.argv.slice(2);
const X0=+X0s,X1=+X1s,Y0=+Y0s,Y1=+Y1s,TH=+(thS||50);
const s=PNG.sync.read(readFileSync(img));const W=s.width;const span=X1-X0;
const np=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
let first=-1,last=-1;
for(let y=Y0;y<Y1;y++){let c=0;for(let x=X0;x<X1;x++)if(np((y*W+x)<<2))c++;if(c/span*100>=TH){if(first<0)first=y;last=y;}}
console.log(`${img.split('/').pop()} rows>=${TH}%: ${first}..${last} (${(first/2).toFixed(0)}л..${(last/2).toFixed(0)}л) h=${last-first}px(${((last-first)/2).toFixed(0)}л)`);
