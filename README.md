# Jira Project Assistant

Jira Project Assistant — Forge Custom UI приложение для Jira, реализованное в рамках тестового задания.

Приложение позволяет выбрать Jira-проект, загрузить задачи проекта, увидеть базовую статистику, найти проблемные задачи, назначить исполнителей, повысить приоритет задач с близким дедлайном, выполнить массовое назначение задач без исполнителя и просмотреть участников проекта на вкладке Team.

## Технологии

- Atlassian Forge
- Forge Custom UI
- React
- TypeScript
- Material UI
- Zustand
- Jira REST API v3
- Docker
- docker-compose

## Используемые Jira API

Приложение использует Jira REST API v3 для:

- получения проектов;
- получения задач проекта;
- получения assignable users;
- назначения исполнителя;
- обновления приоритета задачи.

## Архитектура приложения

Приложение состоит из двух основных частей:

### Forge backend resolver layer

- расположен в `src/index.ts`;
- выполняет запросы к Jira REST API через `@forge/api`;
- использует `api.asUser()`;
- предоставляет resolver-методы для frontend.

### Custom UI frontend

- расположен в `static/hello-world`;
- реализован на React + TypeScript;
- использует MUI для интерфейса;
- использует Zustand store для состояния проектов, задач, участников и optimistic updates;
- обращается к resolver layer через типизированный Forge invoke contract.

## Структура проекта

```text
.
├── src/
│   └── index.ts
├── static/
│   └── hello-world/
│       ├── src/
│       │   ├── app/
│       │   │   ├── store/
│       │   │   └── theme/
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── issues/
│       │   │   ├── layout/
│       │   │   ├── project/
│       │   │   └── team/
│       │   ├── features/
│       │   │   └── utils/
│       │   ├── services/
│       │   ├── types/
│       │   └── App.tsx
│       ├── package.json
│       └── vite.config.ts
├── manifest.yml
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Требования для запуска

- Node.js
- npm
- Atlassian Forge CLI
- Atlassian account
- Jira Cloud site
- Docker и Docker Compose для запуска через контейнер

## Клонирование репозитория

```bash
git clone https://github.com/Makflay/jira-project-assistant.git
cd jira-project-assistant
```

## Установка зависимостей

### Установить зависимости backend/resolver части:

```bash
npm install
```

### Установить зависимости Custom UI:

```bash
cd static/hello-world
npm install
```

### Forge login

```bash
forge login
```

### Forge deploy

```bash
forge deploy
```

### Forge install

```bash
forge install
```

Если приложение уже установлено и были изменены scopes или permissions:

```bash
forge install --upgrade
```

### Запуск через forge tunnel

Из корня Forge-приложения:

```bash
forge tunnel
```

Custom UI собирается из директории static/hello-world.

## Запуск через Docker

Сборка и запуск через Docker Compose:

```bash
docker-compose up --build
```

Остановка:

```bash
docker-compose down
```

## Функциональность

### Dashboard

Dashboard отображает данные выбранного Jira-проекта:

- выбор проекта через dropdown;
- статистику по задачам;
- список задач;
- действия для проблемных задач;
- кнопку массового назначения задач без исполнителя.

Статистика включает:

- общее количество задач;
- количество задач без исполнителя;
- количество Low/Lowest задач с дедлайном в ближайшие 3 дня;
- количество Done-задач.

### Issues

Таблица задач отображает:

- Key;
- Summary;
- Status;
- Assignee;
- Priority;
- Actions.

Проблемные задачи подсвечиваются:

- задачи без исполнителя — error-стилем;
- Low/Lowest задачи с близким дедлайном — warning-стилем.

Для задач без priority отображается fallback `No priority`.
Для задач без duedate дедлайн-проблема не создается.

### Assign assignee

Для задач без исполнителя доступно действие `Assign`.

Модальное окно назначения:

- загружает assignable users проекта через Jira API;
- показывает loading/error состояния;
- позволяет выбрать пользователя из списка;
- блокирует Confirm, пока пользователь не выбран;
- отправляет назначение через Jira API;
- использует `accountId`;
- закрывается после успешного назначения.

### Raise priority

Для Low/Lowest задач с дедлайном в ближайшие 3 дня доступно действие `Raise priority`.

Модальное окно повышения приоритета:

- показывает варианты приоритета;
- использует priority id;
- блокирует Confirm, пока priority не выбран;
- обновляет priority через Jira API;
- закрывается после успешного обновления.

### Auto-assign unassigned

Для задач без исполнителя доступно массовое назначение.

Поведение:

- кнопка `Auto-assign unassigned` показывает количество задач без исполнителя;
- кнопка disabled, если таких задач нет;
- перед запуском открывается confirm-dialog;
- dialog показывает количество задач;
- dialog сообщает, что назначение будет случайным;
- Cancel закрывает dialog без изменений;
- Confirm запускает массовое назначение.

Логика назначения:

- используются только задачи без исполнителя;
- assignable users загружаются из Jira;
- неактивные пользователи исключаются, если Jira API возвращает `active: false`;
- для каждой задачи вызывается существующий `assignIssue`;
- используется `accountId`;
- частичные ошибки не останавливают весь процесс;
- пользователь видит список задач, которые не удалось назначить;
- после завершения задачи перезагружаются.

### Team

Вкладка Team отображает участников выбранного проекта.

Функциональность:

- участники загружаются через Jira assignable users API;
- отображается `displayName`;
- avatar отображается с fallback;
- `accountType` и `active` обрабатываются безопасно;
- количество назначенных задач считается по `accountId`;
- задачи без исполнителя не учитываются;
- участникам без задач показывается `0`;
- activity status отображается через Chip.

Activity status:

- `0` задач — `Idle`;
- `1–3` задачи — `Normal`;
- `4+` задач — `Busy`.

### Обработка ошибок и optimistic updates

В приложении используются loading/error/empty состояния для основных асинхронных операций:

- загрузка проектов;
- загрузка задач;
- загрузка участников;
- назначение исполнителя;
- повышение приоритета;
- массовое назначение.

Optimistic updates реализованы для:

- назначения исполнителя;
- повышения приоритета;
- массового назначения задач без исполнителя.

Rollback:

- при ошибке назначения assignee возвращается предыдущий assignee;
- при ошибке обновления priority возвращается предыдущий priority;
- при bulk auto-assign откатывается только задача, для которой API-запрос завершился ошибкой;
- успешные назначения не откатываются из-за частичной ошибки.

### Ограничения и допущения

- Приложение ориентировано на один Jira Cloud site.
- Для запросов к Jira используется `api.asUser()`.
- Assignable users загружаются через Jira REST API.
- Массовое назначение выполняется последовательными вызовами существующего assign API.
- Отдельный bulk endpoint не используется.
- Retry для отдельных failed bulk items не реализован.
- Progress bar для bulk action не реализован.
- Сортировка, фильтрация, поиск и пагинация не реализованы.
- Priority options заданы в UI как фиксированные варианты.
- Близкий дедлайн определяется как сегодня и ближайшие 3 дня включительно.
- Done-задачи не считаются проблемными по правилу Low/Lowest + близкий дедлайн.

### Команды разработки

Из директории Custom UI:

```bash
cd static/hello-world
npm run lint
npm run typecheck
```

Из корня Forge-приложения:

```bash
forge lint
forge tunnel
```

### Ручная проверка

После установки приложения рекомендуется проверить:

- открытие приложения на Jira project page;
- загрузку проектов и задач;
- работу Dashboard и таблицы Issues;
- назначение исполнителя через `Assign`;
- повышение приоритета через `Raise priority`;
- массовое назначение через `Auto-assign unassigned`;
- вкладку `Team`, счетчики задач и activity status;
- empty/loading/error состояния;
- отсутствие ошибок в DevTools Console и Forge logs.
