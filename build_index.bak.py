#!/usr/bin/env python3
# Генератор index.html. Флюидная модель: .sheet 100%->max 900px, все размеры в cqw (база 440px=реф).
# Шрифты-аналоги рефа: Great Vibes (имена), Jost (Futura-капс), Arimo (Helvetica), Special Elite (счётчик).
import os, re

BASE = 440  # ширина-база (как реф); cqw = px/BASE*100

def svg(name):
    s = open(f'assets/illustrations/{name}.svg').read()
    return s[s.find('<svg'):]
def ill(name, h, extra=''):
    return f'<span class="ill" style="--h:{h}px;{extra}">{svg(name)}</span>'

# Сентябрь 2026 (Пн-первый). 1 сент = вторник -> 1 пустая. 30 дней. Выделяем 26.
lead, days, hi = 1, 30, 26
cells = ''.join('<i></i>' for _ in range(lead))
for d in range(1, days+1):
    cells += (f'<b class="hi">{d}</b>' if d == hi else f'<b>{d}</b>')

FONTFACE = open('assets/fonts/fonts.css').read().replace("url('fonts/", "url('assets/fonts/")

# --- CSS (px-значения; ниже автоконвертация px->cqw, кроме защищённого max-width) ---
CSS = """
:root{
  /* SEED — меняй два цвета, перекрашивается всё */
  --ink:#344f73;
  --paper:#f6f1e8;
  --ink-strong:color-mix(in srgb,var(--ink) 80%,#0f1620);
  --ink-muted:color-mix(in srgb,var(--ink) 60%,var(--paper));
  --text:color-mix(in srgb,var(--ink) 86%,var(--paper));
  --line:color-mix(in srgb,var(--ink) 20%,transparent);
  --paper-bright:color-mix(in srgb,var(--paper) 50%,#fff);
  --on-ink:var(--paper);
  --f-script:'Great Vibes',cursive;
  --f-label:'Jost',system-ui,sans-serif;
  --f-body:'Arimo','Helvetica Neue',Arial,sans-serif;
  --f-num:'Special Elite','Courier New',monospace;
  --gutter:26px; --sec:62px;
}
*{box-sizing:border-box}
html,body{margin:0}
body{background:color-mix(in srgb,var(--ink) 16%,#c7ccd2);color:var(--text);
  font-family:var(--f-body);-webkit-font-smoothing:antialiased}
.sheet{width:100%;margin:0 auto;min-height:100vh;background:var(--paper);
  container-type:inline-size;box-shadow:0 0 60px color-mix(in srgb,#000 22%,transparent)}
section{position:relative;overflow:hidden;padding:var(--sec) var(--gutter)}
.wrap{position:relative;margin:0 auto;text-align:center}

.ill{display:inline-flex;color:var(--ink);line-height:0}
.ill svg{display:block;width:auto!important;height:var(--h)!important}

.eyebrow{font-family:var(--f-label);text-transform:uppercase;letter-spacing:.25em;
  font-size:12.5px;font-weight:400;color:var(--ink-muted)}
.script{font-family:var(--f-script);font-weight:400;color:var(--ink-strong);line-height:1.02}
.amp{font-family:var(--f-body);font-weight:400;color:var(--ink-muted)}
.meta{font-family:var(--f-label);font-weight:300;font-size:16px;letter-spacing:.02em;color:var(--ink-muted)}
.body{font-family:var(--f-body);font-weight:400;font-size:14px;line-height:1.75;color:var(--text)}

.btn{display:inline-block;font-family:var(--f-label);font-size:15px;letter-spacing:.04em;
  font-weight:300;text-decoration:none;text-align:center;background:var(--ink);color:var(--on-ink);
  padding:16px 30px;border-radius:999px;border:none;cursor:pointer}
.hero .btn{display:block;width:76%;margin-left:auto;margin-right:auto}

.divider{display:flex;justify-content:center;margin:18px 0}
.gap-s{margin-top:9px}.gap-m{margin-top:18px}.gap-l{margin-top:30px}

/* hero */
.hero{padding-top:84px}
.h-names{font-size:48px;margin:0;transform:rotate(-8deg)}
.h-names .amp{font-size:.62em;color:var(--ink-muted);display:block;line-height:.8}
.photo{position:relative;width:72%;margin:34px auto 0;aspect-ratio:3/4}
.photo .frame{position:absolute;inset:-12px;color:var(--ink);pointer-events:none}
.photo .frame svg{width:100%!important;height:100%!important}
.photo .ph{position:absolute;inset:0;background:color-mix(in srgb,var(--ink) 8%,var(--paper-bright));
  display:flex;align-items:center;justify-content:center;font-family:var(--f-label);font-size:11px;
  letter-spacing:.16em;color:var(--ink-muted);text-transform:uppercase}
.scrollhint{margin-top:40px;font-family:var(--f-label);font-size:10px;letter-spacing:.26em;
  text-transform:uppercase;color:var(--ink-muted)}

/* countdown */
.cd{display:flex;justify-content:center;align-items:flex-start;gap:4px;margin-top:6px}
.cd .cell{min-width:62px;padding:0 4px}
.cd .num{font-family:var(--f-num);font-size:40px;color:var(--ink-strong);line-height:1;font-variant-numeric:tabular-nums}
.cd .lab{font-family:var(--f-label);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-muted);margin-top:10px}
.cd .sep{font-family:var(--f-num);font-size:32px;color:var(--line);margin-top:2px}

/* calendar */
.cal{max-width:300px;margin:0 auto;padding:18px 16px;border:1px solid var(--line);border-radius:14px}
.cal .mon{font-family:var(--f-label);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:13px}
.cal .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal .grid span{font-family:var(--f-label);font-size:10px;letter-spacing:.04em;color:var(--ink-muted);padding-bottom:7px}
.cal .grid b,.cal .grid i{font-family:var(--f-body);font-weight:400;font-size:13px;color:var(--text);aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-style:normal}
.cal .grid b.hi{color:var(--on-ink);background:var(--ink);border-radius:50%;font-weight:500}

/* venue */
.card{border:1px solid var(--line);border-radius:14px;padding:24px 20px;margin-top:18px}
"""

def cqw(m):
    return f'{float(m.group(1))/BASE*100:.3f}cqw'
CSS += '\n.sheet{max-width:__CAP__}'   # кап ширины — placeholder, переживёт конвертацию px->cqw ниже

def section(inner, cls=''): return f'<section class="{cls}"><div class="wrap">{inner}</div></section>'

hero = section(f"""
  <div class="eyebrow">Мы женимся</div>
  <div style="margin-top:37px">{ill('gazebo',263)}</div>
  <h1 class="script h-names" style="margin-top:30px">Владислав Навоян<br><span class="amp">&amp;</span><br>Ольга Финикова</h1>
  <p class="meta" style="margin-top:56px">26 сентября 2026 · Сочи</p>
  <a class="btn" style="margin-top:42px" href="#rsvp">Открыть приглашение</a>
  <div class="photo"><div class="ph">ваше фото</div><div class="frame">{svg('frame-corners')}</div></div>
  <div class="scrollhint">листайте вниз ⌄</div>
""", "hero")
invite = section(f"""
  <h2 class="script" style="font-size:42px">Дорогие гости</h2>
  <div class="divider">{ill('divider',16)}</div>
  <p class="body" style="max-width:330px;margin:0 auto">Мы приглашаем вас разделить с нами самый
  счастливый день нашей жизни — день, когда мы станем семьёй. Будем искренне рады видеть вас рядом.</p>
""")
countdown = section(f"""
  <div class="eyebrow gap-s">До свадьбы осталось</div>
  <div class="cd gap-l" id="cd">
    <div class="cell"><div class="num" id="cd-d">—</div><div class="lab">дней</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-h">—</div><div class="lab">часов</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-m">—</div><div class="lab">минут</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-s">—</div><div class="lab">секунд</div></div>
  </div>
""")
calendar = section(f"""
  <div class="eyebrow">Сохраните дату</div>
  <h2 class="script gap-s" style="font-size:40px">26 сентября</h2>
  <div class="cal gap-l">
    <div class="mon">Сентябрь 2026</div>
    <div class="grid">
      <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      {cells}
    </div>
  </div>
  <div class="divider gap-m">{ill('sprig',32)}</div>
""")
venue = section(f"""
  <div class="eyebrow">Место</div>
  <div class="gap-m">{ill('building',150)}</div>
  <h2 class="script gap-s" style="font-size:40px">Три кедра</h2>
  <div class="card">
    <p class="body" style="margin:0;color:var(--ink-strong)">Сочи · загородный комплекс «Три кедра»</p>
    <p class="meta gap-s" style="margin:0">Свадьба у моря</p>
    <a class="btn gap-m" href="https://yandex.ru/maps/239/sochi/?ll=39.714794%2C43.587780&amp;mode=poi&amp;poi%5Bpoint%5D=39.714849%2C43.587812&amp;poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1040306482&amp;z=19" target="_blank" rel="noopener">Открыть карту</a>
  </div>
""")

JS = """
(function(){var t=new Date('2026-09-26T16:00:00+03:00').getTime();
function p(n){return String(n).padStart(2,'0');}
function tick(){var d=t-Date.now();if(d<0)d=0;
document.getElementById('cd-d').textContent=Math.floor(d/86400000);
document.getElementById('cd-h').textContent=p(Math.floor(d%86400000/3600000));
document.getElementById('cd-m').textContent=p(Math.floor(d%3600000/60000));
document.getElementById('cd-s').textContent=p(Math.floor(d%60000/1000));}
tick();setInterval(tick,1000);})();
"""

html = f"""<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Влад & Оля · 26 сентября 2026</title>
<style>{FONTFACE}{CSS}</style></head>
<body><main class="sheet">
{hero}{invite}{countdown}{calendar}{venue}
</main><script>{JS}</script></body></html>"""
# конвертим px->cqw по ВСЕМУ html (CSS + инлайн --h беседки и зазоры hero), затем восстанавливаем кап
html = re.sub(r'(\d+(?:\.\d+)?)px', cqw, html)
html = html.replace('__CAP__', '900px')
open('index.html','w').write(html)
print('index.html:', len(html), 'bytes;  cqw base', BASE)
