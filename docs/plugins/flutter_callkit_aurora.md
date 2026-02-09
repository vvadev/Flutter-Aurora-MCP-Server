<description>
Flutter плагин для отображения входящих и исходящих звонков в приложении на Aurora OS. Реализует flutter_callkit_incoming для Авроры с интеграцией системного Call API через DBus.
</description>

# flutter_callkit_aurora

## TYPE
fork

## QUICK_START
```dart
final callKitParams = CallKitParams(
  id: "unique-call-id-12345",
  nameCaller: 'John Doe',
  handle: '1234567890',
  normalHandle: 1111111111,
  type: 0,
  duration: 5000,
  appName: 'My Awesome App',
  missedCallNotification: const NotificationParams(
    showNotification: true,
    isShowCallback: true,
    subtitle: 'Missed call',
    callbackText: 'Call back',
  ),
);
await FlutterCallkitIncoming.showCallkitIncoming(callKitParams);
```

## API_SUMMARY
API соответствует flutter_callkit_incoming (см. pub.dev/packages/flutter_callkit_incoming).

Методы:
- showCallkitIncoming(params: CallKitParams) → void
- startCall(params: CallKitParams) → void
- showMissCallNotification(params: CallKitParams) → void
- endCall(uuid: String) → void
- holdCall(uuid: String, isOnHold: bool) → void
- callConnected(uuid: String) → void
- activeCalls() → Map<String, dynamic>?
- muteCall(uuid: String) → void
- isMuted(uuid: String) → bool

Классы:
- CallKitParams(id, nameCaller, handle, normalHandle, type, duration, appName, avatar, textAccept, textDecline, missedCallNotification, callingNotification, extra, headers)
- NotificationParams(id, showNotification, isShowCallback, subtitle, callbackText, count)

## USAGE_PATTERNS
Паттерн: Показать входящий звонок
```dart
await FlutterCallkitIncoming.showCallkitIncoming(CallKitParams(
  id: "call-id",
  nameCaller: 'John',
  handle: '1234567890',
  type: 0,
));
```
Результат: Системный экран входящего звонка на Aurora OS

Паттерн: Начать исходящий звонок
```dart
await FlutterCallkitIncoming.startCall(CallKitParams(
  id: "call-id",
  nameCaller: 'John',
  handle: '1234567890',
  type: 0,
));
```
Результат: Системный экран исходящего звонка, автоответ через 5 сек

Паттерн: Завершить звонок
```dart
await FlutterCallkitIncoming.endCall("call-id");
```
Результат: Звонок завершен, аудиоресурсы освобождены

Паттерн: Управление удержанием
```dart
await FlutterCallkitIncoming.holdCall("call-id", isOnHold: true);
```
Результат: Звонок на удержании

Паттерн: Управление микрофоном
```dart
await FlutterCallkitIncoming.muteCall("call-id");
bool muted = await FlutterCallkitIncoming.isMuted("call-id");
```
Результат: Микрофон переключен, статус получен

Паттерн: Получить параметры активного звонка
```dart
Map? params = await FlutterCallkitIncoming.activeCalls();
```
Результат: Параметры текущего звонка или null

## DEPS
flutter_callkit_incoming: ^2.5.2
dbus: ^0.7.10
flutter_local_notifications: ^18.0.1
flutter_local_notifications_aurora: v0.6.0
aurora_libspdlog: v0.2.0

## NOTES
Aurora OS: 5.1.3+
main.cpp требует включение QT:
```cpp
#include <flutter/flutter_compatibility_qt.h>
aurora::EnableQtCompatibility();
```
Разрешения (Call, Audio, UserDirs, PushNotifications) получаются при запуске приложения автоматически.
Автоматическое управление аудиоресурсами при статусах Active/Dialing/Held.
Не поддерживается воспроизведение звука во время звонка на эмуляторе.
Не реализованы: requestNotificationPermission, requestFullIntentPermission, getDevicePushTokenVoIP, hideCallkitIncoming, silenceEvents, unsilenceEvents.
