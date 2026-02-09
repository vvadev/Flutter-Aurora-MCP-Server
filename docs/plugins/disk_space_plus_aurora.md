<description>
Плагин disk_space_plus_aurora предоставляет информацию о дисковом пространстве устройства на Aurora OS. Форк оригинального плагина disk_space_plus, адаптированный для Aurora OS.
</description>

# disk_space_plus_aurora

## TYPE
fork

## QUICK_START
```dart
final plugin = DiskSpacePlus();
final freeSpace = await plugin.getFreeDiskSpace;
final totalSpace = await plugin.getTotalDiskSpace;
final pathSpace = await plugin.getFreeDiskSpaceForPath('/path/to/dir');
```

## API_SUMMARY
- getFreeDiskSpace() → double? - свободное место на диске в MB
- getTotalDiskSpace() → double? - общий объем диска в MB
- getFreeDiskSpaceForPath(path: String) → double? - свободное место по пути в MB
- getPlatformVersion() → String? - версия платформы ("Aurora OS")

## USAGE_PATTERNS
```dart
final plugin = DiskSpacePlus();
final freeMB = await plugin.getFreeDiskSpace; // → 1024.5
final totalMB = await plugin.getTotalDiskSpace; // → 51200.0
final dirFreeMB = await plugin.getFreeDiskSpaceForPath('/home/user'); // → 2048.0
```

## DEPS
disk_space_plus: ^0.2.6

## NOTES
Платформа: Aurora OS 5.0.0+, Flutter 3.32.7+. Все значения возвращаются в мегабайтах (MB). Оригинальный плагин: https://pub.dev/packages/disk_space_plus
