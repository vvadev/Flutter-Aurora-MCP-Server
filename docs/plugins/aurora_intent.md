<description>
Плагин для работы с интентами Aurora OS: вызов системных и пользовательских интентов, регистрация собственных интентов с обработчиками. Для Flutter приложений на Aurora OS версии 5.2+.
</description>

# aurora_intent

## TYPE
custom

## QUICK_START
```dart
AuroraIntent.initialize();
await AuroraIntent.registerIntent("X-MyIntent", (params) async => {"result": "ok"});
await AuroraIntent.startService();
await AuroraIntent.invokeIntent(name: AuroraStandartIntents.start);
```

## API_SUMMARY
- AuroraIntent.initialize() → void
Инициализация плагина, регистрация обработчиков

- AuroraIntent.invokeIntent({required String name, Hints? hints, Map<String, dynamic>? params}) → Future<Map<String, dynamic>>
Вызов интента с опциональными подсказками и параметрами

- AuroraIntent.registerIntent(String name, Future<Map<String, dynamic>?> Function(Map<String, dynamic>) callback) → Future<void>
Регистрация интента с обработчиком (имя начинается с "X-" или "OpenURI")

- AuroraIntent.startService() → Future<void>
Запуск сервиса, делающего зарегистрированные интенты доступными для системы

- AuroraStandartIntents.openUri = "OpenURI"
Стандартный интент для открытия URI

- AuroraStandartIntents.start = "Start"
Стандартный интент для запуска приложений

- Hints({String? preferredHandler, bool? onlyPreferred, List<String>? readFiles, List<String>? writeFiles, List<String>? ignoreHosts, List<String>? ignoreSchemes})
Подсказки для Runtime Manager при вызове интента

## USAGE_PATTERNS
Паттерн: Инициализация и регистрация интентов
```dart
AuroraIntent.initialize();
await AuroraIntent.registerIntent("X-MyIntent", (params) async {
  return {"counter": ++params["counter"]};
});
await AuroraIntent.startService();
```
Результат: Интенты доступны для вызова системой, обрабатываются колбеком

Паттерн: Вызов стандартного интента Start с указанием приложения
```dart
await AuroraIntent.invokeIntent(
  name: AuroraStandartIntents.start,
  hints: const Hints(preferredHandler: "com.jolla.settings"),
);
```
Результат: Открытие настроек Aurora OS

Паттерн: Вызов интента OpenURI с параметром uri
```dart
await AuroraIntent.invokeIntent(
  name: AuroraStandartIntents.openUri,
  params: {"uri": "tel:+79996660013"},
);
```
Результат: Открытие dialer с номером

Паттерн: Регистрация обработчика для OpenURI
```dart
await AuroraIntent.registerIntent(AuroraStandartIntents.openUri, (params) async {
  debugPrint("URI: ${params["uri"]}");
  return null;
});
```
Результат: Обработка всех URI, зарегистрированных в .desktop файле приложения

Паттерн: Вызов кастомного интента с передачей данных
```dart
var result = await AuroraIntent.invokeIntent(
  name: "X-MyIntent",
  params: {"counter": 0},
);
```
Результат: {"counter": 1} (инкрементированное значение)

## DEPS
- flutter: ^3.32.7
- plugin_platform_interface: ^2.0.2
- aurora_libspdlog (git: flutter-community-plugins/aurora_libspdlog)

## NOTES
- Платформа: только Aurora OS
- Минимальная версия: Aurora OS 5.2, Flutter 3.35.0
- На Aurora 5.1 ограничения: не поддерживается вложенность JSON >1 уровня, регистрация интентов не работает при `flutter run`
- Кастомные интенты: имя должно начинаться с "X-" или быть "OpenURI"
- .desktop файл: добавлять `Intents=X-MyIntent` для регистрации интентов, `MimeType=x-scheme-handler/geo` для схем URI
- Поддерживаемые схемы URI: IANA и начинающиеся с "aurora-<org>."
- Qt поддержка: добавить `#include <flutter/flutter_compatibility_qt.h>` и `aurora::EnableQtCompatibility();` в `aurora/main.cpp`
- Исключения: IntentException с кодами (failed, handlerNotFound, invalidParameters, permissionDenied, incorrectCustomIntentName и др.)
