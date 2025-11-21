# Music App

Веб-приложение для прослушивания музыки с современным UI и REST API, соответствующим Swagger спецификации.

## Описание

Music App — это полнофункциональное приложение для работы с музыкальным каталогом, состоящее из:

- **Web клиент** (React + TypeScript + Vite)
- **Backend API** (Express + TypeScript), следующий Swagger спецификации

### Основные возможности

**Публичные функции:**
- Просмотр каталога треков и плейлистов
- Просмотр деталей плейлистов и треков
- Поиск и фильтрация треков по тексту, артистам, тегам

**Для авторизованных пользователей:**
- Вход через OAuth (authorization code)
- Управление собственными плейлистами: создание, обновление, удаление, изменение порядка
- Управление треками в плейлистах: добавление, удаление, изменение порядка
- Загрузка аудио файлов для треков
- Управление тегами и артистами: создание, поиск, удаление

**Воспроизведение (только frontend):**
- Воспроизведение/пауза/перемотка аудио
- Отображение текущего трека, прогресс-бара, переключение треков
- Глобальный плеер-бар

## Технологии

### Frontend

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4 (сборщик и dev-сервер)
- **@vitejs/plugin-react-swc** (React компилятор)
- **TailwindCSS** (стилизация)

**Инструменты разработки:**
- **ESLint** 9.39.1
- **Prettier** 3.6.2
- **concurrently** 8.2.2 (запуск frontend и backend вместе)

### Backend

- **Node.js** (ES Modules режим)
- **Express** 4.18.2
- **TypeScript** 5.3.3
- **CORS** 2.8.5
- **tsx** 4.7.0 (запуск TypeScript напрямую в dev)

## Структура проекта

```
music-app/
├── src/                    # Frontend
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Application shell и routing
│   ├── components/        # Переиспользуемые UI компоненты
│   ├── features/          # Функциональные модули
│   │   ├── auth/         # Авторизация
│   │   ├── playlists/    # Плейлисты
│   │   ├── tracks/       # Треки
│   │   ├── tags/         # Теги
│   │   ├── artists/      # Артисты
│   │   ├── player/        # Музыкальный плеер
│   │   ├── library/      # Публичный каталог
│   │   └── search/       # Поиск
│   ├── pages/            # Компоненты страниц
│   ├── hooks/            # Переиспользуемые хуки
│   ├── lib/              # Утилиты, API клиент
│   ├── types/            # Общие TypeScript типы
│   └── config/           # Конфигурация
│
└── backend/              # Backend
    └── src/
        ├── index.ts      # Server entry point
        ├── routes/       # Express роутеры
        ├── controllers/  # HTTP обработчики
        ├── services/     # Бизнес-логика
        ├── models/       # Модели данных и DTOs
        ├── middleware/   # Middleware (auth, error handling)
        └── config/       # Конфигурация (env, OAuth)
```

## Установка и запуск

### Предварительные требования

- Node.js (рекомендуется LTS версия)
- npm

### Установка зависимостей

```bash
# Установка зависимостей frontend
npm install

# Установка зависимостей backend
cd backend
npm install
cd ..
```

### Запуск в режиме разработки

Запуск frontend и backend одновременно:

```bash
npm run dev:all
```

Или по отдельности:

```bash
# Только frontend (порт 5173)
npm run dev

# Только backend (порт 3001)
npm run dev:backend
```

### Сборка для production

```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## API

Backend API следует REST-подобной архитектуре и использует JSON:API-стиль ответов.

### Базовый URL

Все API endpoints находятся под `/api`

### Основные ресурсы

- `/api/auth/*` — Авторизация через OAuth
- `/api/tracks` — Треки (публичные + owner операции)
- `/api/playlists` — Плейлисты (публичные + owner операции)
- `/api/tags` — Теги
- `/api/artists` — Артисты

### Формат ответов

**Успешный ответ:**
```json
{
  "data": { ... },
  "meta": { ... },
  "included": [ ... ]
}
```

**Ошибка:**
```json
{
  "errors": [
    {
      "status": 400,
      "code": "validation_error",
      "title": "Validation Error",
      "detail": "Invalid input"
    }
  ]
}
```

### Пагинация

Используйте query параметры:
- `page[size]` — размер страницы
- `page[number]` — номер страницы

Информация о пагинации возвращается в `meta`.

## Конфигурация

### Frontend

Vite dev сервер автоматически проксирует запросы `/api/*` на backend сервер (порт 3001).

Frontend должен использовать относительные пути:
- `/api/auth/login`
- `/api/playlists`
- `/api/tracks`

Не используйте абсолютные URL к backend.

### Backend

Backend запускается на порту 3001 по умолчанию (или переменная окружения `PORT`).

## Модель данных

### Track

```typescript
type Track = {
  id: string;
  title: string;
  durationMs: number;
  audioUrl: string;
  coverUrl?: string;
  genre?: string;
  artistIds: string[];
  tagIds: string[];
  playlistIds?: string[];
  createdAt?: string;
  updatedAt?: string;
};
```

## Стилизация

Проект использует **TailwindCSS** для стилизации:

- Используйте Tailwind utility классы в `className`
- Избегайте inline стилей (кроме динамических значений)
- Извлекайте повторяющиеся комбинации в переиспользуемые компоненты (`Button`, `Card` и т.д.)

## Дополнительная информация

Подробная спецификация проекта находится в файле [`spec.md`](./spec.md).

## Разработка

### Code Style

- **TypeScript-first** подход со строгой типизацией
- Функциональные компоненты и React hooks
- Избегайте `any` и `unknown` где возможно
- Код должен проходить ESLint и Prettier проверки

### Именование

- React компоненты: `PascalCase` (например, `PlayerBar.tsx`)
- Hooks: `useSomething.ts`
- Утилиты: `camelCase` (например, `formatDuration.ts`)

## Лицензия

MIT
