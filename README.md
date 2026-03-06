# LaunchKit Shop

CLI-інструмент для створення готових React інтернет-магазинів з автоматичною генерацією кольорової палітри.

Один hex-колір → повноцінний шаблон магазину з 30+ SCSS-змінними, 10 сторінками та mock-даними.

## Швидкий старт

```bash
npx @greenfield-taster/launchkit-shop
```

CLI запитає:
1. **Назву проекту** — стане назвою папки та `package.json`
2. **Hex-колір бренду** — згенерує повну палітру автоматично

Після цього:

```bash
cd my-shop
npm run dev
```

## Що ви отримуєте

- **10 готових сторінок** — головна, каталог, товар, кошик, оформлення, вішліст, FAQ, контакти, профіль, 404
- **Кольорова палітра** — primary (50–900), secondary (комплементарний), neutrals з відтінком бренду
- **10 mock-товарів** — українською, з категоріями, характеристиками, цінами, рейтингами
- **Авторизація** — телефон + OTP + Google OAuth (mock)
- **Кошик і вішліст** — з промокодами та localStorage
- **Адаптивний дизайн** — mobile-first, max-width 1620px

## Технології

| | |
|---|---|
| **React** | 19 |
| **Vite** | 7 |
| **MUI** | v7 |
| **SCSS** | з 170+ дизайн-токенами |
| **Іконки** | Lucide React |
| **Роутинг** | React Router v7 |

## Структура проекту

```
my-shop/
├── public/
│   ├── image-placeholder.png
│   └── image-placeholder-2.png
├── src/
│   ├── components/
│   │   ├── Carousel/           # Drag/touch карусель
│   │   ├── Cart/               # Бічна панель кошика
│   │   ├── CatalogFilters/     # Фільтри каталогу
│   │   ├── ConfirmModal/       # Модалка підтвердження
│   │   ├── CustomSelect/       # Кастомний dropdown
│   │   ├── ErrorBoundary/      # Обробка помилок
│   │   ├── FAQ/                # Акордеон FAQ
│   │   ├── LegalModal/         # Юридичні тексти
│   │   ├── ProductCard/        # Картка товару
│   │   ├── ProductGallery/     # Галерея з мініатюрами
│   │   ├── SideAuthPanel/      # Панель авторизації
│   │   ├── Skeleton/           # Скелетони завантаження
│   │   └── WishlistButton/     # Кнопка вішлісту
│   ├── contexts/
│   │   ├── auth/               # Контекст авторизації
│   │   ├── cart/               # Контекст кошика
│   │   └── wishlist/           # Контекст вішлісту
│   ├── data/
│   │   ├── products.json       # 10 mock-товарів
│   │   ├── categories.json     # Категорії
│   │   ├── faqData.js          # Питання та відповіді
│   │   └── reviews.json        # Відгуки
│   ├── hooks/                  # useAuth, useCart, useWishlist та ін.
│   ├── layout/                 # Header, Footer, Layout
│   ├── pages/                  # Home, Catalog, Product, Checkout...
│   ├── styles/
│   │   ├── _variables.scss     # Всі дизайн-токени
│   │   ├── main.scss           # Глобальні стилі
│   │   ├── layout/             # Стилі layout
│   │   └── pages/              # Стилі сторінок
│   └── utils/
│       ├── seoData.js          # SEO мета-дані
│       └── storeInfo.js        # Контакти магазину
├── package.json
└── vite.config.js
```

## Сторінки

| Роут | Сторінка | Опис |
|---|---|---|
| `/` | Home | Герой-банер, карусель популярних, переваги |
| `/catalog` | Catalog | Фільтри, сортування, пагінація |
| `/product/:id` | Product | Галерея, характеристики, схожі товари |
| `/checkout` | Checkout | Контакти, доставка, оплата |
| `/wishlist` | Wishlist | Збережені товари |
| `/contacts` | Contacts | Контактна інформація |
| `/profile` | Profile | Профіль користувача |
| `*` | 404 | Сторінка не знайдена |

## Кастомізація

### Кольори

CLI генерує палітру автоматично з одного hex-кольору. Результат — у файлі `src/styles/_variables.scss`:

```scss
// Primary — основний колір бренду (10 відтінків)
$brand-primary-50: #f6f5f4;
$brand-primary-500: #a66e4a;   // ← ваш колір
$brand-primary-900: #301f13;   // футер

// Secondary — комплементарний (автоматично)
$brand-secondary-500: #4f81a1;

// Neutrals — сірі з відтінком бренду
$neutral-0: #ffffff;
$neutral-900: #1a1919;
```

Щоб змінити кольори після створення — відредагуйте `_variables.scss` вручну.

### Контент магазину

**Інформація про магазин** — `src/utils/storeInfo.js`:

```js
export const STORE_INFO = {
  name: "My Shop",
  phones: ["+380501234567"],
  email: "info@myshop.com.ua",
  address: "м. Київ, вул. Прикладна, 1",
  schedule: "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
  social: {
    telegram: "https://t.me/myshop",
    instagram: "https://instagram.com/myshop",
    facebook: "https://facebook.com/myshop",
  },
};
```

**SEO** — `src/utils/seoData.js`:

```js
export const SITE_NAME = "My Shop";
export const BASE_URL = "https://myshop.com.ua";
```

**Товари** — `src/data/products.json`:

```json
{
  "id": 1,
  "name": "Товар Преміум",
  "price": 2400,
  "oldPrice": 3000,
  "category": ["popular", "sale"],
  "image": "/image-placeholder.png",
  "characteristics": [
    { "key": "Матеріал", "value": "Натуральний" }
  ],
  "inStock": true,
  "rating": 4.8
}
```

**Категорії** — `src/data/categories.json`:

```json
[
  { "id": "all", "name": "Всі товари" },
  { "id": "popular", "name": "Популярне" },
  { "id": "new", "name": "Новинки" },
  { "id": "sale", "name": "Акції" }
]
```

## Функціонал

### Кошик
- Бічна панель з анімацією
- Зміна кількості товарів
- Промокоди: `SALE10`, `SAVE50`, `WELCOME`

### Авторизація
- Телефон + OTP (двоетапна верифікація)
- Google OAuth (mock)
- Збереження стану в контексті

### Каталог
- Фільтри за категорією та ціною
- Сортування: за ціною, рейтингом, новизною
- Пагінація
- Збереження фільтрів в URL

### Галерея товару
- Мініатюри зображень
- Навігація клавіатурою (стрілки)
- Свайп на мобільних

### Вішліст
- Збереження в localStorage
- Кнопка-серце на картках товарів

## Скрипти

```bash
npm run dev       # Запуск dev-сервера
npm run build     # Збірка для продакшену
npm run preview   # Перегляд збірки
npm run lint      # Перевірка ESLint
```

## Вимоги

- Node.js ≥ 18
- npm ≥ 9

## Ліцензія

MIT
