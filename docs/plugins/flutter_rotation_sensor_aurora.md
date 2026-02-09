<description>
Aurora OS реализация плагина flutter_rotation_sensor для отслеживания ориентации устройства в пространстве через гироскоп, акселерометр и магнитометр
</description>

# flutter_rotation_sensor_aurora

## TYPE
fork

## QUICK_START
```dart
import 'package:flutter_rotation_sensor/flutter_rotation_sensor.dart';

RotationSensor.samplingPeriod = SensorInterval.uiInterval;
StreamBuilder<OrientationData>(
  stream: RotationSensor.orientationStream,
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      final data = snapshot.data!;
      print('Quaternion: ${data.quaternion}');
      print('Euler: ${data.eulerAngles}');
      print('Matrix: ${data.rotationMatrix}');
    }
  },
)
```

## API_SUMMARY
**Полный API см. в [flutter_rotation_sensor на pub.dev](https://pub.dev/packages/flutter_rotation_sensor)**

- RotationSensor.orientationStream → Stream<OrientationData>
  - Основной поток данных ориентации устройства

- RotationSensor.samplingPeriod → Duration
  - Интервал обновления сенсора (по умолчанию 200ms)

- RotationSensor.coordinateSystem → CoordinateSystem
  - Настройка системы координат (display/device/transformed)

- OrientationData.quaternion → Quaternion
  - Кватернион ориентации (x, y, z, w)

- OrientationData.eulerAngles → EulerAngles
  - Углы Эйлера (azimuth, pitch, roll)

- OrientationData.rotationMatrix → Matrix3
  - Матрица вращения 3x3

- OrientationData.accuracy → int
  - Точность данных (всегда -1 на Aurora OS)

- OrientationData.timestamp → int
  - Временная метка данных

## USAGE_PATTERNS

**Паттерн: Подписка на поток с интервалом UI**
```dart
RotationSensor.samplingPeriod = SensorInterval.uiInterval;
final subscription = RotationSensor.orientationStream.listen((data) {
  print('Azimuth: ${data.eulerAngles.azimuth}');
});
```

**Паттерн: StreamBuilder для UI**
```dart
StreamBuilder<OrientationData>(
  stream: RotationSensor.orientationStream,
  builder: (context, snapshot) {
    if (!snapshot.hasData) return CircularProgressIndicator();
    final data = snapshot.data!;
    return Text('${data.quaternion}');
  },
)
```

**Паттерн: Настройка частоты обновления**
```dart
// Для игр (20ms)
RotationSensor.samplingPeriod = SensorInterval.gameInterval;
// Для UI (66ms)
RotationSensor.samplingPeriod = SensorInterval.uiInterval;
// Обычный режим (200ms)
RotationSensor.samplingPeriod = SensorInterval.normal;
// Максимальная скорость
RotationSensor.samplingPeriod = SensorInterval.fastest;
```

**Паттерн: Преобразование системы координат**
```dart
RotationSensor.coordinateSystem = CoordinateSystem.transformed(Axis3.X, Axis3.Z);
```

## DEPS
flutter_rotation_sensor: ^0.1.1 (см. https://pub.dev/packages/flutter_rotation_sensor)

## NOTES

**Требования Aurora OS:**
- Версия Aurora OS: 5.0.0+
- Qt 5: Qt5Core, Qt5Gui, Qt5Sensors
- Разрешение: Sensors

**Особенности реализации:**
- Использует фильтр Madgwick для слияния данных гироскопа, акселерометра и магнитометра
- Синхронизация сенсоров в окне 50ms
- Частота по умолчанию: 100Hz

**Ограничения Aurora OS:**
- Точность сенсора (accuracy) всегда возвращает -1 (нет информации о точности)
- При переключении ориентации устройства требуется получить несколько кадров данных для стабилизации

**Установка:**
```yaml
dependencies:
  flutter_rotation_sensor: ^0.1.1
  flutter_rotation_sensor_aurora:
    git:
      url: https://developer.auroraos.ru/git/flutter/flutter-community-plugins/flutter_rotation_sensor_aurora.git
```

**В main.cpp требуется:**
```cpp
#include <flutter/flutter_compatibility_qt.h>

int main(int argc, char *argv[]) {
    aurora::FlutterApp app(argc, argv);
    aurora::EnableQtCompatibility();
    ...
}
```
