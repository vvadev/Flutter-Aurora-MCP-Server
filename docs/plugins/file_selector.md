<description>
Выбор файлов и папок на Aurora OS с помощью нативного файлового диалога
</description>

# FILE_SELECTOR

## TYPE
fork

## QUICK_START
```dart
import 'package:file_selector/file_selector.dart';

const XTypeGroup typeGroup = XTypeGroup(extensions: ['jpg', 'png']);
final XFile? file = await openFile(acceptedTypeGroups: [typeGroup]);
```

## API_SUMMARY
- openFile({acceptedTypeGroups, initialDirectory, confirmButtonText}) → Future<XFile?>
- openFiles({acceptedTypeGroups, initialDirectory, confirmButtonText}) → Future<List<XFile>>
- getDirectoryPath({initialDirectory, confirmButtonText}) → Future<String?>
- getDirectoryPaths({initialDirectory, confirmButtonText}) → Future<List<String>>
- getSaveLocation({acceptedTypeGroups, initialDirectory, suggestedName, confirmButtonText}) → Future<FileSaveLocation?>

## USAGE_PATTERNS

**Выбор одного файла:**
```dart
final XFile? file = await openFile();
```
Результат: выбранный файл или null

**Фильтрация по типу:**
```dart
final group = XTypeGroup(mimeTypes: ['image/*']);
final XFile? file = await openFile(acceptedTypeGroups: [group]);
```
Результат: только изображения или null

**Выбор нескольких файлов:**
```dart
final List<XFile> files = await openFiles();
```
Результат: список файлов или пустой список

**Выбор папки:**
```dart
final String? path = await getDirectoryPath();
```
Результат: путь к папке или null

**Выбор папки для сохранения:**
```dart
final location = await getSaveLocation(suggestedName: 'file.txt');
```
Результат: FileSaveLocation или null

## DEPS
- file_selector: ^1.0.3
- file_selector_aurora: SDK flutter

## NOTES
**Поддержка на Aurora:**
- openFile/openFiles - поддерживается
- getDirectoryPath/getDirectoryPaths - поддерживается
- getSaveLocation - поддерживается (выбирает папку, не файл)

**Ограничения:**
- initialDirectory работает только для папок
- confirmButtonText игнорируется
- getSaveLocation возвращает путь к папке, нужно добавлять имя файла вручную
- Требуется OS Aurora 5+
