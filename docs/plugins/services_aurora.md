<description>
Flutter плагин для проверки запуска приложения на платформе Aurora OS
Используется для определения операционной системы и платформы при разработке Flutter приложений
</description>

# services_aurora

## TYPE
custom

## QUICK_START
```dart
import 'package:services_aurora/services_aurora.dart';
ServicesAurora.isAurora
```

## API_SUMMARY
- `static bool get isAurora` → bool - возвращает true если приложение работает на Aurora OS
- `static void registerWith()` → void - регистрирует плагин при старте приложения (автоматический вызов)

## USAGE_PATTERNS
```dart
Text('Aurora: ${ServicesAurora.isAurora}')
```
Результат: Отображение статуса платформы

## DEPS
- Flutter SDK: ^3.8.1
- Flutter: ^3.32.7
- Aurora OS: 5.0.0+

## NOTES
- Плагин проверяет наличие файла /etc/os-release и строку ID=auroraos
- Переменная _isAurora устанавливается один раз при запуске приложения
- Работает только на платформе Aurora (Linux)
- registerWith() вызывается автоматически через generated_plugin_registrant
