#!/usr/bin/env python3
# Сборка финального index.html из доведённых файлов секций (refs/sections/<name>.html) + общий kit.
# Берёт разметку <main class="sheet">...</main> и scoped-CSS <style id="ov">...</style> из каждого файла,
# склеивает в порядке секций, конвертит px->cqw, ставит кап 900px.
import re, os

ORDER = ['hero','wedding-of','countdown','calendar','location','timeline',
         'details','attire','gift','journey','rsvp','survey','closing']

import base64
def _emb(m):
    try: return f"url(data:font/woff2;base64,{base64.b64encode(open(m.group(1),'rb').read()).decode()})"
    except Exception: return m.group(0)
# ШРИФТЫ: всегда строим заново из ТЕКУЩИХ файлов (в kit.css может быть устаревший baked-base64)
fontface = open('assets/fonts/fonts.css').read().replace("url('fonts/", "url('assets/fonts/")
fontface = re.sub(r"url\(\s*['\"]?(assets/fonts/[^'\")]+\.woff2)['\"]?\)", _emb, fontface)
kit = re.sub(r'@font-face\{[^}]*\}', '', open('refs/kit.css').read())  # выкидываем старые @font-face из kit
js  = open('refs/_js.txt').read()

markups, ovs = [], []
for nm in ORDER:
    _p = f'refs/sections/{nm}.html'
    if not os.path.exists(_p):
        print('skip missing section:', nm); continue
    h = open(_p, encoding='utf-8').read()
    m = re.search(r'<main class="sheet">(.*)</main>', h, re.S)
    markups.append(m.group(1).strip() if m else f'<!-- MISSING {nm} -->')
    o = re.search(r'<style id="ov">(.*?)</style>', h, re.S)
    if o and o.group(1).strip():
        ovs.append(f'/* {nm} */\n' + o.group(1).strip())

css = kit + '\n' + '\n'.join(ovs)   # БЕЗ шрифтов — их вклеим после px->cqw
html = (f'<!doctype html>\n<html lang="ru"><head>\n'
        f'<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
        f'<title>Владислав &amp; Ольга · 26 сентября 2026</title>\n'
        f'<style>__FONTS__\n{css}</style></head>\n'
        f'<body><main class="sheet">\n{"".join(markups)}\n</main><script>{js}</script>\n'
        f'<script type="module" src="assets/rsvp.js"></script></body></html>')

html = re.sub(r'(\d+(?:\.\d+)?)px', lambda m: f'{float(m.group(1))/440*100:.3f}cqw', html)
html = html.replace('__FONTS__', fontface)   # base64-шрифты ПОСЛЕ px->cqw (иначе px внутри base64 портит шрифт)
html = html.replace('__CAP__', '900px')
open('index.html','w').write(html)
print('assembled index.html:', len(html), 'bytes; sections:', len(markups), '; overrides:', len(ovs))
