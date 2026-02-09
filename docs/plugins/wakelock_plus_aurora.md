<description>
Aurora OS реализация плагина wakelock_plus для предотвращения засыпания экрана устройства через DBus
</description>

# wakelock_plus_aurora

## TYPE
fork

## QUICK_START
```dart
await WakelockPlus.enable(); // включить wakelock
await WakelockPlus.disable(); // выключить wakelock
```

## API_SUMMARY
- toggle({required bool enable}) → Future<void>
- enabled → Future<bool>
См. pub.dev/packages/wakelock_plus для полного API

## USAGE_PATTERNS
Паттерн: `await WakelockPlus.enable(); await WakelockPlus.enabled;`
Результат: Включает блокировку экрана и возвращает true

Паттерн: `await WakelockPlus.disable(); await WakelockPlus.enabled;`
Результат: Отключает блокировку и возвращает false

## DEPS
wakelock_plus: ^1.2.8
wakelock_plus_aurora: aurora-0.5.3

## NOTES
Работает только на Aurora OS через DBus (com.nokia.mce)
Требует одновременной установки wakelock_plus и wakelock_plus_aurora
Таймер обновления каждые 60 секунд для поддержания wakelock
