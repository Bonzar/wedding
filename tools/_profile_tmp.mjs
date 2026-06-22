import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img, y0s, y1s, step] = process.argv.slice(2);
const Y0=+y0s,Y1=+y1s,ST=+(step||10);
const s=PNG.sync.read(readFileSync(img));const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
// for each row, find leftmost and rightmost non-paper in left 60% of image (avoid right peony)
for(let y=Y0;y<Y1;y+=ST){let l=-1,r=-1,cnt=0;for(let x=0;x<Math.floor(W*0.6);x++){if(nonPaper((y*W+x)<<2)){if(l<0)l=x;r=x;cnt++;}}console.log(`y=${y}(${(y/2)|0}лог) l=${l} r=${r} cnt=${cnt}`);}
