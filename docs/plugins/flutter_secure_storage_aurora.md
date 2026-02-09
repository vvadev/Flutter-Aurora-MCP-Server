<description>
Aurora OS плагин для безопасного хранения данных с AES-шифрованием, реализует flutter_secure_storage API с поддержкой выбора каталога хранения.
</description>

# flutter_secure_storage_aurora

## TYPE
custom

## QUICK_START
```dart
FlutterSecureStorageAurora.setSecret('your-secret-key');
final storage = FlutterSecureStorage();
await storage.write(key: 'auth_token', value: 'token_value');
```

## API_SUMMARY
### FlutterSecureStorageAurora (статические методы)
- setSecret(String secret) → void
- setStorageDirectory(AuroraStorageDirectory directory) → void
- getCurrentStorageDirectory() → AuroraStorageDirectory

### FlutterSecureStorage (стандартный API)
- read(key: String, options: Map<String, String>) → Future<String?>
- write(key: String, value: String, options: Map<String, String>) → Future<void>
- delete(key: String, options: Map<String, String>) → Future<void>
- deleteAll(options: Map<String, String>) → Future<void>
- containsKey(key: String, options: Map<String, String>) → Future<bool>
- readAll(options: Map<String, String>) → Future<Map<String, String>>

### AuroraStorageDirectory (enum)
- cache - временные данные
- temporary - системные временные данные
- documents - документы пользователя
- support - постоянные данные приложения (по умолчанию)
- downloads - загрузки пользователя

## USAGE_PATTERNS
Паттерн: Инициализация
```dart
FlutterSecureStorageAurora.setSecret('secret-key-32-chars');
final storage = FlutterSecureStorage();
```
Результат: плагин готов к работе

Паттерн: Запись с выбором каталога
```dart
FlutterSecureStorageAurora.setStorageDirectory(AuroraStorageDirectory.documents);
await storage.write(key: 'token', value: 'value');
```
Результат: зашифрованные данные в documents/

Паттерн: Перегрузка каталога для операции
```dart
await storage.write(key: 'temp', value: 'value', options: {'auroraStorageDirectory': 'cache'});
```
Результат: данные в cache/ только для этой операции

Паттерн: Чтение всех данных
```dart
Map<String, String> all = await storage.readAll();
```
Результат: Map всех ключ-значений

## DEPS
flutter_secure_storage_platform_interface: ^1.0.1
crypto: ^3.0.3
encrypt: ^5.0.3
path: ^1.8.3
path_provider: (любая)

## NOTES
- setSecret() ОБЯЗАТЕЛЕН до использования (бросает NullSecretException)
- Данные хранятся в .flutter_secure_storage.json
- AES-шифрование с ключом/IV из sha256(secret)
- Версия 5.4.0 изменила default с cache на documents
- Работает на Aurora OS >= 5.0.0
- Нужно разрешение UserDirs в manifest
