<description>
Запуск URL в системном браузере на Aurora OS
</description>

# URL_LAUNCHER

## TYPE
fork

## QUICK_START
```dart
import 'package:url_launcher/url_launcher.dart';

// main.cpp: aurora::EnableQtCompatibility();

final launched = await launchUrl(Uri.parse('https://example.com'));
```

## API_SUMMARY
- launchUrl(Uri url, {mode, webViewConfiguration, browserConfiguration, webOnlyWindowName}) → Future<bool>
- canLaunchUrl(Uri url) → Future<bool>
- closeInAppWebView() → Future<void> [НЕ ПОДДЕРЖИВАЕТСЯ]
- supportsLaunchMode(LaunchMode mode) → Future<bool>
- supportsCloseForLaunchMode(LaunchMode mode) → Future<bool>

### LaunchMode enum
- platformDefault, externalApplication, inAppWebView, inAppBrowserView

## USAGE_PATTERNS

**Запуск URL:**
```dart
await launchUrl(Uri.parse('https://example.com'));
```
Результат: true если успешно, иначе false или ошибка

**Проверка возможности запуска:**
```dart
final canLaunch = await canLaunchUrl(Uri.parse('https://example.com'));
```
Результат: true/false

**Запуск с режимом:**
```dart
await launchUrl(
  Uri.parse('https://example.com'),
  mode: LaunchMode.externalApplication,
);
```
Результат: true/false

## DEPS
- url_launcher: ^6.3.1
- url_launcher_aurora: SDK flutter
- url_launcher_platform_interface: ^2.3.2

## NOTES
**Поддержка на Aurora:**
- launchUrl - поддерживается (http, https, mailto, tel, file)
- canLaunchUrl - поддерживается
- closeInAppWebView - НЕ поддерживается

**Ограничения:**
- Требуется aurora::EnableQtCompatibility() в main.cpp
- inAppWebView/inAppBrowserView режимы НЕ поддерживаются
- closeInAppWebView выбрасывает UnsupportedError
- supportsLaunchMode возвращает true только для platformDefault и externalApplication
- canLaunch возвращает true только для http/https/mailto/tel/file схем

**Требования:**
- SDK: >=3.6.0
- Flutter: >=3.27.0
