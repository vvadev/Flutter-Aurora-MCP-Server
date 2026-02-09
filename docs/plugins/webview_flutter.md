<description>
Виджет WebView на основе системной библиотеки Aurora OS webview
</description>

# WEBVIEW_FLUTTER

## TYPE
fork

## QUICK_START
```dart
import 'package:webview_flutter/webview_flutter.dart';

// main.cpp: aurora::EnableQtCompatibility();
// Добавить Qt зависимости и WebviewFlutterAuroraPlugin::StartProcess

final controller = WebViewController.fromPlatformCreationParams(
  const PlatformWebViewControllerCreationParams(),
);

WebViewWidget(controller: controller);
```

## API_SUMMARY
- WebViewController.fromPlatformCreationParams(PlatformWebViewControllerCreationParams params)
- WebViewController.fromPlatformCreationParamsWithSettings(...)
- loadRequest(LoadRequestParams request) → Future<void>
- loadHtmlString(String html) → Future<void>
- loadFlutterAsset(String assetKey) → Future<void>
- getTitle() → Future<String?>
- getCurrentUrl() → Future<String?>
- getScrollPosition() → Future<int>
- setScrollPosition(int position) → Future<void>
- canGoBack() → Future<bool>
- canGoForward() → Future<bool>
- goBack() → Future<void>
- goForward() → Future<void>
- reload() → Future<void>
- clearCache() → Future<void>
- clearCookies() → Future<void>
- runJavaScript(String javaScript) → Future<String?>
- runJavaScriptReturningResult(String javaScript) → Future<JavaScriptMessage>
- setJavaScriptMode(JavaScriptMode mode)
- addJavaScriptChannel(JavaScriptChannelParams params)
- removeJavaScriptChannel(String channelName)

## USAGE_PATTERNS

**Загрузка URL:**
```dart
final controller = WebViewController.fromPlatformCreationParams(
  const PlatformWebViewControllerCreationParams(),
);
await controller.loadRequest(LoadRequestParams(uri: Uri.parse('https://example.com')));
```
Результат: страница загружена в WebView

**Загрузка HTML:**
```dart
await controller.loadHtmlString('<html><body>Hello</body></html>');
```
Результат: HTML отображён в WebView

**Навигация:**
```dart
controller.goBack();
controller.goForward();
controller.reload();
```

**Выполнение JavaScript:**
```dart
final result = await controller.runJavaScript('document.title');
```
Результат: результат выполнения JS или null

**JavaScript канал:**
```dart
controller.addJavaScriptChannel(
  JavaScriptChannelParams(name: 'myChannel', onMessageReceived: (message) {
    print(message.message);
  }),
);
```

## DEPS
- webview_flutter: ^4.10.0
- webview_flutter_aurora: SDK flutter
- webview_flutter_platform_interface: ^2.10.0
- aurora_libaurorawebview: SDK flutter

## NOTES
**Поддержка на Aurora:**
- WebViewWidget - поддерживается
- WebViewController - поддерживается
- JavaScript - поддерживается
- JavaScript Channels - поддерживаются
- Навигация - поддерживается
- Cookies - поддерживаются

**Требования к конфигурации:**
```cpp
// main.cpp
aurora::EnableQtCompatibility();
WebviewFlutterAuroraPlugin::StartProcess(argc, argv, WEBVIEW_SUBPROCESS_LAUNCHER_INSTALL_PATH);
WebviewFlutterAuroraPlugin::InitQCA();

// .spec файл
WEBVIEW_SUBPROCESS_LAUNCHER_INSTALL_PATH для subprocess launcher

// CMakeLists.txt
Qt5::Core, Qt5::Gui, auroraapp
```

**Ограничения:**
- Требуется OS Aurora >= 5.1.3
- Требуется Qt совместимость (aurora::EnableQtCompatibility)
- Требуется WebviewFlutterAuroraPlugin::StartProcess в main.cpp
- Сложная конфигурация для .spec и CMakeLists.txt
- Разрешения: Internet, UserDirs, DeviceInfo, Audio, CryptoPro

**Особенности:**
- Использует библиотеку Aurora OS webview
- Основан на flutter_linux_webview
- Поддерживает Qt и QCA для криптографии
