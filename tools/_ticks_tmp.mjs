import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img,x0s,x1s,y0s,y1s]=process.argv.slice(2);
const X0=+x0s,X1=+x1s,Y0=+y0s,Y1=+y1s;
const s=PNG.sync.read(readFileSync(img));const W=s.width;
const red=(r,g,b)=>r>120&&g<r-50&&b<r-50;
const cyan=(r,g,b)=>g>120&&b>120&&r<g-50;
// per row count red & cyan in band; report rows that are local maxima (horizontal ruler lines)
for(let y=Y0;y<Y1;y++){let rr=0,cc=0;for(let x=X0;x<X1;x++){const i=(y*W+x)<<2;const r=s.data[i],g=s.data[i+1],b=s.data[i+2];if(red(r,g,b))rr++;if(cyan(r,g,b))cc++;}if(rr>40||cc>40)console.log(`y=${y}(${(y/2)|0}лог) red=${rr} cyan=${cc}`);}
