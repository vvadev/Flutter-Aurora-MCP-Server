<description>
Плагин для определения запуска приложения на Aurora OS. Проверяет наличие строки ID=auroraos в файле /etc/os-release на Linux системах.
</description>

# platform_aurora

## TYPE
custom

## QUICK_START
```dart
import 'package:platform_aurora/platform_aurora.dart';
if (kIsAurora) { /* Aurora OS */ }
```

## API_SUMMARY
- `PlatformAurora.isAurora` → bool
- `kIsAurora` → bool

## USAGE_PATTERNS
Паттерн: `if (PlatformAurora.isAurora) { /* code */ }`
Результат: выполняется только на Aurora OS

Паттерн: `if (kIsAurora) { /* code */ }`
Результат: выполняется только на Aurora OS

## DEPS
flutter: sdk

## NOTES
Работает только при Platform.isLinux. Проверяет файл /etc/os-release. Безопасен для Flutter SDK stable и Flutter-Aurora.
