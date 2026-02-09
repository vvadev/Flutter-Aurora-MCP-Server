<description>
Получение путей к системным директориям приложения на Aurora OS
</description>

# PATH_PROVIDER

## TYPE
fork

## QUICK_START
```dart
import 'package:path_provider/path_provider.dart';

final Directory tempDir = await getTemporaryDirectory();
final Directory appDocs = await getApplicationDocumentsDirectory();
final Directory? downloads = await getDownloadsDirectory();
```

## API_SUMMARY
- getTemporaryDirectory() → Future<Directory>
- getApplicationSupportDirectory() → Future<Directory>
- getLibraryDirectory() → Future<Directory>
- getApplicationDocumentsDirectory() → Future<Directory>
- getApplicationCacheDirectory() → Future<Directory>
- getExternalStorageDirectory() → Future<Directory?> [НЕ ПОДДЕРЖИВАЕТСЯ]
- getExternalCacheDirectories() → Future<List<Directory>?> [НЕ ПОДДЕРЖИВАЕТСЯ]
- getExternalStorageDirectories({type}) → Future<List<Directory>?>
- getDownloadsDirectory() → Future<Directory?>

### StorageDirectory enum
- pictures, music, movies

## USAGE_PATTERNS

**Временная директория:**
```dart
final Directory temp = await getTemporaryDirectory();
```
Результат: директория кэша приложения

**Документы приложения:**
```dart
final Directory docs = await getApplicationDocumentsDirectory();
```
Результат: директория для документов пользователя

**Директория для скачанных файлов:**
```dart
final Directory? downloads = await getDownloadsDirectory();
```
Результат: директория Downloads или null

**Папки медиа (картинки/музыка/видео):**
```dart
final List<Directory>? pictures = await getExternalStorageDirectories(type: StorageDirectory.pictures);
```
Результат: путь к папке Pictures, Music или Movies

## DEPS
- path_provider: ^2.1.5
- path_provider_aurora: SDK flutter

## NOTES
**Поддержка на Aurora:**
- getTemporaryDirectory - поддерживается (возвращает кэш)
- getApplicationSupportDirectory - поддерживается
- getLibraryDirectory - поддерживается
- getApplicationDocumentsDirectory - поддерживается
- getApplicationCacheDirectory - поддерживается
- getExternalStorageDirectories - поддерживается (только pictures/music/movies)
- getDownloadsDirectory - поддерживается

**НЕ ПОДДЕРЖИВАЕТСЯ:**
- getExternalStorageDirectory - нет (концепция External Storage отсутствует в Aurora)
- getExternalCacheDirectories - нет

**Ограничения:**
- StorageDirectory.pictures/music/movies - единственные поддерживаемые типы
- Другие StorageDirectory вызовут UnimplementedError
- Требуется OS Aurora 5+ и права UserDirs
