import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
// classify overlay: red=ref only, cyan=app only, black=match
const [img, x0s, x1s, y0s, y1s] = process.argv.slice(2);
const X0=+x0s,X1=+x1s,Y0=+y0s,Y1=+y1s;
const s=PNG.sync.read(readFileSync(img));const W=s.width;
function bbox(pred){let minX=1e9,maxX=-1,minY=1e9,maxY=-1,n=0;
 for(let y=Y0;y<Math.min(Y1,s.height);y++)for(let x=X0;x<Math.min(X1,W);x++){const i=(y*W+x)<<2;const r=s.data[i],g=s.data[i+1],b=s.data[i+2];if(pred(r,g,b)){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;n++;}}
 return{minX,maxX,minY,maxY,n};}
const red=(r,g,b)=>r>120&&g<r-50&&b<r-50;       // red = ref-only
const cyan=(r,g,b)=>g>120&&b>120&&r<g-50;        // cyan = app-only
const dark=(r,g,b)=>r<110&&g<110&&b<110;          // black = matched
const f=(o,t)=>`${t}: x ${o.minX}..${o.maxX} (w=${o.maxX-o.minX}px/${((o.maxX-o.minX)/2)|0}лог cx=${((o.minX+o.maxX)/4)|0}лог) y ${o.minY}..${o.maxY} (h=${((o.maxY-o.minY)/2)|0}лог top=${(o.minY/2)|0}лог) n=${o.n}`;
console.log(`region x[${X0}..${X1}] y[${Y0}..${Y1}]`);
console.log(f(bbox(red),'RED(ref)'));
console.log(f(bbox(cyan),'CYAN(app)'));
console.log(f(bbox(dark),'BLACK(match)'));
