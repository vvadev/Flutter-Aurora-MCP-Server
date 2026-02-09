<description>
Инструкция по портированию Flutter приложений на платформу Aurora OS с шагами настройки, изменениями в pubspec и совместимостью плагинов
</description>

# Flutter Aurora Porting

## TYPE
custom

## QUICK_START
```bash
flutter create . --platform=aurora
# В pubspec.yaml: organization: com.example.yourappname
flutter build aurora
```

## API_SUMMARY
- flutter create . --platform=aurora → добавляет поддержку платформы Aurora
- flutter-aurora config --aurora-psdk-dir <path> → настраивает путь к PSDK
- flutter-aurora doctor → проверяет установку Aurora SDK
- aurora-cli sdk install → устанавливает Aurora SDK
- aurora-cli psdk install → устанавливает Platform SDK
- aurora-cli flutter install → устанавливает Flutter SDK для Aurora

## USAGE_PATTERNS
Паттерн: Изменение источника плагина на sdk: flutter
```yaml
dependencies:
  shared_preferences:
    sdk: flutter
```

Паттерн: Добавление организации в pubspec.yaml
```yaml
organization: com.example.yourappname
```

Паттерн: Исправление имени пакета (нижний регистр)
```yaml
name: gametwozero  # вместо GameTwoZero
```

## DEPS
Плагины с исходником sdk: flutter:
- audioplayers
- camera
- file_selector
- image_picker
- path_provider
- shared_preferences
- url_launcher
- video_player
- webview
- workmanager

## NOTES
1. После создания платформы удалить дубликаты:
   - aurora/rpm/com.example.*.*.spec
   - aurora/desktop/com.example.*.*.desktop
