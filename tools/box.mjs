import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [img, x0s, x1s, y0s, y1s, minS] = process.argv.slice(2);
const X0=+x0s, X1=+x1s, Y0=+y0s, Y1=+y1s, MIN=minS?+minS:3;
const s = PNG.sync.read(readFileSync(img));
const W=s.width;
const nonPaper=(i)=>{const r=s.data[i],g=s.data[i+1],b=s.data[i+2];return r<200||(Math.max(r,g,b)-Math.min(r,g,b))>30;};
const colCount=new Int32Array(W);
let minY=-1,maxY=-1;
for(let y=Y0;y<Math.min(Y1,s.height);y++){let row=0;for(let x=X0;x<X1;x++)if(nonPaper((y*W+x)<<2)){row++;colCount[x]++;}if(row>=MIN){if(minY<0)minY=y;maxY=y;}}
let minX=-1,maxX=-1;for(let x=X0;x<X1;x++)if(colCount[x]>=MIN){if(minX<0)minX=x;maxX=x;}
const f=(n)=>`${n}px(${(n/2).toFixed(0)}лог)`;
console.log(`${img.split('/').pop()} clamp X[${X0},${X1}) Y[${Y0},${Y1}) min=${MIN}`);
console.log(`  X ${minX}..${maxX} w=${f(maxX-minX)} cx=${((minX+maxX)/2).toFixed(0)}px(${((minX+maxX)/4).toFixed(0)}лог)`);
console.log(`  Y ${minY}..${maxY} h=${f(maxY-minY)} top=${minY}px(${(minY/2).toFixed(0)}лог)`);
