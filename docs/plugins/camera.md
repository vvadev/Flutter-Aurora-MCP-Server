<description>
Flutter плагин для работы с камерой на платформе Aurora. Позволяет получать список доступных камер, отображать превью, делать фото, записывать видео, управлять настройками (вспышка, фокус, экспозиция, зум). Реализует стандартный API camera_platform_interface.
</description>

# camera

## TYPE
custom (based on camera_platform_interface, Aurora implementation: camera_aurora)

## QUICK_START
```dart
final cameras = await availableCameras();
final controller = CameraController(cameras[0], ResolutionPreset.medium);
await controller.initialize();
CameraPreview(controller);
```

## API_SUMMARY

### Functions
- availableCameras() → Future<List<CameraDescription>> - Возвращает список доступных камер

### Classes
- CameraController - Управляет камерой и настройками
  - CameraController(description, ResolutionPreset, {bool enableAudio, int? fps, int? videoBitrate, int? audioBitrate, ImageFormatGroup? imageFormatGroup})
  - initialize() → Future<void> - Инициализирует камеру
  - dispose() → Future<void> - Освобождает ресурсы
  - prepareForVideoRecording() → Future<void> - Подготовка к записи видео (iOS)
  - pausePreview() → Future<void> - Пауза превью
  - resumePreview() → Future<void> - Возобновление превью
  - setDescription(CameraDescription) → Future<void> - Сменить камеру
  - takePicture() → Future<XFile> - Сделать фото
  - startImageStream(onLatestImageAvailable) → Future<void> - Запустить поток изображений
  - stopImageStream() → Future<void> - Остановить поток изображений
  - startVideoRecording({onLatestImageAvailable?}) → Future<void> - Начать запись видео
  - stopVideoRecording() → Future<XFile> - Остановить запись видео
  - pauseVideoRecording() → Future<void> - Пауза записи видео
  - resumeVideoRecording() → Future<void> - Возобновить запись видео
  - buildPreview() → Widget - Создать виджет превью
  - getMaxZoomLevel() → Future<double> - Максимальный зум
  - getMinZoomLevel() → Future<double> - Минимальный зум
  - setZoomLevel(double) → Future<void> - Установить зум
  - setFlashMode(FlashMode) → Future<void> - Установить вспышку
  - setExposureMode(ExposureMode) → Future<void> - Установить режим экспозиции
  - setExposurePoint(Offset?) → Future<void> - Установить точку экспозиции (0-1)
  - setExposureOffset(double) → Future<double> - Установить смещение экспозиции в EV
  - getMinExposureOffset() → Future<double> - Минимальное смещение экспозиции
  - getMaxExposureOffset() → Future<double> - Максимальное смещение экспозиции
  - getExposureOffsetStepSize() → Future<double> - Шаг смещения экспозиции
  - setFocusMode(FocusMode) → Future<void> - Установить режим фокуса
  - setFocusPoint(Offset?) → Future<void> - Установить точку фокуса (0-1)
  - lockCaptureOrientation([DeviceOrientation?]) → Future<void> - Заблокировать ориентацию
  - unlockCaptureOrientation() → Future<void> - Разблокировать ориентацию
  - supportsImageStreaming() → bool - Поддерживается ли поток изображений
  - value → CameraValue - Текущее состояние
  - description → CameraDescription - Описание камеры
  - cameraId → int - ID камеры

- CameraValue - Состояние контроллера
  - isInitialized → bool - Камера инициализирована
  - isRecordingVideo → bool - Ведётся запись видео
  - isRecordingPaused → bool - Запись видео на паузе
  - isTakingPicture → bool - Делается фото
  - isStreamingImages → bool - Идёт поток изображений
  - isPreviewPaused → bool - Превью на паузе
  - hasError → bool - Есть ошибка
  - errorDescription → String? - Описание ошибки
  - previewSize → Size? - Размер превью
  - aspectRatio → double - Соотношение сторон
  - flashMode → FlashMode - Режим вспышки
  - exposureMode → ExposureMode - Режим экспозиции
  - focusMode → FocusMode - Режим фокуса
  - exposurePointSupported → bool - Поддерживается точка экспозиции
  - focusPointSupported → bool - Поддерживается точка фокуса
  - deviceOrientation → DeviceOrientation - Ориентация устройства
  - lockedCaptureOrientation → DeviceOrientation? - Заблокированная ориентация
  - isCaptureOrientationLocked → bool - Ориентация захвата заблокирована
  - recordingOrientation → DeviceOrientation? - Ориентация записи видео
  - previewPauseOrientation → DeviceOrientation? - Ориентация при паузе превью

- CameraPreview - Виджет превью камеры
  - CameraPreview(this.controller, {Widget? child}) - Создаёт виджет превью

- CameraImage - Изображение с камеры
  - width → int - Ширина
  - height → int - Высота
  - format → ImageFormat - Формат изображения
  - planes → List<Plane> - Цветовые плоскости
  - lensAperture → double? - Апертура (f-stop)
  - sensorExposureTime → int? - Время экспозиции (нс)
  - sensorSensitivity → double? - Чувствительность (ISO)

- Plane - Цветовая плоскость
  - bytes → Uint8List - Данные плоскости
  - bytesPerPixel → int? - Байтов на пиксель (Android)
  - bytesPerRow → int - Байтов на строку
  - width → int? - Ширина (iOS)
  - height → int? - Высота (iOS)

### Enums (из camera_platform_interface)
- ResolutionPreset: low, medium, high, veryHigh, ultraHigh, max - Предустановки разрешения
- FlashMode: off, auto, always, torch - Режимы вспышки
- FocusMode: auto, locked - Режимы фокуса
- ExposureMode: auto, locked - Режимы экспозиции
- ImageFormatGroup: unknown, jpeg, nv21, yuv420, bgra8888 - Форматы изображений
- CameraLensDirection: front, back, external - Направление камеры

## USAGE_PATTERNS

Паттерн: Инициализация камеры
```dart
final cameras = await availableCameras();
final controller = CameraController(cameras[0], ResolutionPreset.medium, enableAudio: true);
await controller.initialize();
```

Паттерн: Отображение превью
```dart
CameraPreview(controller)
```

Паттерн: Захват фото
```dart
final XFile image = await controller.takePicture();
```

Паттерн: Запись видео
```dart
await controller.startVideoRecording();
// ... запись ...
final XFile video = await controller.stopVideoRecording();
```

Паттерн: Пауза/возобновление превью
```dart
await controller.pausePreview();
await controller.resumePreview();
```

Паттерн: Управление зумом (жестами)
```dart
final minZoom = await controller.getMinZoomLevel();
final maxZoom = await controller.getMaxZoomLevel();
await controller.setZoomLevel(clampedZoom);
```

Паттерн: Вспышка
```dart
await controller.setFlashMode(FlashMode.auto);
```

Паттерн: Экспозиция
```dart
await controller.setExposureMode(ExposureMode.auto);
await controller.setExposurePoint(Offset(0.5, 0.5)); // центр
await controller.setExposureOffset(1.0);
```

Паттерн: Фокус
```dart
await controller.setFocusMode(FocusMode.auto);
await controller.setFocusPoint(Offset(0.5, 0.5)); // центр
```

Паттерн: Поток изображений (для ML/анализа)
```dart
await controller.startImageStream((CameraImage image) {
  // обработка кадров
});
await controller.stopImageStream();
```

Паттерн: Блокировка ориентации
```dart
await controller.lockCaptureOrientation(DeviceOrientation.portraitUp);
await controller.unlockCaptureOrientation();
```

Паттерн: Очистка ресурсов
```dart
await controller.dispose();
```

## DEPS
- camera_aurora: flutter
- camera_platform_interface: ^2.10.0
- flutter: sdk (>=3.27.0)
- sdk: ^3.6.0

## NOTES
- Платформа Aurora использует camera_aurora как реализацию
- prepareForVideoRecording() только для iOS, на остальных платформах no-op
- pauseVideoRecording/resumeVideoRecording: только iOS и Android SDK 24+
- startImageStream/stopImageStream: только если supportsImageStreaming() возвращает true
- setExposurePoint/setFocusPoint: координаты от 0.0 до 1.0 относительно preview
- setExposureOffset: значение в EV единицах, автоматически округляется до шага
- При записи видео нельзя одновременно использовать startImageStream (если не указан callback)
- Обязательно вызывать dispose() при уничтожении контроллера
- Пример с full функционалом: example/lib/main.dart
