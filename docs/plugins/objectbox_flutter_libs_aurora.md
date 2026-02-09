<description>
Aurora версия objectbox_flutter_libs - плагин для работы с быстрой NoSQL базой данных ObjectBox на платформе Aurora OS. Позволяет хранить Dart объекты с соблюдением ACID, поддерживает запросы, связи и векторный поиск.
</description>

# objectbox_flutter_libs_aurora

## TYPE
fork

## QUICK_START
```yaml
dependencies:
  objectbox: 4.3.0
  objectbox_flutter_libs: 4.3.0
  objectbox_flutter_libs_aurora:
    git: https://developer.auroraos.ru/git/flutter/flutter-community-plugins/objectbox_flutter_libs_aurora.git
```

```dart
final store = await openStore(directory: 'db-path');
final box = store.box<NoteModel>();
```

## API_SUMMARY
См. pub.dev/packages/objectbox для полного API.

Основные методы из пакета objectbox:
- openStore(directory: String) → Store
- store.box<T>() → Box<T>
- box.put(entity) → int
- box.get(id) → T?
- box.query() → QueryBuilder<T>
- box.removeAll() → int
- store.close() → void

## USAGE_PATTERNS
Паттерн: Инициализация хранилища
```dart
final store = await openStore(directory: databasesPath.path);
```
Результат: Создает экземпляр Store для работы с БД

Паттерн: Создание записи
```dart
final id = box.put(NoteModel('message'));
```
Результат: Возвращает id созданной записи

Паттерн: Чтение всех записей
```dart
final query = box.query().build();
final values = query.find();
query.close();
```
Результат: Список всех объектов

Паттерн: Удаление всех записей
```dart
box.removeAll();
```
Результат: Удаляет все объекты из Box

## DEPS
objectbox: 4.3.0
objectbox_flutter_libs: 4.3.0
path_provider: ^2.1.5

## NOTES
- Плагин адаптирует objectbox_flutter_libs для платформы Aurora OS
- Работает на Aurora OS версии 5.0.0 и выше
- Требует разрешения UserDirs (автоматически добавляется плагином)
- ObjectBox поставляется как предкомпилированная бинарная библиотека
- Схема БД генерируется автоматически при запуске (objectbox.g.dart)
