<description>
Flutter плагин для навигации и управления файловой системой на Aurora OS, Android и Linux. Виджет с контроллером для отображения файлов/папок, сортировки и навигации.
</description>

# file_manager

## TYPE
custom

## QUICK_START
```dart
final FileManagerController controller = FileManagerController();
FileManager(
  controller: controller,
  builder: (context, snapshot) { /* ListView с файлами */ }
)
```

## API_SUMMARY

### FileManager Widget
- FileManager(controller, builder, {emptyFolder, loadingScreen, errorBuilder, hideHiddenEntity})
- isFile(FileSystemEntity) → bool
- isDirectory(FileSystemEntity) → bool
- basename(FileSystemEntity, {showFileExtension}) → String
- formatBytes(int bytes, [int precision]) → String
- createFolder(String currentPath, String name)
- getFileExtension(FileSystemEntity) → String
- getStorageList() → Future<List<Directory>>
- requestFilesAccessPermission()

### FileManagerController
- openDirectory(FileSystemEntity)
- goToParentDirectory()
- isRootDirectory() → Future<bool>
- sortBy(SortBy)
- getCurrentPath → String
- getCurrentDirectory → Directory
- setCurrentPath → set
- titleNotifier → ValueNotifier<String>
- getPathNotifier → ValueNotifier<String>
- getSortedByNotifier → ValueNotifier<SortBy>
- getSortedBy → SortBy
- dispose()

### ControlBackButton Widget
- ControlBackButton(child, controller)

### SortBy Enum
- name, date, type, size

## USAGE_PATTERNS

**Инициализация и отображение файлов**
```dart
final controller = FileManagerController();
FileManager(controller: controller, builder: (context, files) {
  return ListView.builder(
    itemCount: files.length,
    itemBuilder: (context, i) {
      final file = files[i];
      return ListTile(
        title: Text(FileManager.basename(file)),
        leading: Icon(FileManager.isDirectory(file) ? Icons.folder : Icons.file),
        onTap: () => FileManager.isDirectory(file) ? controller.openDirectory(file) : null
      );
    });
});
```

**Навигация**
```dart
controller.openDirectory(entity);
controller.goToParentDirectory();
controller.isRootDirectory(); // true/false
```

**Сортировка**
```dart
controller.sortBy(SortBy.name);
controller.sortBy(SortBy.date);
controller.sortBy(SortBy.type);
controller.sortBy(SortBy.size);
```

**Создание папки**
```dart
await FileManager.createFolder(controller.getCurrentPath, "NewFolder");
```

**Получение списка хранилищ**
```dart
final storages = await FileManager.getStorageList();
controller.openDirectory(storages.first);
```

**Показ заголовка папки**
```dart
ValueListenableBuilder<String>(
  valueListenable: controller.titleNotifier,
  builder: (context, title, _) => Text(title)
)
```

**Обработка кнопки назад**
```dart
ControlBackButton(
  controller: controller,
  child: Scaffold(body: FileManager(...))
)
```

## DEPS
- flutter: sdk
- path_provider: sdk
- Flutter SDK: ^3.32.7
- Dart SDK: ^3.8.1

## NOTES
- **Платформы**: Aurora OS (5.0.0+), Android, Linux
- **Разрешения**: Aurora OS требует UserDirs, Android - requestFilesAccessPermission()
- **Скрытые файлы**: По умолчанию hideHiddenEntity=true скрывает файлы/папки начинающиеся с "."
- **Сортировка**: Папки всегда отображаются первыми, затем файлы
- **Статические методы**: форматирование байт, получение расширения, создание папок, проверка типа
- **Утилита ControlBackButton**: Перехватывает кнопку назад для возврата в родительскую папку вместо закрытия
