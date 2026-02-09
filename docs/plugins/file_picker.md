<description>
Aurora OS реализация FilePicker для выбора файлов и папок с фильтрацией по типам и расширениям
</description>

# FILE_PICKER

## TYPE
custom

## QUICK_START
```dart
import 'package:file_picker/file_picker.dart';

FilePickerResult? result = await FilePicker.platform.pickFiles();
if (result != null) {
  File file = File(result.files.single.path!);
}
```

## API_SUMMARY

### FilePicker.platform
- pickFiles({type, allowMultiple, allowedExtensions, withData, withReadStream, initialDirectory, dialogTitle}) → Future<FilePickerResult?>
- getDirectoryPath({initialDirectory, dialogTitle, lockParentWindow}) → Future<String?>
- saveFile({fileName, bytes, type, allowedExtensions, initialDirectory, dialogTitle, lockParentWindow}) → Future<String?>
- clearTemporaryFiles() → Future<bool?>
- pickFileAndDirectoryPaths({type, allowedExtensions, initialDirectory}) → Future<List<String>?> [НЕ РАБОТАЕТ НА AURORA]

### FilePickerResult
- files: List<PlatformFile> - список выбранных файлов
- paths: List<String?> - абсолютные пути файлов
- names: List<String?> - имена файлов с расширениями
- xFiles: List<XFile> - файлы как XFile объекты
- isSinglePick: bool - если выбран один файл
- count: int - количество файлов

### PlatformFile
- path: String? - абсолютный путь к файлу
- name: String - имя файла с расширением
- size: int - размер в байтах
- bytes: Uint8List? - байты файла
- readStream: Stream<List<int>>? - поток чтения
- extension: String? - расширение файла
- xFile: XFile - файл как XFile объект

### FileType enum
- any, media, image, video, audio, custom

### FilePickerStatus enum
- picking, done

## USAGE_PATTERNS

**Одиночный файл:**
```dart
FilePickerResult? result = await FilePicker.platform.pickFiles();
```
Результат: FilePickerResult с одним файлом или null

**Несколько файлов:**
```dart
FilePickerResult? result = await FilePicker.platform.pickFiles(allowMultiple: true);
```
Результат: FilePickerResult с множеством файлов или null

**Фильтр по типу:**
```dart
FilePickerResult? result = await FilePicker.platform.pickFiles(
  type: FileType.image,
  allowMultiple: true,
);
```
Результат: только изображения или null

**Кастомные расширения:**
```dart
FilePickerResult? result = await FilePicker.platform.pickFiles(
  type: FileType.custom,
  allowedExtensions: ['jpg', 'pdf', 'doc'],
);
```
Результат: файлы с указанными расширениями или null

**Выбор папки:**
```dart
String? path = await FilePicker.platform.getDirectoryPath();
```
Результат: путь к папке или null

**Сохранение файла:**
```dart
String? path = await FilePicker.platform.saveFile(
  fileName: 'output.pdf',
  bytes: myFileBytes,
);
```
Результат: путь к сохранённому файлу или null

**Чтение байтов файла:**
```dart
FilePickerResult? result = await FilePicker.platform.pickFiles(withData: true);
Uint8List? bytes = result?.files.single.bytes;
```
Результат: байты выбранного файла

## DEPS
- flutter: ^3.22.0
- plugin_platform_interface: ^2.1.8
- path: ^1.9.1
- file_selector: flutter SDK

## NOTES
**Поддержка на Aurora:**
- pickFiles() - поддерживается (один/много файлов, фильтры)
- getDirectoryPath() - поддерживается
- saveFile() - поддерживается (требует bytes и fileName)
- pickFileAndDirectoryPaths() - НЕ поддерживается
- clearTemporaryFiles() - НЕ поддерживается

**Ограничения:**
- lockParentWindow игнорируется (только Windows)
- dialogTitle игнорируется (только Windows)
- onFileLoading не работает на Aurora
- initialDirectory работает только для выбора папки
- saveFile() требует указать bytes и fileName, выберет папку для сохранения
