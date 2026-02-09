<description>
Реализация flutter_local_notifications для Aurora OS с поддержкой типизированного payload, DBus и предопределенных звуков
</description>

# flutter_local_notifications_aurora

## TYPE
fork

## QUICK_START
```dart
final FlutterLocalNotificationsPlugin notification = FlutterLocalNotificationsPlugin();
await notification.show(1, "Title", "Body", null);
```

## API_SUMMARY
- show(id: int, title: String?, body: String?, {payload: String?}) → void
  Показать базовое уведомление через DBus
- showWithPayload(id: int, title: String?, body: String?, {payload: Payload}) → void
  Показать уведомление с типизированным payload (Aurora-специфично)
- cancel(id: int) → void
  Отменить уведомление по ID
- cancelAll() → void
  Отменить все уведомления
- pendingNotificationRequests() → List<PendingNotificationRequest>
  Получить список ожидающих уведомлений
- periodicallyShow(id: int, title: String?, body: String?, repeatInterval: RepeatInterval) → void
  Показать периодическое уведомление (everyMinute|hourly|daily|weekly)
- periodicallyShowWithDuration(id: int, title: String?, body: String?, repeatDuration: Duration) → void
  Показать периодическое уведомление с кастомной длительностью

## USAGE_PATTERNS
```dart
// Базовое уведомление
await notification.show(id, "Title", "Body", null);

// Уведомление со звуком
await notification.showWithPayload(
  id, "Title", "Body",
  payload: Payload(hints: Hints(sound: Sound.messageNewInstant, urgency: 1))
);

// Уведомление с настройками
await notification.showWithPayload(
  id, "Title", "Body",
  payload: Payload(hints: Hints(
    urgency: 2, // critical
    desktopEntry: 'my_app.desktop',
    sound: Sound.bell
  ))
);

// Периодическое (каждую минуту)
await notification.periodicallyShow(id, "Title", "Body", RepeatInterval.everyMinute);

// Периодическое с Duration
await notification.periodicallyShowWithDuration(id, "Title", "Body", Duration(hours: 2));

// Отмена
await notification.cancel(id);
await notification.cancelAll();
```

## DEPS
flutter_local_notifications: ^18.0.1

## MODELS
### Payload (Aurora-специфично)
- hints: Hints - контейнер настроек уведомления

### Hints
- urgency: int (0-low, 1-normal, 2-critical)
- category: String
- desktopEntry: String (название .desktop файла)
- sound: Sound (предопределенный звук)
- suppressSound: bool
- x, y: int (координаты на экране)
- imageData: String

### Sound (предопределенные звуки)
- bell, complete, dialogError, dialogInformation, dialogWarning
- messageNewInstant, message

## NOTES
- Форк для Aurora OS с дополнительной функциональностью
- Использует DBus через org.freedesktop.Notifications
- Основной API из flutter_local_notifications: см. pub.dev/packages/flutter_local_notifications
- Методы getActiveNotifications() и getNotificationAppLaunchDetails() не реализованы (выбрасывают UnimplementedError)
- Хранение уведомлений только в runtime (очищается при перезапуске)
- Совместимость: Aurora OS 5.0.0+, Flutter 3.32.7+
