<description>
Aurora реализация плагина для сохранения изображений и видео в галерею устройства из Flutter приложений
</description>

# image_gallery_saver_plus_aurora

## TYPE
fork

## QUICK_START
```dart
await ImageGallerySaverPlus.saveImage(byteData.buffer.asUint8List());
await ImageGallerySaverPlus.saveFile(filePath);
```

## API_SUMMARY
- saveImage(imageBytes: Uint8List, quality: int?, name: String?, isReturnImagePathOfIOS: bool?) → Map<String, dynamic> — сохраняет изображение из байтов в галерею
- saveFile(file: String, isReturnPathOfIOS: bool?) → Map<String, dynamic> — сохраняет файл (GIF/видео) по пути в галерею

## USAGE_PATTERNS
Сохранение локального изображения (виджета):
```dart
RenderRepaintBoundary boundary = _globalKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
ui.Image image = await boundary.toImage();
ByteData? byteData = await (image.toByteData(format: ui.ImageByteFormat.png));
await ImageGallerySaverPlus.saveImage(byteData.buffer.asUint8List(), isReturnImagePathOfIOS: true);
```

Сохранение изображения из сети:
```dart
var response = await Dio().get(url, options: Options(responseType: ResponseType.bytes));
await ImageGallerySaverPlus.saveImage(Uint8List.fromList(response.data), quality: 60, name: "hello");
```

Сохранение файла (GIF/видео) из сети:
```dart
var appDocDir = await getTemporaryDirectory();
String savePath = "${appDocDir.path}/temp.mp4";
await Dio().download(url, savePath);
await ImageGallerySaverPlus.saveFile(savePath, isReturnPathOfIOS: true);
```

Результат: Map<String, dynamic> с ключами `isSuccess` (bool), `errorMessage` (String), `filePath` (String)

## DEPS
image_gallery_saver_plus: ^4.0.0

## NOTES
Платформа: Aurora OS 5.0.0+
Разрешения: UserDirs
Канал метода: image_gallery_saver_plus
Полный API: см. pub.dev/packages/image_gallery_saver_plus
