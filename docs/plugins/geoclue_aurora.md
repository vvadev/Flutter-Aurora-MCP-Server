<description>
Плагин предоставляет доступ к сервису геолокации GeoClue на устройствах ОС Аврора через D-Bus. Форк плагина geoclue для ОС Аврора с автоматическим выбором API в зависимости от версии системы.
</description>

# GEOCLUE_AURORA

## TYPE
fork

## QUICK_START
```dart
final master = GeoClueMaster();
final location = await GeoClue.getLocation(master: master, accuracyLevel: GeoClueAccuracyLevel.country, allowedResources: 1023);
```

## API_SUMMARY
### GeoClue (статический упрощённый API)
- getLocation(master: GeoClueMaster?, accuracyLevel: GeoClueAccuracyLevel, allowedResources: int?, updateInterval: int) → Future<GeoCluePosition>
- getVelocity(master: GeoClueMaster?, accuracyLevel: GeoClueAccuracyLevel, allowedResources: int?, updateInterval: int) → Future<GeoClueVelocity>
- getLocationUpdates(master: GeoClueMaster?, accuracyLevel: GeoClueAccuracyLevel, allowedResources: int?, updateInterval: int?) → Stream<GeoCluePosition>
- getVelocityUpdates(master: GeoClueMaster?, accuracyLevel: GeoClueAccuracyLevel, allowedResources: int?, updateInterval: int?) → Stream<GeoClueVelocity>
- getPositionProviderUpdates(master: GeoClueMaster?, accuracyLevel: GeoClueAccuracyLevel, allowedResources: int?, updateInterval: int?) → Stream<GeoCluePositionProvider>
- dispose() → Future<void>

### GeoClueMaster (управление соединением)
- GeoClueMaster({DBusClient? bus, DBusRemoteObject? object})
- createMasterClient() → Future<GeoClueMasterClient>
- getMasterClient() → Future<GeoClueMasterClient>
- releaseMasterClient() → Future<void>
- dispose() → Future<void>

### GeoClueMasterClient (расширенный API)
- start() → Future<void>
- stop() → Future<void>
- setRequirements(accuracyLevel: int, time: int, requireUpdates: bool, allowedResources: int) → Future<void>
- positionStart() → Future<void>
- addressStart() → Future<void>
- getPosition() → Future<GeoCluePosition?>
- getVelocity() → Future<GeoClueVelocity?>
- getPositionProvider() → Future<GeoCluePositionProvider?>
- getAddressProvider() → Future<GeoClueAddress?>
- position (getter) → GeoCluePosition?
- velocity (getter) → GeoClueVelocity?
- positionUpdated (getter) → Stream<GeoCluePosition>
- velocityUpdated (getter) → Stream<GeoClueVelocity>
- positionProviderUpdated (getter) → Stream<GeoCluePositionProvider>

### GeoCluePosition (данные позиции)
- latitude: double (широта в градусах)
- longitude: double (долгота в градусах)
- accuracy: double (точность в метрах)
- altitude: double? (высота в метрах)
- timestamp: DateTime? (время определения позиции)
- heading: double? (направление в градусах от Севера)
- description: String? (человеко-читаемое описание)

### GeoClueVelocity (данные скорости)
- speed: double (скорость)
- direction: double (направление)
- climb: double (подъём/спуск)
- timestamp: DateTime? (время определения)

### GeoCluePositionProvider (информация о провайдере)
- name: String?
- description: String?
- interface: String?
- path: String?

### GeoClueAccuracyLevel (уровни точности)
- none (0), country (1), region (2), locality (3), postalcode (4), street (5), detailed (6)

### AuroraVersionService (сервис версии ОС)
- instance (getter) → AuroraVersionService
- getOsVersion() → Future<String>
- isNewGeoApi() → Future<bool>
- currentApiVersion (getter) → Future<String>

## USAGE_PATTERNS
Паттерн: Получение текущей позиции
```dart
final master = GeoClueMaster();
final position = await GeoClue.getLocation(master: master, accuracyLevel: GeoClueAccuracyLevel.country);
```
Результат: GeoCluePosition с координатами

Паттерн: Подписка на обновления позиции
```dart
final master = GeoClueMaster();
final stream = GeoClue.getLocationUpdates(master: master, accuracyLevel: GeoClueAccuracyLevel.street);
stream.listen((pos) => print('${pos.latitude}, ${pos.longitude}'));
```
Результат: Stream<GeoCluePosition> с периодическими обновлениями

Паттерн: Расширенное управление через GeoClueMasterClient
```dart
final master = GeoClueMaster();
final client = await master.createMasterClient();
await client.setRequirements(5, 0, true, 1023);
await client.start();
final position = await client.getPosition();
```
Результат: GeoCluePosition через клиентское API

Паттерн: Определение версии API
```dart
final service = AuroraVersionService.instance;
final isNewApi = await service.isNewGeoApi(); // true для Aurora >= 5.2.0
final version = await service.getOsVersion(); // "Aurora 5.2.0.105"
```
Результат: Информация о версии ОС и типе API

## DEPS
dbus: ^0.7.10
meta: ^1.7.0
logging: ^1.2.0

См. полную документацию на pub.dev/packages/geoclue

## NOTES
- Плагин автоматически выбирает API в зависимости от версии ОС Аврора (>=5.2.0 - новый API, <5.2.0 - legacy API)
- Требует ОС Аврора версии 5.0.0+
- Требует Flutter 3.32.7+
- Требует разрешения Location и Internet в pubspec.yaml
- Использует D-Bus для связи с GeoClue сервисом
- Master-параметр в GeoClue методах сохранён для совместимости, но игнорируется в новом API (>=5.2.0)
- Позиция может быть null до первого обновления после start()
- UpdateInterval по умолчанию 1000 мс
- GeoClueVelocity использует либо gpsd3, либо hybris провайдер в зависимости от доступности
