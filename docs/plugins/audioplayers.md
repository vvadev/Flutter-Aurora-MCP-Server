<description>
Flutter плагин для одновременного воспроизведения нескольких аудио файлов с кастомной реализацией для Aurora OS
</description>

# audioplayers

## TYPE
fork

## QUICK_START
```dart
import 'package:audioplayers/audioplayers.dart';

final player = AudioPlayer();
await player.play(UrlSource('https://example.com/audio.wav'));
```

## API_SUMMARY
- AudioPlayer({String? playerId}) → Создает новый плеер с уникальным ID
- play(Source source, {double? volume, double? balance, AudioContext? ctx, Duration? position, PlayerMode? mode}) → Future<void>
- pause() → Future<void>
- resume() → Future<void>
- stop() → Future<void>
- release() → Future<void>
- seek(Duration position) → Future<void>
- setVolume(double volume) → Future<void> (0-1)
- setBalance(double balance) → Future<void> (-1 левый канал, 1 правый канал)
- setPlaybackRate(double playbackRate) → Future<void>
- setSource(Source source) → Future<void>
- setSourceUrl(String url, {String? mimeType}) → Future<void>
- setSourceDeviceFile(String path, {String? mimeType}) → Future<void>
- setSourceAsset(String path, {String? mimeType}) → Future<void>
- setSourceBytes(Uint8List bytes, {String? mimeType}) → Future<void>
- getDuration() → Future<Duration?>
- getCurrentPosition() → Future<Duration?>
- dispose() → Future<void>

- UrlSource(url, {mimeType}) → Источник из удаленного URL
- AssetSource(path, {mimeType}) → Источник из ассетов
- DeviceFileSource(path, {mimeType}) → Источник из локального файла устройства
- BytesSource(bytes, {mimeType}) → Источник из массива байт

- AudioPool.create({Source source, int maxPlayers, int minPlayers}) → Future<AudioPool>
- AudioCache.instance → Глобальный экземпляр кеша
- AudioCache.load(String fileName) → Future<Uri>
- AudioCache.clear(String fileName) → Future<void>
- AudioCache.clearAll() → Future<void>

## USAGE_PATTERNS
Паттерн: Воспроизведение URL
```dart
final player = AudioPlayer();
await player.play(UrlSource('https://example.com/audio.mp3'));
```
Результат: Загружает и воспроизводит аудио с указанного URL

Паттерн: Воспроизведение ассета
```dart
final player = AudioPlayer();
await player.play(AssetSource('sounds/music.mp3'));
```
Результат: Воспроизводит аудио из папки assets приложения

Паттерн: Управление громкостью и балансом
```dart
await player.setVolume(0.7); // 70% громкости
await player.setBalance(-0.5); // Сдвиг влево
```
Результат: Настраивает громкость (0-1) и стереобаланс (-1 до 1)

Паттерн: Прослушивание событий
```dart
player.onPlayerComplete.listen((_) => print('Завершено'));
player.onPositionChanged.listen((pos) => print(pos));
player.onDurationChanged.listen((dur) => print(dur));
```
Результат: Отслеживает завершение, текущую позицию и длительность

Паттерн: Перемотка
```dart
await player.seek(Duration(seconds: 30));
```
Результат: Перематывает на указанную позицию

Паттерн: Остановка с освобождением ресурсов
```dart
await player.release();
```
Результат: Останавливает и освобождает ресурсы плагина

Паттерн: AudioPool для быстрых звуков
```dart
final pool = await AudioPool.create(source: AssetSource('click.wav'), maxPlayers: 5);
final stop = await pool.start(volume: 1.0);
// позже: await stop();
```
Результат: Создает пул из 5 плееров для быстрого воспроизведения клика

## DEPS
audioplayers: ^6.5.0
audioplayers_aurora: ^1.1.0 (Aurora реализация через GStreamer-1.0)
audioplayers_platform_interface: ^7.1.1
file: ^6.1.0
flutter: ^3.27.0
http: ^0.13.1
path_provider: flutter
synchronized: ^3.0.0
uuid: ^3.0.7

## NOTES
- Это форк pub.dev/packages/audioplayers с кастомной реализацией для Aurora OS
- Aurora реализация использует GStreamer-1.0 без QT зависимостей
- Позволяет создавать несколько AudioPlayer для одновременного воспроизведения
- Поддерживает URL, Assets, Device Files и Bytes как источники
- Timeout по умолчанию: подготовка 30с, перемотка 30с
- iOS/macOS ограничивают playbackRate между 0.5 и 2x
- Android SDK 23+ требуется для playbackRate
- ReleaseMode.loop отправляет события в onPlayerComplete
- При завершении воспроизведения позиция сбрасывается, resume начнет сначала
- dispose() обязательно вызывать при завершении использования плеера
