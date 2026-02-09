<description>
Push-уведомления для Aurora OS. Реализует интерфейс пакета push с доп. методами для регистрации приложения, отслеживания состояния и обработки ошибок.
</description>

# push_aurora

## TYPE
custom

## QUICK_START
```dart
final pushAuroraPlugin = Push.instance;
await PushAurora.setApplicationId("your_app_id");
PushAurora.handleStateChange(AppLifecycleState.resumed);
```

## API_SUMMARY
- PushAurora.setApplicationId(applicationId: String) → Future<void>
  Устанавливает ID приложения для регистрации в Aurora Center. Вызывать после инициализации плагина.
- PushAurora.handleStateChange(state: AppLifecycleState) → Future<void>
  Передает текущее состояние приложения для определения типа уведомления (фон/фронт).
- PushAurora.getRegistrationFailureError() → Future<String?>
  Возвращает код и описание последней ошибки регистрации или null.

## USAGE_PATTERNS

**Инициализация плагина:**
```dart
pushAuroraPlugin = Push.instance;
await PushAurora.setApplicationId("your_app_id");
PushAurora.handleStateChange(AppLifecycleState.resumed);
```
Результат: плагин зарегистрирован в Aurora Center

**Отслеживание жизненного цикла:**
```dart
AppLifecycleListener(onStateChange: (state) => PushAurora.handleStateChange(state));
```
Результат: автоматическая передача состояния приложения плагину

**Обработка событий push (через пакет push):**
```dart
pushAuroraPlugin.addOnMessage((RemoteMessage push) { /* foreground */ });
pushAuroraPlugin.addOnBackgroundMessage((RemoteMessage push) { /* background */ });
pushAuroraPlugin.addOnNewToken((String token) { /* новый токен */ });
pushAuroraPlugin.addOnNotificationTap((Map<String?, Object?> data) { /* tap */ });
```
Результат: обработчики подключены к потоку событий

**Проверка состояния регистрации:**
```dart
bool enabled = await pushAuroraPlugin.areNotificationsEnabled();
String? error = await PushAurora.getRegistrationFailureError();
String? token = pushAuroraPlugin.token;
```
Результат: статус регистрации, ошибка (если есть), токен регистрации

## DEPS
- push: ^3.3.3
- flutter: ^3.32.7
- aurora_libspdlog (из git репозитория Aurora)

## NOTES
- **Платформа:** Aurora OS 5.1.3+
- **Обязательно:** вызов setApplicationId() после инициализации плагина, иначе регистрация не сработает
- **При resumed:** уведомления не показываются системой, обрабатываются через onMessage
- **При других состояниях:** уведомления показываются системой, обрабатываются через onBackgroundMessage
- **Нативные требования:** push-daemon, Qt5Core, Qt5DBus, pushclient >= 2.0.0, nemonotifications-qt5
- **Разрешения:** PushNotifications, UserDirs
- **DBus:** требуется настройка ExecDBus и ExportDBusInterfaces в .desktop файле
- **main.cpp:** необходим вызов aurora::EnableQtCompatibility()
