import { PNG } from "pngjs";import { readFileSync } from "node:fs";
const [img,X0s,X1s,Y0s,Y1s]=process.argv.slice(2);
const X0=+X0s,X1=+X1s,Y0=+Y0s,Y1=+Y1s;
const s=PNG.sync.read(readFileSync(img));const W=s.width;
const np=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
const span=X1-X0;
for(let y=Y0;y<Y1;y++){let c=0;for(let x=X0;x<X1;x++)if(np((y*W+x)<<2))c++;const pct=(c/span*100)|0;console.log(`y=${y}(${(y/2).toFixed(0)}л) ${('#'.repeat(pct/3|0)).padEnd(34)} ${pct}%`);}
