<description>
Плагин геолокации для Flutter на AuroraOS. Реализует интерфейс geolocator через GeoClue, предоставляет текущую позицию, поток обновлений, кэширование последней позиции и математические функции для расчёта расстояний и направлений.
</description>

# GEOLocator_AURORA

## TYPE
custom

## QUICK_START
```yaml
dependencies:
  geolocator_aurora:
    git: https://developer.auroraos.ru/git/flutter/flutter-community-plugins/geolocator_aurora.git
```
```dart
final geolocator = GeolocatorPlatform.instance;
final position = await geolocator.getCurrentPosition();
```

## API_SUMMARY
- getCurrentPosition(locationSettings?: LocationSettings) → Future<Position>
  Возвращает текущую позицию с валидацией координат и кэшированием скорости/направления
- getPositionStream(locationSettings?: LocationSettings) → Stream<Position>
  Поток обновлений позиции с автоматической валидацией и кэшированием
- getLastKnownPosition(forceLocationManager?: bool) → Future<Position?>
  Последняя известная позиция из кэша
- isLocationServiceEnabled() → Future<bool>
  Проверка доступности GeoClue через DBus
- getServiceStatusStream() → Stream<ServiceStatus>
  Поток статуса службы (обновляется каждые 5 сек)
- checkPermission() → Future<LocationPermission>
  Всегда возвращает LocationPermission.always
- requestPermission() → Future<LocationPermission>
  Всегда возвращает LocationPermission.always
- getLocationAccuracy() → Future<LocationAccuracyStatus>
  Текущий уровень точности (precise/reduced/unknown)
- distanceBetween(startLat, startLon, endLat, endLon) → double
  Расстояние между двумя точками в метрах (Haversine)
- bearingBetween(startLat, startLon, endLat, endLon) → double
  Азимут от начальной к конечной точке в градусах

## USAGE_PATTERNS
Паттерн: `await GeolocatorPlatform.instance.getCurrentPosition()`
Результат: Position с валидными координатами, скоростью, направлением

Паттерн: `GeolocatorPlatform.instance.getPositionStream()`
Результат: Stream<Position> с автообновлением

Паттерн: `GeolocatorPlatform.instance.getLastKnownPosition()`
Результат: Position? (null если нет данных)

Паттерн: `GeolocatorPlatform.instance.getServiceStatusStream()`
Результат: Stream<ServiceStatus> (enabled/disabled)

Паттерн: `GeolocatorPlatform.instance.distanceBetween(lat1, lon1, lat2, lon2)`
Результат: double (расстояние в метрах)

## DEPS
- flutter: ^3.32.7
- geolocator_platform_interface: ^4.1.0
- dbus: ^0.7.3
- geoclue_aurora: git
  url: https://developer.auroraos.ru/git/flutter/flutter-community-plugins/geoclue_aurora.git

## NOTES
- Требуется AuroraOS 5.0.0+
- Использует только спутники (GeoClue)
- Автоматическая валидация координат: фильтрует NaN, Infinity, (0,0)
- Кэширует последнюю валидную позицию для возврата при ошибках
- Разрешения всегда granted (LocationPermission.always)
- openLocationSettings() возвращает false
- requestTemporaryFullAccuracy() выбрасывает PERMISSION_DENIED
