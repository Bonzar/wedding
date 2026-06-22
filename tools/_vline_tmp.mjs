import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img] = process.argv.slice(2);
const s = PNG.sync.read(readFileSync(img));
const W=s.width,H=s.height;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
// find the vertical line: in center band x 420..460, for each row check if there's a dark pixel; report contiguous run + the x of it
let top=-1,bot=-1; const xs=[];
for(let y=0;y<H;y++){
  let found=-1;
  for(let x=410;x<470;x++){ if(nonPaper((y*W+x)<<2)){ found=x; break; } }
  if(found>=0){ if(top<0)top=y; bot=y; xs.push(found); }
}
xs.sort((a,b)=>a-b); const med=xs[xs.length>>1];
console.log(`${img}: vline top=${top}px(${(top/2).toFixed(0)}л) bot=${bot}px(${(bot/2).toFixed(0)}л) len=${(bot-top)}px(${((bot-top)/2).toFixed(0)}л) medianX=${med}px(${(med/2).toFixed(0)}л)`);
