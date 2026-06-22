import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img]=process.argv.slice(2);
const s=PNG.sync.read(readFileSync(img));const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
// vertical line: scan columns x 380..500, count non-paper over y 400..1100, find tall thin column
let best=0,bx=0;
for(let x=380;x<500;x++){let c=0;for(let y=400;y<1100;y++)if(nonPaper((y*W+x)<<2))c++;if(c>best){best=c;bx=x;}}
console.log(`${img.split('/').pop()} central vline col x=${bx}px (${(bx/2)|0}лог) len=${best}px(${(best/2)|0}лог)`);
// also find vertical extent of that column
let top=-1,bot=-1;for(let y=200;y<1300;y++){if(nonPaper((y*W+bx)<<2)){if(top<0)top=y;bot=y;}}
console.log(`  extent y ${top}..${bot} (${(top/2)|0}..${(bot/2)|0}лог) h=${((bot-top)/2)|0}лог`);
