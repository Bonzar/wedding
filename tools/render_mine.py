#!/usr/bin/env python3
# Ре-рендер всех секций "как у меня" в refs/_mine/<name>.png (для пиксель-сверки с рефом).
# Использование: python3 tools/render_mine.py   (предполагает, что build_index.py уже отработал --dump)
import subprocess, glob, os
from PIL import Image

os.makedirs('refs/_mine', exist_ok=True)
for f in sorted(glob.glob('refs/sections/*.html')):
    n = os.path.basename(f)[:-5]
    subprocess.run(['qlmanage','-t','-s','900',f,'-o','/tmp'], capture_output=True)
    src = f'/tmp/{os.path.basename(f)}.png'
    if not os.path.exists(src):
        print('NO RENDER', n); continue
    im = Image.open(src).convert('RGB'); w,h = im.size; px = im.load(); bg = px[2,2]
    def colbg(x):
        return sum(1 for y in range(0,h,10) if abs(px[x,y][0]-bg[0])+abs(px[x,y][1]-bg[1])+abs(px[x,y][2]-bg[2])>26) < 1
    xs = [x for x in range(w) if not colbg(x)]
    if xs: im = im.crop((max(0,min(xs)-4), 0, min(w,max(xs)+5), h))
    px2 = im.load()
    def rowbg(y):
        return all(abs(px2[x,y][i]-bg[i])<14 for x in range(0,im.width,7) for i in range(3))
    bot = im.height
    for y in range(im.height-1, 0, -1):
        if not rowbg(y): bot = min(im.height, y+24); break
    im = im.crop((0,0,im.width,bot))
    im.save(f'refs/_mine/{n}.png')
    print('mine', n, im.size)
