<description>
Воспроизведение видео в Flutter приложениях на Aurora OS
</description>

# VIDEO_PLAYER

## TYPE
fork

## QUICK_START
```dart
import 'package:video_player/video_player.dart';

final controller = VideoPlayerController.networkUrl(
  Uri.parse('https://example.com/video.mp4'),
);
await controller.initialize();

VideoPlayer(controller: controller);
```

## API_SUMMARY
- VideoPlayerController.asset(String dataSource, {package, closedCaptionFile, videoPlayerOptions, viewType})
- VideoPlayerController.networkUrl(Uri url, {formatHint, closedCaptionFile, videoPlayerOptions, httpHeaders, viewType})
- VideoPlayerController.file(File file, {closedCaptionFile, videoPlayerOptions, httpHeaders, viewType})
- VideoPlayerController.contentUri(Uri contentUri, {closedCaptionFile, videoPlayerOptions, viewType}) [Только Android]
- initialize() → Future<void>
- play() → Future<void>
- pause() → Future<void>
- seekTo(Duration position) → Future<void>
- setLooping(bool looping) → Future<void>
- setVolume(double volume) → Future<void>
- setPlaybackSpeed(double speed) → Future<void>
- position → Future<Duration?>
- dispose() → Future<void>

### VideoPlayerValue
- duration: Duration - общая длительность видео
- position: Duration - текущая позиция воспроизведения
- isPlaying: bool - проигрывается ли видео
- isLooping: bool - зациклено ли воспроизведение
- volume: double - громкость (0.0-1.0)
- playbackSpeed: double - скорость воспроизведения
- size: Size - размер видео
- isInitialized: bool - инициализирован ли плеер
- buffered: List<DurationRange> - буферизированные диапазоны
- caption: Caption - текущая субтитра

### VideoViewType enum
- textureView, platformSurfaceView

## USAGE_PATTERNS

**Загрузка из сети:**
```dart
final controller = VideoPlayerController.networkUrl(
  Uri.parse('https://example.com/video.mp4'),
);
await controller.initialize();
controller.play();
```
Результат: видео воспроизводится

**Загрузка из asset:**
```dart
final controller = VideoPlayerController.asset('assets/video.mp4');
await controller.initialize();
```
Результат: видео загружено из assets

**Управление воспроизведением:**
```dart
controller.play();     // воспроизвести
controller.pause();    // пауза
controller.seekTo(Duration(seconds: 30));  // перемотка
controller.setVolume(0.5);  // громкость 50%
controller.setLooping(true);  // зациклить
```

**Отображение видео:**
```dart
VideoPlayerWidget(controller: controller);
```

**Отображение прогресса:**
```dart
VideoProgressIndicator(controller: controller, allowScrubbing: true);
```

**Субтитры:**
```dart
Stack(children: [
  VideoPlayer(controller),
  ClosedCaption(text: controller.value.caption.text),
])
```

## DEPS
- video_player: ^2.10.0
- video_player_aurora: SDK flutter
- video_player_platform_interface: ^6.4.0
- flmultimedia: SDK flutter

## NOTES
**Поддержка на Aurora:**
- Видео из сети - поддерживается
- Видео из файлов - поддерживается
- Видео из assets - поддерживается
- Управление воспроизведением - поддерживается
- Субтитры (SRT/VTT) - поддерживаются

**Ограничения:**
- ContentUri НЕ поддерживается (только Android)
- Видео кодеки ограничены поддерживаемыми GStreamer
- PlaybackSpeed может не поддерживаться на всех скоростях
- RotationCorrection может не работать корректно

**Требования:**
- SDK: >=3.6.0
- Flutter: >=3.27.0
- Использует GStreamer-1.0 без зависимостей от QT
