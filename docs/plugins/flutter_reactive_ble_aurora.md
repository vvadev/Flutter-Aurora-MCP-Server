<description>
Реализация flutter_reactive_ble для Aurora OS для работы с BLE устройствами (поиск, подключение, чтение/запись характеристик, подписка на уведомления)
</description>

# flutter_reactive_ble_aurora

## TYPE
fork

## QUICK_START
```dart
final FlutterReactiveBle ble = FlutterReactiveBle();
await ble.initialize();
ble.statusStream.listen((status) {
  if (status == BleStatus.ready) {
    ble.scanForDevices(withServices: []).listen((device) {
      // Обработка найденного устройства
    });
  }
});
```

## API_SUMMARY
### Основные методы
- `initialize()` → Future<void> - Инициализация BLE адаптера
- `deinitialize()` → Future<void> - Очистка ресурсов
- `scanForDevices(withServices: List<Uuid>, scanMode: ScanMode, requireLocationServicesEnabled: bool)` → Stream<DiscoveredDevice> - Поиск BLE устройств
- `connectToDevice(id: String, servicesWithCharacteristicsToDiscover: Map<Uuid, List<Uuid>>?, connectionTimeout: Duration?)` → Stream<ConnectionStateUpdate> - Подключение к устройству
- `disconnectDevice(deviceId: String)` → Future<void> - Отключение от устройства

### Сервисы и характеристики
- `discoverServices(deviceId: String)` → Future<List<DiscoveredService>> - Обнаружение сервисов устройства
- `getDiscoverServices(deviceId: String)` → Future<List<DiscoveredService>> - Получение обнаруженных сервисов
- `discoverAllServices(deviceId: String)` → Future<void> - Обнаружение всех сервисов
- `getDiscoveredServices(deviceId: String)` → Future<List<Service>> - Получение списка сервисов
- `readCharacteristic(characteristic: CharacteristicInstance)` → Stream<void> - Чтение значения характеристики (результат в charValueUpdateStream)
- `readCharacteristic(qualifiedCharacteristic: QualifiedCharacteristic)` → Future<List<int>> - Синхронное чтение характеристики
- `writeCharacteristicWithResponse(characteristic: CharacteristicInstance, value: List<int>)` → Future<WriteCharacteristicInfo> - Запись с подтверждением
- `writeCharacteristicWithoutResponse(characteristic: CharacteristicInstance, value: List<int>)` → Future<WriteCharacteristicInfo> - Запись без подтверждения

### Уведомления
- `subscribeToNotifications(characteristic: CharacteristicInstance)` → Stream<void> - Подписка на уведомления характеристики
- `stopSubscribingToNotifications(characteristic: CharacteristicInstance)` → Future<void> - Отписка от уведомлений

### Прочее
- `readRssi(deviceId: String)` → Future<int> - Чтение уровня сигнала устройства
- `requestMtuSize(deviceId: String, mtu: int?)` → Future<int> - Запрос MTU размера
- `clearGattCache(deviceId: String)` → Future<Result<Unit, GenericFailure<ClearGattCacheError>?>> - Очистка кэша GATT (не реализовано)
- `requestConnectionPriority(deviceId: String, priority: ConnectionPriority)` → Future<ConnectionPriorityInfo> - Запрос приоритета подключения (не реализовано)

### Свойства (Streams)
- `statusStream` → Stream<BleStatus> - Статус BLE адаптера
- `scanStream` → Stream<ScanResult> - Результаты сканирования
- `connectionUpdateStream` → Stream<ConnectionStateUpdate> - Обновления состояния подключения
- `charValueUpdateStream` → Stream<CharacteristicValue> - Обновления значений характеристик

## USAGE_PATTERNS
### Инициализация и мониторинг статуса
```dart
final ble = FlutterReactiveBle();
ble.statusStream.listen((status) {
  // BleStatus.unknown, unsupported, poweredOff, ready
});
```

### Поиск устройств
```dart
ble.scanForDevices(withServices: []).listen((device) {
  // device.id, device.name, device.rssi, device.serviceUuids
});
```

### Подключение к устройству
```dart
ble.connectToDevice(id: deviceId, connectionTimeout: Duration(seconds: 5)).listen((update) {
  // update.connectionState: connecting, connected, disconnecting, disconnected
  // update.failure: null или GenericFailure
});
```

### Работа с характеристиками
```dart
// Чтение
ble.charValueUpdateStream.listen((value) {
  // value.result.success или value.result.failure
});
ble.readCharacteristic(characteristic);

// Запись с подтверждением
ble.writeCharacteristicWithResponse(characteristic, [0x01, 0x02]);

// Подписка на уведомления
ble.subscribeToNotifications(characteristic);
// Значения приходят в charValueUpdateStream
```

### Обнаружение сервисов
```dart
final services = await ble.discoverServices(deviceId);
// services: List<DiscoveredService>
// service.serviceId, service.characteristics
```

## DEPS
- `flutter_reactive_ble: ^5.3.1` - Оригинальный пакет с интерфейсом API
- `bluez: 0.8.2` - Обёртка для BlueZ D-Bus API (Linux/Aurora OS)
- `reactive_ble_platform_interface: ^5.3.1` - Платформенный интерфейс

## NOTES
- Это форк плагина для работы с BLE на Aurora OS (основан на Linux/BlueZ)
- Полный API доступен по ссылке: https://github.com/PhilipsHue/flutter_reactive_ble
- Совместимость: Flutter 3.32.7+, Aurora OS 5.0.0+
- Требует разрешение Bluetooth в манифесте Aurora OS
- Методы `clearGattCache` и `requestConnectionPriority` не реализованы (зависят от Android API)
- При сканировании устройства без RSSI (0) игнорируются
- После обнаружения сервисов выполняется задержка 1 секунда для стабилизации
- MTU размер возвращается как charMtu - 3 (BlueZ включает 3 байта заголовка GATT)
