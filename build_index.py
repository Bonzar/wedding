#!/usr/bin/env python3
# Генератор index.html. Флюид: .sheet 100%->max 900px; ВСЕ px -> cqw (база 440=реф).
# Шрифты: Great Vibes (script), Jost=Futura (label), Arimo=Helvetica (body), Special Elite (num).
# Секции собраны по пиксельным спекам рефа lysfilter design06 (refs/ref-render/specs.json).
import os, re
from datetime import datetime, timezone, timedelta
BASE = 440

# начальные значения счётчика на этапе сборки (чтобы цифры были видны и в статике; JS обновляет вживую)
_tgt = datetime(2026, 9, 26, 16, 0, 0, tzinfo=timezone(timedelta(hours=3)))
_S = max(0, int((_tgt - datetime.now(timezone.utc)).total_seconds()))
CD = (_S // 86400, (_S // 3600) % 24, (_S // 60) % 60, _S % 60)

def svg(name):
    s = open(f'assets/illustrations/{name}.svg').read()
    return s[s.find('<svg'):]
def ill(name, h, cls='', extra=''):
    return f'<span class="ill {cls}" style="--h:{h}px;{extra}">{svg(name)}</span>'
def photo(wpct, aspect, label='ваше фото', extra=''):
    return (f'<div class="photo" style="width:{wpct}%;aspect-ratio:{aspect};{extra}">'
            f'<div class="ph">{label}</div><div class="frame">{svg("frame-corners")}</div></div>')

def calcells():
    lead, days, hi = 1, 30, 26   # Сентябрь 2026: 1 сент = вт -> 1 пустая
    c = ''.join('<i></i>' for _ in range(lead))
    for d in range(1, days+1):
        c += (f'<b class="hi">{d}</b>' if d == hi else f'<b>{d}</b>')
    return c

FONTFACE = open('assets/fonts/fonts.css').read().replace("url('fonts/", "url('assets/fonts/")

CSS = """
:root{
  --ink:#344f73; --paper:#f6f1e8;
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
  --gutter:26px;
}
*{box-sizing:border-box}
html,body{margin:0}
body{background:color-mix(in srgb,var(--ink) 16%,#c7ccd2);color:var(--text);
  font-family:var(--f-body);-webkit-font-smoothing:antialiased}
.sheet{width:100%;margin:0 auto;min-height:100vh;background:var(--paper);
  container-type:inline-size;box-shadow:0 0 60px color-mix(in srgb,#000 22%,transparent)}
section{position:relative;overflow:hidden;padding:60px var(--gutter)}
.wrap{position:relative;margin:0 auto;text-align:center}

.ill{display:inline-flex;color:var(--ink);line-height:0;vertical-align:top}
.ill svg{display:block;width:auto!important;height:var(--h)!important}

.eyebrow{font-family:var(--f-label);text-transform:uppercase;letter-spacing:.25em;
  font-size:12.5px;font-weight:400;color:var(--ink-muted)}
.script{font-family:var(--f-script);font-weight:400;color:var(--ink-strong);line-height:1.02}
.amp{font-family:var(--f-body);font-weight:400;color:var(--ink-muted)}
.meta{font-family:var(--f-label);font-weight:300;font-size:16px;letter-spacing:.02em;color:var(--ink-muted)}
.body{font-family:var(--f-body);font-weight:400;font-size:14px;line-height:1.7;color:var(--text)}
.sub{font-family:var(--f-label);font-weight:400;font-size:15px;letter-spacing:.04em;
  text-transform:uppercase;color:var(--ink)}

.btn{display:inline-block;font-family:var(--f-label);font-size:15px;letter-spacing:.04em;
  font-weight:300;text-decoration:none;text-align:center;background:var(--ink);color:var(--on-ink);
  padding:15px 30px;border-radius:999px;border:none;cursor:pointer}

.divider{display:flex;justify-content:center;margin:18px 0;color:var(--ink)}
.gap-s{margin-top:9px}.gap-m{margin-top:18px}.gap-l{margin-top:30px}

/* photo frame */
.photo{position:relative;margin:0 auto}
.photo .frame{position:absolute;inset:-14px;color:var(--ink);pointer-events:none}
.photo .frame svg{width:100%!important;height:100%!important}
.photo .ph{position:absolute;inset:0;background:color-mix(in srgb,var(--ink) 9%,var(--paper-bright));
  display:flex;align-items:center;justify-content:center;font-family:var(--f-label);font-size:11px;
  letter-spacing:.16em;color:var(--ink-muted);text-transform:uppercase}

/* hero */
.hero{padding-top:84px}
.h-names{font-size:48px;margin:0;transform:rotate(-8deg)}
.h-names .amp{font-size:.62em;color:var(--ink-muted);display:block;line-height:.8}
.hero .btn{display:block;width:76%;margin-left:auto;margin-right:auto}
.scrollhint{margin-top:40px;font-family:var(--f-label);font-size:10px;letter-spacing:.26em;
  text-transform:uppercase;color:var(--ink-muted)}

/* countdown */
.countdown .corner{position:absolute;top:6px;left:6px;color:var(--ink)}
.cd{display:flex;justify-content:center;align-items:flex-start;gap:2px;margin-top:18px}
.cd .cell{min-width:58px;padding:0 4px}
.cd .num{font-family:var(--f-num);font-size:34px;color:var(--ink-strong);line-height:1;font-variant-numeric:tabular-nums}
.cd .lab{font-family:var(--f-label);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted);margin-top:9px}
.cd .sep{font-family:var(--f-num);font-size:28px;color:var(--line);margin-top:2px}

/* calendar */
.cal{position:relative;max-width:300px;margin:0 auto;padding:20px 18px;border:1px solid var(--line);border-radius:16px}
.cal .mon{font-family:var(--f-label);font-size:14px;letter-spacing:.04em;color:var(--ink-strong);margin-bottom:14px}
.cal .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal .grid span{font-family:var(--f-label);font-size:11px;letter-spacing:.04em;color:var(--ink);padding-bottom:8px}
.cal .grid b,.cal .grid i{font-family:var(--f-label);font-weight:300;font-size:14px;color:var(--ink);aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-style:normal}
.cal .grid b.hi{color:var(--on-ink);background:var(--ink);border-radius:50%;font-weight:400}
.cal-side{position:absolute;top:50%;transform:translateY(-50%);color:var(--ink)}
.cal-side.l{left:-10px}.cal-side.r{right:-10px}
.cal-note{font-family:var(--f-label);font-weight:300;font-size:14px;letter-spacing:.02em;color:var(--ink-muted);margin-top:14px}

/* timeline */
.tl{position:relative;max-width:330px;margin:30px auto 0}
.tl::before{content:"";position:absolute;left:50%;top:6px;bottom:6px;width:1px;background:var(--line)}
.tl-item{position:relative;width:50%;padding:0 16px;margin-top:30px}
.tl-item:first-child{margin-top:0}
.tl-item.l{text-align:right}
.tl-item.r{margin-left:50%;text-align:left}
.tl-time{font-family:var(--f-label);font-weight:300;font-size:12px;letter-spacing:.04em;color:var(--ink-muted)}
.tl-title{font-family:var(--f-label);font-weight:400;font-size:16px;letter-spacing:.02em;color:var(--ink-strong);margin-top:3px}

/* details */
.details{text-align:left}
.details .wrap{text-align:left}
.det-blk{margin-top:22px}
.det-blk .body{margin-top:8px}

/* attire palette */
.palette{display:flex;justify-content:center;gap:10px;margin-top:16px}
.palette i{width:34px;height:34px;border-radius:50%;display:block;box-shadow:inset 0 0 0 2px var(--paper-bright)}
.palette i:nth-child(1){background:var(--ink)}
.palette i:nth-child(2){background:color-mix(in srgb,var(--ink) 78%,var(--paper))}
.palette i:nth-child(3){background:color-mix(in srgb,var(--ink) 58%,var(--paper))}
.palette i:nth-child(4){background:color-mix(in srgb,var(--ink) 40%,var(--paper))}
.palette i:nth-child(5){background:color-mix(in srgb,var(--ink) 24%,var(--paper))}

/* gift card */
.card{position:relative;border:1px solid var(--line);border-radius:16px;padding:26px 22px;margin:0 auto}

/* journey */
.journey .step{display:flex;align-items:center;gap:14px;margin-top:30px}
.journey .step.rev{flex-direction:row-reverse}
.journey .ph-wrap{flex:0 0 56%}
.journey .deco{flex:1;display:flex;justify-content:center;color:var(--ink)}
.journey .cap{font-family:var(--f-body);font-style:italic;font-size:13px;line-height:1.6;color:var(--ink-muted);margin-top:10px}
.journey .arrow{display:flex;justify-content:center;color:var(--ink);margin:4px 0}
.journey .foot{display:flex;justify-content:center;color:var(--ink);margin-top:26px}

/* rsvp */
.rsvp{position:relative;min-height:340px}
.rsvp .tree{position:absolute;left:-30px;bottom:-10px;color:var(--ink)}
.rsvp .rwrap{position:relative;text-align:right;padding:54px 6px 54px 42%}
.rsvp .rttl{font-family:var(--f-label);font-weight:500;font-size:30px;letter-spacing:.04em;color:var(--ink-strong)}

/* closing */
.closing .c-names{font-family:var(--f-script);font-size:46px;color:var(--ink-strong);line-height:1;margin-top:20px}

/* survey (RSVP) — внутри .sheet, px -> cqw как у остальных секций */
.survey .rsvp-list{display:flex;flex-direction:column;gap:0;max-width:80%;margin:30px auto 0;text-align:left}
.rsvp-guest{display:flex;align-items:center;gap:12px;width:100%;background:none;border:none;border-bottom:1px solid var(--line);padding:14px 2px;cursor:pointer;text-align:left;font:inherit;color:var(--text)}
.rsvp-guest .rsvp-sprig{width:22px;height:22px;flex:0 0 auto;color:var(--ink)}
.rsvp-guest-ttl{flex:1;font-family:var(--f-label);font-weight:300;font-size:15px;letter-spacing:.02em;color:var(--ink-strong)}
.rsvp-guest-ttl b{font-weight:500}
.rsvp-guest-state{font-family:var(--f-label);font-size:13px;color:var(--ink-muted);text-decoration:underline;text-underline-offset:2px}
.rsvp-guest[data-answered="1"] .rsvp-guest-state{color:var(--ink)}
.rsvp-note{font-family:var(--f-body);font-size:14px;line-height:1.7;color:var(--ink-muted);max-width:80%;margin:30px auto 0}

/* rsvp modal — рендерится в body ВНЕ .sheet, единицы rem (px->cqw их не трогает) */
.rsvp-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1.25rem;background:color-mix(in srgb,#0f1620 55%,transparent);overflow-y:auto}
.rsvp-overlay[hidden]{display:none}
.rsvp-modal{position:relative;width:100%;max-width:27.5rem;margin:auto;background:var(--paper-bright);color:var(--text);border-radius:1.375rem;padding:1.875rem 1.625rem;box-shadow:0 1.5rem 3.75rem rgba(15,22,32,.35);font-family:var(--f-body)}
.rsvp-close{position:absolute;top:.875rem;right:.875rem;width:2.125rem;height:2.125rem;border-radius:50%;border:none;background:color-mix(in srgb,var(--ink) 10%,var(--paper));color:var(--ink-strong);font-size:1.25rem;line-height:1;cursor:pointer}
.rsvp-m-ttl{font-family:var(--f-label);font-weight:500;font-size:1.3125rem;letter-spacing:.01em;color:var(--ink-strong);margin:0 2.5rem .25rem 0}
.rsvp-q{margin-top:1.25rem}
.rsvp-q[hidden]{display:none}
.rsvp-q-ttl{font-family:var(--f-label);font-weight:500;font-size:.9375rem;color:var(--ink-strong);margin:0 0 .625rem}
.rsvp-opt-hint{font-weight:400;color:var(--ink-muted)}
.rsvp-opt{display:flex;align-items:center;gap:.625rem;padding:.375rem 0;font-size:.9375rem;color:var(--text);cursor:pointer}
.rsvp-opt input{width:1.125rem;height:1.125rem;accent-color:var(--ink);flex:0 0 auto;margin:0}
.rsvp-checks{display:grid;grid-template-columns:1fr 1fr;gap:0 1.125rem}
.rsvp-textarea{width:100%;border:.0625rem solid var(--line);border-radius:.75rem;padding:.625rem;font:inherit;font-size:.875rem;color:var(--text);background:var(--paper);resize:vertical}
.rsvp-save{display:block;width:100%;margin-top:1.5rem;font-family:var(--f-label);letter-spacing:.04em;font-size:1rem;padding:.8125rem;border-radius:6.25rem;background:var(--ink);color:var(--on-ink);border:none;cursor:pointer}
.rsvp-save:disabled{opacity:.6;cursor:default}
.rsvp-msg{margin:.75rem 0 0;font-size:.8125rem;color:var(--ink-muted);text-align:center}
.rsvp-msg.err{color:#b03b3b}
@media(max-width:23.75rem){.rsvp-checks{grid-template-columns:1fr}}
"""

def cqw(m):
    return f'{float(m.group(1))/BASE*100:.3f}cqw'
CSS += '\n.sheet{max-width:__CAP__}'

def section(inner, cls=''):
    return f'<section class="{cls}"><div class="wrap">{inner}</div></section>'

# ---------- SECTIONS (по спекам рефа) ----------
hero = section(f"""
  <div class="eyebrow">Мы женимся</div>
  <div style="margin-top:37px">{ill('gazebo',263)}</div>
  <h1 class="script h-names" style="margin-top:30px">Владислав Навоян<span class="amp">&amp;</span>Ольга Финикова</h1>
  <p class="meta" style="margin-top:56px">26 сентября 2026 · Сочи</p>
  <a class="btn" style="margin-top:42px" href="#rsvp">Открыть приглашение</a>
  {photo(72,'3/4')}
  <div class="scrollhint">листайте вниз ⌄</div>
""", "hero")

wedding_of = section(f"""
  <div style="position:relative;width:46%;margin:0 auto">{photo(100,'181/194','')}</div>
  <div class="eyebrow" style="margin-top:39px">Свадьба</div>
  <h2 class="script" style="font-size:56px;margin-top:20px">Владислав <span class="amp">&amp;</span> Ольга</h2>
""", "wedding-of")

countdown = section(f"""
  <div class="corner">{ill('bird-branch',80)}</div>
  <div class="eyebrow" style="margin-top:14px">Скоро наш день</div>
  <div class="cd" id="cd">
    <div class="cell"><div class="num" id="cd-d">{CD[0]}</div><div class="lab">Дни</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-h">{CD[1]:02d}</div><div class="lab">Часы</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-m">{CD[2]:02d}</div><div class="lab">Минуты</div></div>
    <div class="sep">:</div>
    <div class="cell"><div class="num" id="cd-s">{CD[3]:02d}</div><div class="lab">Секунды</div></div>
  </div>
""", "countdown")

calendar = section(f"""
  <div class="divider" style="margin:0 0 6px">{ill('flourish-thin',12)}</div>
  <div class="cal" style="margin-top:14px">
    <div class="mon">Сентябрь 2026</div>
    <div class="grid">
      <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      {calcells()}
    </div>
    <div class="cal-note">26 сентября 2026 · день нашей свадьбы</div>
  </div>
  <div class="divider" style="margin-top:24px">{ill('flourish-thin',12)}</div>
""", "calendar")

location = section(f"""
  <div class="eyebrow">Место</div>
  <div style="margin-top:24px">{ill('building',150)}</div>
  <p class="meta" style="margin-top:20px;max-width:88%;margin-left:auto;margin-right:auto">Загородный комплекс «Три кедра», Сочи</p>
  <a class="btn" style="margin-top:18px" href="https://yandex.ru/maps/239/sochi/?text=Три+кедра+Сочи" target="_blank" rel="noopener">Открыть на карте</a>
""", "location")

_tl = [("17:00","Церемония"),("18:00","Фотосессия"),("19:00","Праздничный ужин"),
       ("20:00","Тосты и поздравления"),("22:00","Танцы")]
tl_items = ''.join(
    f'<div class="tl-item {"l" if i%2==0 else "r"}"><div class="tl-time">{t}</div><div class="tl-title">{n}</div></div>'
    for i,(t,n) in enumerate(_tl))
timeline = section(f"""
  <div style="position:absolute;top:4px;left:-14px">{ill('floral-spray',96)}</div>
  <div style="position:absolute;top:4px;right:-14px;transform:scaleX(-1)">{ill('floral-spray',80)}</div>
  <div class="eyebrow">Программа дня</div>
  <div class="tl">{tl_items}</div>
""", "timeline")

details = section(f"""
  <div style="text-align:center"><div class="eyebrow">Детали торжества</div></div>
  <div class="det-blk">
    <div class="sub">Размещение</div>
    <p class="body">Для гостей предусмотрено проживание в загородном комплексе «Три кедра» по специальному тарифу. При бронировании укажите, что вы с нашей свадьбы.</p>
  </div>
  <div class="det-blk">
    <div class="sub">Трансфер</div>
    <p class="body">Площадка примерно в 30 минутах от аэропорта и вокзала. Для гостей будет организован трансфер, на территории есть парковка.</p>
  </div>
  <div style="text-align:center;margin-top:26px">{ill('building',123)}</div>
""", "details")

attire = section(f"""
  <div class="eyebrow">Дресс-код</div>
  <div style="margin-top:14px">{ill('attire-pair',118)}</div>
  <p class="body" style="margin-top:14px;max-width:84%;margin-left:auto;margin-right:auto">Будем благодарны, если вы поддержите атмосферу праздника нарядами в мягких, приглушённых тонах — без ярких и кричащих цветов.</p>
  <div class="palette"><i></i><i></i><i></i><i></i><i></i></div>
""", "attire")

gift = section(f"""
  <div class="card" style="width:74%">
    <div class="eyebrow">Свадебный подарок</div>
    <div style="margin-top:16px">{ill('gift-money',70)}</div>
    <p class="body" style="margin-top:14px">Ваше присутствие — самый ценный подарок для нас. Если захотите порадовать нас, будем благодарны вкладу в наше общее будущее.</p>
    <a class="btn" style="margin-top:16px;width:44%" href="#">Подарить</a>
  </div>
""", "gift")

journey = section(f"""
  <div class="eyebrow">История любви</div>
  <div class="step">
    <div class="ph-wrap">{photo(100,'4/5')}<p class="cap">Так мы впервые встретились — и тогда ещё не знали, что это начало чего-то большого.</p></div>
    <div class="deco">{ill('peony',144)}</div>
  </div>
  <div class="arrow">{ill('arrow-dashed-curved',56)}</div>
  <div class="step rev">
    <div class="ph-wrap">{photo(100,'4/5')}<p class="cap">Мы пошли по жизни вдвоём — деля смех, мечты и тёплые воспоминания.</p></div>
    <div class="deco">{ill('butterfly',120)}</div>
  </div>
  <div class="arrow">{ill('arrow-dashed-curved',56,extra='transform:scaleX(-1)')}</div>
  <div class="step">
    <div class="ph-wrap">{photo(100,'4/5')}<p class="cap">И однажды искреннее «да» скрепило наше обещание быть вместе.</p></div>
    <div class="deco">{ill('floral-spray',144)}</div>
  </div>
  <div class="foot">{ill('building',96)}</div>
""", "journey")

rsvp = '<section class="rsvp" id="rsvp"><div class="tree">'+ill('tree-large',329)+'</div>'+ \
  '<div class="rwrap">'+ \
  '<div class="rttl">RSVP</div>'+ \
  '<p class="body" style="margin-top:13px;color:var(--ink-muted)">Пожалуйста, подтвердите своё присутствие до 1 сентября 2026 года — это поможет нам всё подготовить.</p>'+ \
  '<a class="btn" style="margin-top:14px;letter-spacing:.16em;padding-left:34px;padding-right:34px" href="#survey">Ответить</a>'+ \
  '</div></section>'

survey = ('<section class="survey" id="survey"><div class="wrap">'
  '<div class="eyebrow">RSVP</div>'
  '<h2 class="script gap-s" style="font-size:42px">Для нас важно знать</h2>'
  '<p class="body gap-m" style="max-width:84%;margin-left:auto;margin-right:auto">Пожалуйста, ответьте на несколько вопросов, чтобы подтвердить своё присутствие. Ваш ответ очень поможет нам в подготовке к свадьбе.</p>'
  '<div id="rsvp-list" class="rsvp-list" aria-live="polite"></div>'
  '</div></section>')

closing = section(f"""
  <p class="body" style="margin-top:40px;max-width:86%;margin-left:auto;margin-right:auto">Мы благодарны за вашу любовь и поддержку. Ваше присутствие сделает этот день по-настоящему особенным — и мы с радостью разделим его с вами.</p>
  <div class="c-names">Владислав <span class="amp" style="font-family:var(--f-body);color:var(--ink-muted)">&amp;</span> Ольга</div>
  <div style="display:flex;justify-content:center;gap:24px;margin-top:24px;color:var(--ink-muted)">{ill('bird',64)}{ill('sprig',34)}{ill('bird',64,extra='transform:scaleX(-1)')}</div>
""", "closing")

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
<title>Владислав &amp; Ольга · 26 сентября 2026</title>
<style>{FONTFACE}{CSS}</style></head>
<body><main class="sheet">
{hero}{wedding_of}{countdown}{calendar}{location}{timeline}{details}{attire}{gift}{journey}{rsvp}{survey}{closing}
</main><script>{JS}</script>
<script type="module" src="assets/rsvp.js"></script></body></html>"""
html = re.sub(r'(\d+(?:\.\d+)?)px', cqw, html)
html = html.replace('__CAP__', '900px')
open('index.html','w').write(html)
print('index.html:', len(html), 'bytes;  sections: 12;  cqw base', BASE)

# --- режим --dump: standalone-файл на каждую секцию (px@440, шрифты base64) для пиксель-сверки ---
SECTIONS = {'hero':hero,'wedding-of':wedding_of,'countdown':countdown,'calendar':calendar,
  'location':location,'timeline':timeline,'details':details,'attire':attire,'gift':gift,
  'journey':journey,'rsvp':rsvp,'survey':survey,'closing':closing}
import sys
if '--dump' in sys.argv:
    import base64
    def _emb(m):
        try: return f"url(data:font/woff2;base64,{base64.b64encode(open(m.group(1),'rb').read()).decode()})"
        except Exception: return m.group(0)
    ffi = re.sub(r"url\('(assets/fonts/[^']+\.woff2)'\)", _emb, FONTFACE)
    kit_render = (ffi + CSS).replace('__CAP__','440px') + '.sheet{min-height:0;box-shadow:none}'  # для standalone-рендера агентов
    open('refs/kit.css','w').write(ffi + CSS)   # общий kit (px@440, __CAP__ цел) — для финального ассемблера
    open('refs/_js.txt','w').write(JS)
    os.makedirs('refs/sections', exist_ok=True)
    for nm, mk in SECTIONS.items():
        doc = (f'<!doctype html><html lang="ru"><head><meta charset="utf-8">'
               f'<style>{kit_render}</style><style id="ov"></style></head>'
               f'<body><main class="sheet">{mk}</main></body></html>')
        open(f'refs/sections/{nm}.html','w').write(doc)
    print('dumped', len(SECTIONS), 'section files + refs/kit.css + refs/_js.txt')
