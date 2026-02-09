<description>
Плагин для обработки глубоких ссылок и URI-схем в Flutter приложениях на Aurora OS
</description>

# app_links_aurora

## TYPE
custom

## QUICK_START
```dart
final _appLinks = AppLinksAurora();
_appLinks.getInitialLinkString().then((link) => print(link));
_appLinks.uriLinkStream.listen((uri) => print(uri));
```

## API_SUMMARY
- AppLinksAurora() → AppLinksAurora
- registerWith() → void
- getInitialLink() → Future<Uri?>
- getInitialLinkString() → Future<String?>
- getLatestLink() → Future<Uri?>
- getLatestLinkString() → Future<String?>
- uriLinkStream → Stream<Uri>
- stringLinkStream → Stream<String>

## USAGE_PATTERNS
Паттерн: Инициализация
```dart
final _appLinks = AppLinksAurora();
```

Паттерн: Получение начальной ссылки при старте
```dart
_appLinks.getInitialLinkString().then((link) {
  _initialLink = link;
});
```

Паттерн: Подписка на поток ссылок
```dart
late StreamSubscription<Uri> _linkSubscription;
_linkSubscription = _appLinks.uriLinkStream.listen((uri) {
  _latestLink = uri.toString();
});
```

Паттерн: Отмена подписки
```dart
@override
void dispose() {
  _linkSubscription.cancel();
  super.dispose();
}
```

## DEPS
- app_links: ^6.4.1
- app_links_platform_interface: ^2.0.2
- plugin_platform_interface: ^2.0.2

## NOTES
- Платформа: только Aurora OS
- Требуется конфигурация .desktop файла: MimeType=x-scheme-handler/<scheme>; Exec=/usr/bin/<app> %u
- Требуется модификация main.cpp: добавить #include <flutter/flutter_compatibility_qt.h> и aurora::EnableQtCompatibility()
- Совместимость: Aurora OS 5.2+, Flutter 3.35.0+ (для версий 5.1 и Flutter < 3.35.0 ограничения по вложенности данных и регистрации интентов)
- Плагин интегрируется с RuntimeManager Aurora OS для обработки интентов на системном уровне
