<description>
Плагин обрезки изображений для Aurora OS с интерактивным UI и настройками интерфейса
</description>

# image_cropper_aurora

## TYPE
custom

## QUICK_START
```dart
CroppedFile? result = await ImageCropper().cropImage(
    sourcePath: filePath,
    uiSettings: [AuroraUiSettings(context: context)],
);
```

## API_SUMMARY
**ImageCropperAurora extends ImageCropperPlatform**
- cropImage(sourcePath: String, maxWidth: int?, maxHeight: int?, aspectRatio: CropAspectRatio?, compressFormat: ImageCompressFormat, compressQuality: int, uiSettings: List<PlatformUiSettings>?) → Future<CroppedFile?>
- recoverImage() → Future<CroppedFile?>

**AuroraUiSettings extends PlatformUiSettings**
- AuroraUiSettings(context: BuildContext, gridColor: Color, gridInnerColor: Color, gridCornerColor: Color, paddingSize: double, touchSize: double, gridCornerSize: double, showCorners: bool, gridThinWidth: double, gridThickWidth: double, scrimColor: Color, alwaysShowThirdLines: bool, hasLeftRotation: bool, hasRightRotation: bool, cropButtonText: Text, minimumImageSize: double, dialogWidthScale: double, dialogHeightScale: double, rotateRightIcon: Icon, rotateLeftIcon: Icon, cropButtonStyle: ButtonStyle?, rotateLeftButtonStyle: ButtonStyle?, rotateRightButtonStyle: ButtonStyle?, loadingPlaceholder: Widget, dialogBackgroundColor: Color, showSourceImagePath: bool, sourceImagePathTextStyle: TextStyle)

## USAGE_PATTERNS
Паттерн: Базовое обрезание изображения
```dart
CroppedFile? cropped = await ImageCropper().cropImage(
    sourcePath: imagePath,
    uiSettings: [AuroraUiSettings(context: context)],
);
```
Результат: CroppedFile с обрезанным изображением в ~/Pictures/ImageCropper-yyyy-MM-dd-HH-mm-ss.jpg

Паттерн: Обрезание с ограничением размера и аспектом
```dart
CroppedFile? cropped = await ImageCropper().cropImage(
    sourcePath: imagePath,
    maxWidth: 800,
    maxHeight: 800,
    aspectRatio: CropAspectRatio(ratioX: 1, ratioY: 1),
    uiSettings: [AuroraUiSettings(context: context)],
);
```
Результат: CroppedFile с изображением, обрезанным до квадратного формата и максимальным размером 800x800

Паттерн: Кастомизация UI
```dart
CroppedFile? cropped = await ImageCropper().cropImage(
    sourcePath: imagePath,
    uiSettings: [
        AuroraUiSettings(
            context: context,
            hasRightRotation: true,
            hasLeftRotation: true,
            gridColor: Colors.black,
            scrimColor: Colors.black,
            dialogWidthScale: 0.8,
            dialogHeightScale: 0.6,
        ),
    ],
);
```
Результат: CroppedFile с диалогом обрезки с кнопками вращения и кастомными цветами

Паттерн: Изменение формата и качества сжатия
```dart
CroppedFile? cropped = await ImageCropper().cropImage(
    sourcePath: imagePath,
    compressFormat: ImageCompressFormat.png,
    compressQuality: 95,
    uiSettings: [AuroraUiSettings(context: context)],
);
```
Результат: CroppedFile в формате PNG с качеством 95%

Паттерн: Восстановление оригинального изображения
```dart
CroppedFile? original = await ImageCropper().recoverImage();
```
Результат: CroppedFile с оригинальным изображением, если cropImage был вызван ранее

## DEPS
- flutter: ^3.32.7
- crop_image: ^1.0.16
- image_cropper_platform_interface: ^7.1.0
- aurora_libspdlog: git (https://developer.auroraos.ru/git/flutter/flutter-community-plugins/aurora_libspdlog)

## NOTES
- **Требуется**: BuildContext для AuroraUiSettings
- **Сохранение**: Результат сохраняется в ~/Pictures/ImageCropper-YYYY-MM-DD-HH-mm-ss.{jpg|png}
- **Платформа**: Aurora OS 5.1.3+
- **Ограничение**: Визуальный интерфейс позволяет выбрать область больше maxWidth/maxHeight; после обрезки по координатам изображение масштабируется относительно центра
- **ОБЯЗАТЕЛЬНО**: AuroraUiSettings должен быть в списке uiSettings, иначе бросается ArgumentError
- **Rotation**: Поддерживаются углы 90° и 270°
- **Permissions**: Требуется UserDirs в pubspec.yaml
- **main.cpp**: Требуется aurora::EnableQtCompatibility() для Qt поддержки
