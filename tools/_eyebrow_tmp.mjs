import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img,x0s,x1s,y0s,y1s]=process.argv.slice(2);
const X0=+x0s,X1=+x1s,Y0=+y0s,Y1=+y1s;
const s=PNG.sync.read(readFileSync(img));const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
let first=-1,last=-1;
for(let y=Y0;y<Y1;y++){let c=0;for(let x=X0;x<X1;x++)if(nonPaper((y*W+x)<<2))c++;if(c>15){if(first<0)first=y;last=y;}}
console.log(`${img.split('/').pop()} eyebrow-band x[${X0}..${X1}] y[${Y0}..${Y1}]: text rows ${first}..${last} (${(first/2)|0}..${(last/2)|0}лог)`);
