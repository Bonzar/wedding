# Свадебный лендинг — Влад & Оля · 26 сентября 2026 · Сочi «Три кедра»

Одностраничное приглашение на свадьбу. **Один источник правды — React-исходники**
в `src/`; собирается Vite'ом, деплоится на GitHub Pages через CI. Никаких
генераторов `index.html` и «двух сборок» больше нет.

## Стек

- **Vite + React 18 + TypeScript**
- **MobX** — состояние RSVP (`RsvpStore`) и палитры (`ThemeStore`)
- **CSS Modules + дизайн-токены** (CSS-переменные), флюид-вёрстка
- **Playwright** — скриншот-тесты (визуальная регрессия) + e2e RSVP
- **Vitest** — юнит-тесты (герметичные, сеть мокается)
- RSVP-бэкенд — Yandex Cloud Function-прокси (`rsvp-function/`, деплоится отдельно)

Node — **22** (см. `.nvmrc`). `nvm use`.

## Команды

```bash
npm run dev          # дев-сервер (HMR)
npm run build        # tsc --noEmit && vite build -> dist/
npm run preview      # предпросмотр собранного dist/
npm run typecheck    # проверка типов

npm test             # юнит-тесты (vitest, герметичные)
npm run test:rsvp-fn # тесты функции-прокси (герметичные)
npm run test:screens # скриншот + e2e (Playwright); сеть RSVP мокается
npm run screens:update  # перегенерировать эталоны скринов
npm run parity       # сверка React-секций с эталоном refs/sections (отчёт)
```

## Структура

```
src/
  design-system/     # ДИЗАЙН-СИСТЕМА: токены, шрифты, примитивы
    tokens.css       #   палитра (2 seed-токена) + 5 тем (data-theme) + флюид-юнит --u
    base.css         #   .sheet (флюид-контейнер), типографика-утилиты
    Engraving.tsx    #   реестр 42 SVG-гравюр (currentColor-темизация)
    PhotoFrame, Section/Ghost, Button, Divider, Text  # примитивы
  content/wedding.ts # КОНТЕНТ: имена, дата, место, программа, тексты — единый источник
  sections/          # 13 секций-компонентов (Hero … Closing), каждая = .tsx + .module.css
  rsvp/              # RSVP: чистая логика (api.ts), MobX-стор, модалка, список гостей
  stores/            # RootStore + ThemeStore + React-контекст
  components/ThemeBar.tsx   # переключатель палитры
tests/               # Playwright: screenshot/ (golden) + rsvp-flow (поведение)
rsvp-function/       # Yandex Cloud Function (прокси к Craft) — без изменений
tools/parity.mjs     # инструмент сверки рендера с рефами
```

### Флюид-вёрстка (важно)

Макет нарисован при ширине листа **440px**. Любой размер «из макета» в CSS
пишется как `calc(N * var(--u))`, где `--u = calc(100cqw / 440)`. Лист
(`.sheet`, `container-type: inline-size`) плавно масштабируется от 440 до 900px,
сохраняя пропорции. Это точная замена прежнему `px -> cqw`-постпроцессору.

### Конфигурируемая палитра

Вся страница окрашивается из двух токенов `--ink` / `--paper`. Темы
(`indigo / bordo / graphite / forest / sepia`) переключаются через `data-theme`
на `<html>` (см. `ThemeStore`, плавающий `ThemeBar`).

## RSVP

Гость открывает персональную ссылку `?inv=ТОКЕН`. Фронт ходит ТОЛЬКО в
функцию-прокси (`rsvp-function/`), которая держит секретный Craft-линк на сервере
(в коде сайта его нет). Логика разнесена: чистые функции (`src/rsvp/api.ts`) +
`RsvpStore` (MobX) — всё тестируется без сети и без живого Craft.

Деплой функции — отдельно, см. [`rsvp-function/README.md`](rsvp-function/README.md).

## Деплой (GitHub Pages)

Пуш в `main` → workflow `.github/workflows/deploy.yml`: typecheck → юнит-тесты →
тесты прокси → e2e RSVP → `vite build` → публикация `dist/` в Pages.

Разовая настройка в репозитории: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. `base` у Vite относительный (`./`), поэтому сайт
работает и на `user.github.io`, и на `user.github.io/wedding/`.

## Скриншот-тесты

- **Golden-регрессия** (`tests/screenshot/`) — каждая секция + страница + модалка
  снимаются при 440px; сеть RSVP замокана, время заморожено (детерминизм).
  Эталоны — в `tests/screenshot/__screenshots__/` (коммитятся).
- **Сверка с рефом** (`npm run parity`) — рендерит React-секции и эталоны
  `refs/sections/*.html` при 440px, считает пиксельное расхождение, пишет
  HTML-отчёт `refs/ref-render/parity/report.html`.

> Эталоны скринов сгенерированы на macOS. Для строгого гейта в CI их нужно
> перегенерировать в окружении CI (Linux) — рендер шрифтов отличается.
