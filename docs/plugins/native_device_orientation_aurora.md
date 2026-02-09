<description>
Aurora OS реализация плагина для определения ориентации устройства через датчики или UI. Заменяет нативную реализацию native_device_orientation на платформе Aurora OS.
</description>

# native_device_orientation_aurora

## TYPE
fork (implements native_device_orientation)

## QUICK_START
```dart
final communicator = NativeDeviceOrientationCommunicator();
communicator.onOrientationChanged(useSensor: true).listen((orientation) {
  print('Orientation: $orientation');
});
```

## API_SUMMARY
См. pub.dev/packages/native_device_orientation
- NativeDeviceOrientationReader(builder: Widget Function(BuildContext)) → Widget
- NativeDeviceOrientationReader.orientation(context: BuildContext) → NativeDeviceOrientation
- NativeDeviceOrientedWidget({...portraitUp, portraitDown, landscapeLeft, landscapeRight, fallback, useSensor}) → Widget
- NativeDeviceOrientationCommunicator.onOrientationChanged(useSensor: bool) → Stream<NativeDeviceOrientation>
- NativeDeviceOrientationCommunicator.orientation(useSensor: bool) → Future<NativeDeviceOrientation>
- NativeDeviceOrientationCommunicator.pause() → Future<void>
- NativeDeviceOrientationCommunicator.resume() → Future<void>
- NativeDeviceOrientationCommunicator.cancel() → void

## USAGE_PATTERNS

```dart
// Виджет для отслеживания ориентации
NativeDeviceOrientationReader(
  builder: (context) {
    final orientation = NativeDeviceOrientationReader.orientation(context);
    return Text('$orientation');
  },
)

// Виджет для разного контента при разных ориентациях
NativeDeviceOrientedWidget(
  portraitUp: (context) => Text('Portrait Up'),
  landscapeLeft: (context) => Text('Landscape Left'),
  fallback: (context) => Text('Unknown'),
  useSensor: true,
)

// Получить текущую ориентацию
final orientation = await NativeDeviceOrientationCommunicator().orientation(useSensor: true)

// Поток изменений ориентации
final communicator = NativeDeviceOrientationCommunicator();
communicator.onOrientationChanged(useSensor: true).listen((orientation) {
  print('$orientation');
})

// Пауза/возобновление отслеживания
await NativeDeviceOrientationCommunicator().pause();
await NativeDeviceOrientationCommunicator().resume();
```

## DEPS
native_device_orientation: ^2.0.3

## NOTES
- UI-based ориентация (useSensor: false) на Aurora OS всегда возвращает portraitUp
- Используйте useSensor: true для точного определения ориентации через аппаратные датчики QOrientationSensor
- Требует разрешения Sensors на Aurora OS
- Для Aurora OS версии 5.0.0+
- main.cpp: требуется `aurora::EnableQtCompatibility()`
