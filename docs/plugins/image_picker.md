<description>
Выбор изображений и видео из галереи и камеры на Aurora OS
</description>

# IMAGE_PICKER

## TYPE
fork

## QUICK_START
```dart
import 'package:image_picker/image_picker.dart';
import 'package:image_picker_aurora/image_picker_aurora.dart';

// Для камеры
final navigatorKey = GlobalKey<NavigatorState>();
setUpDefaultAuroraCameraDelegate(navigatorKey);

// Использование
final ImagePicker picker = ImagePicker();
final XFile? image = await picker.pickImage(source: ImageSource.gallery);
```

## API_SUMMARY
- pickImage({source, maxWidth, maxHeight, imageQuality, preferredCameraDevice}) → Future<XFile?>
- pickMultiImage({maxWidth, maxHeight, imageQuality, limit}) → Future<List<XFile>>
- pickVideo({source, preferredCameraDevice, maxDuration}) → Future<XFile?>
- pickMedia({maxWidth, maxHeight, imageQuality}) → Future<XFile?>
- pickMultipleMedia({maxWidth, maxHeight, imageQuality, limit}) → Future<List<XFile>>
- supportsImageSource(ImageSource) → bool

### ImageSource enum
- gallery, camera

### CameraDevice enum
- rear, front

## USAGE_PATTERNS

**Выбор изображения из галереи:**
```dart
final picker = ImagePicker();
final XFile? image = await picker.pickImage(source: ImageSource.gallery);
```
Результат: выбранное изображение или null

**Выбор нескольких изображений:**
```dart
final List<XFile> images = await picker.pickMultiImage();
```
Результат: список изображений

**Съёмка фото с камеры:**
```dart
final navigatorKey = GlobalKey<NavigatorState>();
setUpDefaultAuroraCameraDelegate(navigatorKey);

MaterialApp(navigatorKey: navigatorKey, ...)

final XFile? image = await picker.pickImage(source: ImageSource.camera);
```
Результат: фото или ошибка

**Выбор видео:**
```dart
final XFile? video = await picker.pickVideo(source: ImageSource.gallery);
```
Результат: видео или null

**Выбор медиа (фото или видео):**
```dart
final XFile? media = await picker.pickMedia();
```
Результат: один файл (фото или видео) или null

## DEPS
- image_picker: ^1.1.0
- image_picker_aurora: SDK flutter
- file_selector: SDK flutter
- camera: SDK flutter
- path_provider: SDK flutter

## NOTES
**Поддержка на Aurora:**
- pickImage (gallery) - поддерживается
- pickMultiImage - поддерживается
- pickVideo (gallery) - поддерживается
- pickMedia/pickMultipleMedia - поддерживается
- pickImage/pickVideo (camera) - ТРЕБУЕТ настройки cameraDelegate

**Ограничения:**
- ImageSource.camera не работает без setUpDefaultAuroraCameraDelegate()
- Камера использует camera_aurora, который не поддерживает запись видео
- maxWidth, maxHeight, imageQuality, limit игнорируются на Aurora
- preferredCameraDevice, maxDuration игнорируются
- Требуется OS Aurora 5+
