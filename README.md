# Flutter Aurora MCP Server

[![GitHub Stars](https://img.shields.io/github/stars/vvadev/Flutter-Aurora-MCP-Server?style=flat-square)](https://github.com/vvadev/Flutter-Aurora-MCP-Server/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/vvadev/Flutter-Aurora-MCP-Server?style=flat-square)](https://github.com/vvadev/Flutter-Aurora-MCP-Server/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/vvadev/Flutter-Aurora-MCP-Server?style=flat-square)](https://github.com/vvadev/Flutter-Aurora-MCP-Server/issues)
[![License](https://img.shields.io/github/license/vvadev/Flutter-Aurora-MCP-Server?style=flat-square)](LICENSE)

MCP (Model Context Protocol) сервер, предоставляющий AI-агентам структурированный доступ к документации платформы Flutter Aurora (руководства по разработке, переносу и документация по плагинам).

## Особенности

- **4 MCP инструмента**: Список документов, получение содержимого документа, поиск и быстрый доступ к плагинам.
- **Управление сессиями**: Автоматическое отслеживание сессий с TTL в оперативной памяти.
- **Быстрая индексация**: Индекс документов в оперативной памяти для мгновенного доступа.
- **Безопасность**: Валидация входных данных (Zod), ограничение частоты запросов, проверка Origin и защита от обхода путей.

## Быстрый старт

### Локальная разработка

1. **Установите зависимости**:
```bash
npm install
```

2. **Создайте файл окружения**:
```bash
cp .env.example .env
```

3. **Добавьте примеры документации** (для тестирования):
```bash
mkdir -p docs/development docs/porting docs/plugins
```

4. **Соберите и запустите**:
```bash
npm run build
npm start
```

Или запустите в режиме разработки с автоматической перезагрузкой:
```bash
npm run dev
```

5. **Проверьте работу сервера**:
```bash
curl http://localhost:3000/health
```

### Docker Compose

1. **Соберите и запустите с помощью Docker Compose** (сервер + redis):
```bash
docker-compose up -d
```

*Примечание: Redis используется для кеширования эмбеддингов при ENABLE_RAG=true.*

2. **Проверьте состояние**:
```bash
curl http://localhost/health
```

3. **Просмотр логов**:
```bash
docker-compose logs -f mcp-server
```

4. **Остановка сервисов**:
```bash
docker-compose down
````

**См. также**: [Конфигурация Redis](#redis-configuration) для настройки кеширования эмбеддингов.

### Разработка с Docker

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Это включает горячую перезагрузку и логирование отладки.

## Конфигурация MCP клиента

### Cursor

Добавьте в конфигурацию Cursor MCP:

```json
{
  "mcpServers": {
    "flutter-aurora-mcp-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```
## Доступные инструменты

Все инструменты имеют префикс `aurora_`:

### 1. aurora_list_documents

Список всех документов в категории с описаниями.

**Параметры**:
- `category`: "development" | "porting" | "plugins"

**Пример**:
```json
{
  "category": "plugins"
}
```

### 2. aurora_get_document

Получить полное содержимое конкретного документа.

**Параметры**:
- `category`: "development" | "porting" | "plugins"
- `name`: Имя документа (без расширения .md)

**Пример**:
```json
{
  "category": "plugins",
  "name": "camera"
}
```

### 3. aurora_search_documents

Поиск по ключевым словам в названиях и описаниях документов.

**Параметры**:
- `query`: Поисковый запрос (минимум 2 символа)
- `category`: (опционально) Ограничить поиск конкретной категорией

**Пример**:
```json
{
  "query": "camera",
  "category": "plugins"
}
```

### 4. aurora_get_all_plugins

Ярлык для вывода списка всех документов по плагинам. Параметры не требуются.

## Формат документа

Все документы должны быть в формате Markdown (`.md`) и содержать обязательный блок метаданных в начале файла для корректной индексации и работы AI-агентов.

### Обязательные элементы

1.  **Блок описания**: Оберните краткое (1-3 предложения) описание функциональности в теги `<description>`. Это описание используется инструментом поиска и AI для понимания контекста.
2.  **Заголовок первого уровня**: Название документа или плагина.

### Рекомендуемая структура (для плагинов)

Для обеспечения единообразия и лучшего понимания AI-агентами, рекомендуется придерживаться следующей структуры:

```markdown
<description>
Краткое описание плагина и его возможностей на платформе Aurora.
</description>

# название_плагина

## QUICK_START
Минимальный пример кода для быстрого запуска.

## API_SUMMARY
### Functions
- `functionName()` — описание функции и возвращаемого значения.

### Classes
- `ClassName` — краткое описание класса.
  - `methodName()` — описание метода.
  - `propertyName` — описание свойства.

## USAGE_PATTERNS
Типовые сценарии использования (паттерны) с примерами кода.

## DEPS
Список зависимостей (pubspec.yaml).

## NOTES
Особенности реализации для Aurora, ограничения или важные нюансы.
```

## Добавление новых документов

1.  **Выберите категорию**:
    - `docs/development`: Руководства по разработке и общие концепции.
    - `docs/porting`: Инструкции по переносу приложений на Aurora.
    - `docs/plugins`: Документация по конкретным Flutter-плагинам.
2.  **Создайте файл**: Назовите файл строчными буквами, используя подчеркивания (например, `new_awesome_plugin.md`).
3.  **Заполните содержимое**: Используйте рекомендованную структуру выше.
4.  **Перезапустите сервер**: При использовании Docker сервер автоматически переиндексирует документы при перезапуске (`docker-compose restart mcp-server`). Если RAG включен, новые документы будут автоматически эмбеддированы и добавлены в Redis.

## RAG / Semantic Search (Опционально)

Сервер поддерживает опциональный RAG (Retrieval-Augmented Generation) режим для семантического поиска по содержимому документов. По умолчанию RAG **выключен** для экономии затрат.

### Режимы работы

#### 1. Режим WITHOUT RAG (ENABLE_RAG=false, по умолчанию)

- Сервер работает как раньше
- Только keyword поиск по именам и описаниям
- Не используется Redis
- Не генерируются эмбеддинги
- Нет затрат на OpenAI API
- Минимальные требования к зависимостям

#### 2. Режим WITH RAG (ENABLE_RAG=true)

- Гибридный поиск (keyword + semantic)
- Эмбеддинги генерируются через OpenAI-совместимый API
- Кеширование в Redis для экономии
- Инкрементальные обновления только для измененных файлов
- Требуется OPENAI_API_KEY

### Стратегия кеширования эмбеддингов

**Принцип**: Экономия денег через инкрементальные обновления

1. **Хранение**: Все эмбеддинги сохраняются в Redis по ключу `embeddings:{category}:{document_name}`
2. **Идентификация изменений**: Вычисление SHA-256 хэша содержимого файла
3. **Принцип работы**:
   - При запуске: загрузить все эмбеддинги из Redis
   - Для каждого файла: вычислить хэш содержимого
   - Если хэш изменился → генерировать новые эмбеддинги и обновлять Redis
   - Если хэш не изменился → использовать эмбеддинги из Redis
4. **Новые файлы**: Автоматически обрабатываются при следующем запуске
5. **Удаленные файлы**: Эмбеддинги остаются в Redis, но не загружаются в память

### Как включить RAG

В файле `.env` установите:

```bash
ENABLE_RAG=true
OPENAI_API_KEY=your-openai-api-key-here
```

### Переменные окружения для RAG

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `ENABLE_RAG` | false | Включить RAG функциональность |
| `OPENAI_API_KEY` | - | API ключ для OpenAI (требуется если ENABLE_RAG=true) |
| `OPENAI_EMBEDDING_MODEL` | openai/text-embedding-3-small | Модель эмбеддингов |
| `EMBEDDING_CHUNK_SIZE` | 500 | Размер чанка в символах |
| `EMBEDDING_CHUNK_OVERLAP` | 50 | Перекрытие между чанками |
| `RAG_TOP_K_RESULTS` | 10 | Количество топ результатов для semantic поиска |
| `RAG_HYBRID_ALPHA` | 0.5 | Вес семантического поиска 0-1 |
| `REDIS_URL` | redis://redis:6379 | URL подключения к Redis |
| `ENABLE_RAG_CACHE` | true | Включить кеширование эмбеддингов |

### Примеры использования

#### Без RAG (ENABLE_RAG=false)

```json
{
  "query": "camera",
  "category": "plugins"
}
```

Результат: только keyword поиск по именам и описаниям

#### С RAG (ENABLE_RAG=true)

```json
{
  "query": "как сделать фото",
  "category": "plugins"
}
```

Результат: гибридный поиск (keyword + semantic) с релевантностью

#### С RAG, но только keyword в запросе

```json
{
  "query": "camera",
  "category": "plugins",
  "use_semantic_search": false
}
```

Результат: только keyword поиск (игнорирует semantic даже при ENABLE_RAG=true)

### Работа с Redis

Просмотр ключей в кеше:
```bash
docker-compose exec redis redis-cli KEYS "embeddings:*"
```

Просмотр конкретного кеша:
```bash
docker-compose exec redis redis-cli GET "embeddings:plugins:camera"
```

Очистка кеша (потребует полной регенерации):
```bash
docker-compose exec redis redis-cli FLUSHDB
```

Мониторинг использования памяти:
```bash
docker-compose exec redis redis-cli INFO memory
```

### Стоимость и экономия

- Генерация эмбеддингов требует затрат на OpenAI API
- Кеширование в Redis позволяет избежать повторной генерации для неизмененных файлов
- Типичная экономия: 90-95% эмбеддингов загружаются из кеша при перезапуске

### Важно

- RAG по умолчанию **выключен** для экономии затрат
- Включайте RAG только если нужен семантический поиск
- При выключенном RAG сервис работает как раньше без изменений

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT` | 3000 | Порт HTTP сервера |
| `HOST` | 0.0.0.0 | Хост привязки (используйте 127.0.0.1 локально) |
| `DOCS_PATH` | ./docs | Путь к папке с документацией |
| `RATE_LIMIT_WINDOW_MS` | 60000 | Окно ограничения частоты запросов (мс) |
| `RATE_LIMIT_MAX` | 60 | Макс. количество запросов в окне |
| `SESSION_TTL_MS` | 3600000 | Время жизни сессии (1 час) |
| `ALLOWED_ORIGINS` | * | Разрешенные источники через запятую |
| `LOG_LEVEL` | info | Уровень логирования |

## API Endpoints

### Health Check

```bash
GET /health
```

Возвращает:
```json
{
  "status": "healthy",
  "indexed_documents": {
    "development": 10,
    "porting": 5,
    "plugins": 25
  },
  "uptime_seconds": 3600,
  "active_sessions": 5
}
```

### MCP Endpoint

- **POST /mcp**: Отправка JSON-RPC сообщений
- **GET /mcp**: Открытие SSE-потока для сообщений от сервера к клиенту
- **DELETE /mcp**: Завершение сессии

Все MCP-запросы включают заголовок `Mcp-Session-Id` для отслеживания сессии.

## Разработка

### Скрипты

- `npm install`: Установка зависимостей.
- `npm run build`: Компиляция TypeScript в dist/.
- `npm run dev`: Режим разработки с автоперезагрузкой.
- `npm start`: Запуск скомпилированного сервера.
- `npm run lint`: Запуск ESLint.
- `npm run clean`: Удаление папки dist/.

### Структура проекта

```
flutter-aurora-mcp-server/
├── src/
│   ├── index.ts               # Точка входа (Express + MCP)
│   ├── types.ts               # TypeScript интерфейсы
│   ├── constants.ts           # Конфигурация и константы
│   ├── server/                # Настройка MCP сервера и сессий
│   ├── indexer/               # Индексация и парсинг документов
│   ├── tools/                 # Реализация MCP инструментов
│   ├── schemas/               # Схемы валидации Zod
│   ├── middleware/            # Express middleware (безопасность)
│   └── utils/                 # Логирование и утилиты
├── docs/                      # Хранилище документации (Markdown)
│   └── plugins/               # Документация по плагинам
├── dist/                      # Скомпилированный JavaScript
└── Dockerfile                 # Инструкции для сборки образа
```

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Если вы хотите помочь:

1. Сделайте **Fork** репозитория.
2. Создайте ветку для своей задачи (`git checkout -b feature/AmazingFeature`).
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`).
4. Отправьте ветку в свой репозиторий (`git push origin feature/AmazingFeature`).
5. Откройте **Pull Request**.

## Разработчик

**VVA Dev (vvadev)**
- GitHub: [@vvadev](https://github.com/vvadev)

*Этот проект был создан при помощи Claude Code.*

## Лицензия

Этот проект лицензирован на условиях **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Это означает, что если вы используете, изменяете или распространяете этот код (в том числе предоставляя доступ к нему через сеть), вы обязаны использовать ту же открытую лицензию и предоставлять исходный код вашего проекта.

Подробности см. в файле [LICENSE](LICENSE).
