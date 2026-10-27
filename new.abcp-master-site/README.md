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

