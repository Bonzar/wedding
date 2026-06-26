# RSVP-прокси (Yandex Cloud Function)

Тонкая прослойка между статическим лендингом (GitHub Pages) и Craft.
Держит секретный Craft-линк на сервере и отдаёт наружу ровно две операции
над гостевой коллекцией. Подробности — в шапке [`index.js`](index.js).

## Почему он нужен
Craft connect-линк = мастер-ключ ко **всей** базе (read/write/**delete**, без
пароля, CORS открыт). В коде публичного сайта его держать нельзя. Поэтому секрет
живёт в функции, а сайт ходит только сюда.

## Деплой через консоль (UI)
1. Cloud Console → **Cloud Functions** → создать функцию.
2. Создать версию: среда **`nodejs22`**, точка входа **`index.handler`**,
   загрузить `index.js` (или вставить в редактор).
3. Параметры → **переменные окружения**:
   - `CRAFT_API` = `https://connect.craft.do/links/XXXXXXXX/api/v1`
   - `ALLOWED_ORIGINS` = `https://bonzar.github.io`
   - Память 128 МБ, таймаут 10 с — достаточно.
4. Сделать функцию **публичной** (вкладка «Обзор» → «Публичная функция», либо
   назначить роль `functions.functionInvoker` субъекту `allUsers`).
5. URL вызова: `https://functions.yandexcloud.net/<function-id>` — это и есть
   `RSVP_API` для фронта.

## Деплой через `yc` CLI
```bash
cd rsvp-function
yc serverless function create --name wedding-rsvp

yc serverless function version create \
  --function-name wedding-rsvp \
  --runtime nodejs22 \
  --entrypoint index.handler \
  --memory 128m --execution-timeout 10s \
  --source-path . \
  --environment CRAFT_API="https://connect.craft.do/links/XXXXXXXX/api/v1",ALLOWED_ORIGINS="https://bonzar.github.io"

yc serverless function allow-unauthenticated-invoke wedding-rsvp
```

## Где хранить CRAFT_API понадёжнее (опц.)
Переменная окружения видна всем, у кого есть доступ к функции в консоли. Если
хочется строже — положить линк в **Lockbox** и сослаться на секрет при создании
версии (`--secret`); в коде ничего менять не нужно, имя переменной то же.

## Роутинг
У голого URL функции нет путей, поэтому метод решает всё:
- **`GET  ?inv=TOKEN`** — гости приглашения и их ответы.
- **`POST`** с JSON-телом — сохранить ответ.
- `GET` без `inv` — health-check (`{"ok":true}`).

### Ответ `GET ?inv=<id приглашения>`
`inv` — это **id записи в коллекции «Приглашения»**. Связь гость→приглашение хранится
relation-полем «Приглашение» прямо в строке гостя, поэтому функция читает одну
коллекцию «Гости» и фильтрует по этому id.
```json
{ "inv": "<id приглашения>",
  "guests": [
    { "guestId": "…", "name": "Ольга", "answered": false,
      "attending": "", "drinks": "", "drinkList": [], "comment": "" } ] }
```
`404` — приглашение с таким id не найдено (нет гостей с такой связью).

### Тело `POST`
```json
{ "inv": "<TEST_TOKEN>",
  "guestId": "2ad2e204-bebd-21a6-c43b-5391fab3d111",
  "answers": {
    "attending": "Да",
    "drinks": "Да",
    "drinkList": ["Игристое вино (полуслад)", "Красное вино (полусух)"],
    "comment": "Без лактозы"
  } }
```
Сервер сам ставит «Ответ получен» = true и дату. `guestId` должен принадлежать
`inv`, иначе `403`. Значения вне белого списка (`attending`/`drinks` ∈ Да/Нет,
напитки из фиксированного набора) отвергаются.

## Проверка после деплоя
```bash
API="https://functions.yandexcloud.net/<function-id>"
curl -s "$API?inv=<TEST_TOKEN>" | python3 -m json.tool
curl -s -X POST "$API" -H 'Content-Type: application/json' \
  -d '{"inv":"<TEST_TOKEN>","guestId":"<id Ольги>","answers":{"attending":"Да","drinks":"Да","drinkList":["Игристое вино (полуслад)"]}}'
```

## Что функция НЕ делает (намеренно)
- не удаляет ничего;
- не трогает другие коллекции/документы (id коллекции захардкожен);
- не отдаёт гостей чужих приглашений;
- не создаёт новые опции в схеме из пользовательского ввода.
