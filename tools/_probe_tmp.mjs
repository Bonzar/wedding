import { PNG } from "pngjs";import { readFileSync } from "node:fs";
const [img,xS,Y0s,Y1s]=process.argv.slice(2);const x=+xS,Y0=+Y0s,Y1=+Y1s;
const s=PNG.sync.read(readFileSync(img));const W=s.width;
for(let y=Y0;y<Y1;y+=8){const i=(y*W+x)<<2;console.log(`y=${y}(${(y/2)|0}л) rgb(${s.data[i]},${s.data[i+1]},${s.data[i+2]})`);}
