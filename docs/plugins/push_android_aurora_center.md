<description>
Android реализация пакета push для работы с Aurora Center вместо Firebase FCM. Обработка push-уведомлений для Android 6.0+.
</description>

# push_android_aurora_center

## TYPE
custom

## QUICK_START
```dart
WidgetsFlutterBinding.ensureInitialized();
PushAndroidAuroraCenter.initialize();
```

## API_SUMMARY
- initialize() → void - Инициализирует плагин и заменяет стандартную реализацию push на Aurora Center
- token → Future<String?> - Возвращает токен регистрации устройства (RegistrationID)
- areNotificationsEnabled() → Future<bool> - Проверяет включены ли уведомления
- requestPermission({bool badge, bool sound, bool alert, ...}) → Future<bool> - Запрашивает разрешения на уведомления
- notificationTapWhichLaunchedAppFromTerminated → Future<Map<String?, Object?>?> - Данные push, открывшего приложение из terminated
- deleteToken() → Future<void> - Удаляет токен (no-op, Aurora Center не поддерживает)
- resetHandlers() → void - Очищает все обработчики
- addOnMessage(FutureOr<void> Function(RemoteMessage) handler) → VoidCallback - Добавляет обработчик для foreground
- addOnBackgroundMessage(FutureOr<void> Function(RemoteMessage) handler) → VoidCallback - Добавляет обработчик для background/terminated
- addOnNotificationTap(void Function(Map<String, dynamic>) handler) → VoidCallback - Добавляет обработчик тапа по уведомлению
- addOnNewToken(void Function(String) handler) → VoidCallback - Добавляет обработчик обновления токена

## USAGE_PATTERNS
Паттерн: Инициализация перед runApp()
```dart
WidgetsFlutterBinding.ensureInitialized();
PushAndroidAuroraCenter.initialize();
runApp(const MyApp());
```

Паттерн: Получение экземпляра и токена
```dart
final push = Push.instance;
final token = await push.token;
```

Паттерн: Foreground обработчик (приложение активно)
```dart
push.addOnMessage((RemoteMessage message) {
  print('Foreground: ${message.data}');
});
```

Паттерн: Background обработчик (функция класса)
```dart
void backgroundHandler(RemoteMessage message) {
  print('Background: ${message.data}');
}
push.addOnBackgroundMessage(backgroundHandler);
```

Паттерн: Terminated обработчик (топ-левая функция с @pragma)
```dart
@pragma("vm:entry-point")
void terminatedHandler(RemoteMessage message) {
  print('Terminated: ${message.data}');
}
push.addOnBackgroundMessage(terminatedHandler);
```

Паттерн: Обработка тапа по уведомлению
```dart
push.addOnNotificationTap((Map<String, dynamic> data) {
  print('Notification tapped: $data');
});
```

Паттерн: Запрос разрешения
```dart
final granted = await push.requestPermission();
if (granted) { /* уведомления включены */ }
```

## DEPS
- push: ^3.0.0
- flutter: sdk
- flutter_lints: ^4.0.0 (dev)

## NOTES
- Требует applicationId в AndroidManifest.xml: `<meta-data android:name="omp.push.APP_ID" android:value="YOUR_applicationId" />`
- Добавить Maven репозиторий Aurora Center в android/build.gradle: `maven { url "https://maven.omp.ru/repository/maven/" }`
- Не поддерживает отображение изображений в уведомлениях
- Не поддерживает воспроизведение звука уведомлений
- deleteToken() не работает (no-op для совместимости интерфейса)
- Платформа: Android 6.0+
