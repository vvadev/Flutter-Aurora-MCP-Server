<description>
Плагин для управления вибромотором на устройствах с ОС Аврора с поддержкой эффектов и амплитуды
</description>

# vibration_aurora

## TYPE
custom

## QUICK_START
```dart
import 'package:vibration/vibration.dart';
import 'package:vibration_aurora/vibration_aurora.dart';
```

## API_SUMMARY

### VibrationAurora
- hasVibrator() → Future<bool>
- hasAmplitudeControl() → Future<bool>
- hasCustomVibrationsSupport() → Future<bool>
- vibrate({duration: int, amplitude: int, pattern: List<int>, repeat: int, intensities: List<int>, sharpness: double, effect: VibrateEffect}) → Future<void>
- cancel() → Future<void>

### VibrateEffect (enum)
- press, release, pressWeak, releaseWeak, pressStrong, releaseStrong, dragStart, dragDropInZone, dragDropOutOfZone, dragCrossBoundary, appear, disappear, move

### TimeVibration
- TimeVibration(duration: int, amplitude: int)

### EffectVibration
- EffectVibration(effect: VibrateEffect)

## USAGE_PATTERNS

Паттерн: Проверка наличия вибромотора
```dart
await Vibration.hasVibrator()
```
Результат: true/false

Паттерн: Вибрация с длительностью и амплитудой
```dart
Vibration.vibrate(duration: 2000, amplitude: 255)
```
Результат: Вибрация 2 секунды, максимальная амплитуда

Паттерн: Вибрация с предопределённым эффектом
```dart
VibrationAurora().vibrate(effect: VibrateEffect.press)
```
Результат: Эффект нажатия

Паттерн: Остановка вибрации
```dart
Vibration.cancel()
```
Результат: Прекращение текущей вибрации

## DEPS
- flutter: ^3.32.7
- plugin_platform_interface: ^2.0.2
- vibration_platform_interface: ^0.1.0

## NOTES
- Только для Aurora OS >= 5.0.0
- Требуется Qt поддержка в aurora/main.cpp: `aurora::EnableQtCompatibility()`
- Амплитуда: 1-255 (по умолчанию 1)
- Длительность по умолчанию: 500 мс
- Параметр effect переопределяет duration/amplitude
- Возможны проблемы с амплитудой на некоторых устройствах
