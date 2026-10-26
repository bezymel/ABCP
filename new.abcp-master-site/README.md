# ABCP-мастер — одностраничный сайт

Открыть локально: двойной клик по `index.html` (сборщик не нужен, скрипты обычные, без модулей).

## Структура
- `index.html` — вся страница (шапка, разделы, подвал, SEO-разметка, JSON-LD)
- `assets/css/base` — переменные, сброс, типографика, анимации
- `assets/css/components` — кнопки, карточки, формы, слайдер
- `assets/css/layout` — контейнер, шапка, подвал
- `assets/css/sections` — hero, about, services, projects (слайдер), shops (бегущие магазины), reviews, pricing, contacts
- `assets/css/base/responsive.css` — адаптивность (ноутбук, планшет, телефон), подключается последним
- `assets/js/core` — ядро (неймспейс ABCP); `assets/js/modules` — по одному файлу на функцию; `assets/js/main.js` — запуск
- `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Что заполнить
1. Домен: во всех файлах замените `https://abcp-master.ru` на ваш (index.html, robots.txt, sitemap.xml).
2. Изображения: пустые `src=""` в index.html (логотип, hero-слайдер, «Обо мне», проекты, аватары отзывов, контакты).
   Также `og:image`/`twitter:image` (1200×630) и поля `logo`/`image` в JSON-LD.
3. Коды подтверждения: `google-site-verification`, `yandex-verification` в `<head>`; счётчики Метрики/GA — блок в конце body.
4. Ссылки `href="#"`: Telegram, MAX, VK, оферта, политика, согласие.
5. Форма: в `<form id="contact-form">` укажите `data-endpoint="https://..."` для отправки на сервер; без него откроется письмо на `data-mailto`.

6. Магазины: в блоке `.shops` у каждого `<li class="shop">` впишите логотип в `src` и город вместо слова «Город».
7. Проекты: карточки 5–8 в слайдере — временные (названия из списка магазинов), замените тексты и фото.
