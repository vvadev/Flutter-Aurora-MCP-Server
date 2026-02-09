<description>
Flutter плагин для работы с последовательными портами (UART/RS232) через обёртку libserialport. Позволяет находить, открывать, читать и писать данные на последовательные порты на Aurora, Linux, macOS, Windows, Android.
</description>

# flutter_libserialport

## TYPE
fork

## QUICK_START
```dart
import 'package:flutter_libserialport/flutter_libserialport.dart';
var ports = SerialPort.availablePorts;
```

## API_SUMMARY
**См. полный API**: pub.dev/packages/libserialport

Основные классы и методы:
- SerialPort.availablePorts → List<String> - список доступных портов
- SerialPort(address: String) → SerialPort - создание экземпляра порта
- port.openReadWrite() → bool - открытие порта для чтения/записи
- port.close() → void - закрытие порта
- port.isOpen → bool - статус открытости порта
- port.description → String? - описание порта
- port.transport → SerialPortTransport - тип транспорта (USB, Bluetooth, Native)
- port.vendorId → int? - USB Vendor ID
- port.productId → int? - USB Product ID
- port.manufacturer → String? - производитель
- port.productName → String? - название продукта
- port.serialNumber → String? - серийный номер
- port.busNumber → int? - USB номер шины
- port.deviceNumber → int? - USB номер устройства
- SerialPortReader(port: SerialPort) → SerialPortReader - создание ридера для потокового чтения
- reader.stream → Stream<Uint8List> - поток данных из порта
- SerialPort.lastError → String - последнее сообщение об ошибке

## USAGE_PATTERNS

**Поиск портов:**
```dart
final ports = SerialPort.availablePorts;
```

**Открытие и чтение:**
```dart
final port = SerialPort(address);
port.openReadWrite();
final reader = SerialPortReader(port);
reader.stream.map(String.fromCharCodes).listen((data) => print(data));
```

**Закрытие порта:**
```dart
port.close();
port.dispose();
```

**Получение информации о порте:**
```dart
port.description        // "USB Serial Port"
port.transport          // SerialPortTransport.usb
port.vendorId?.toRadixString(16)  // "0x2341"
```

## DEPS
libserialport: ^0.3.0

## NOTES
**Aurora OS**: Требуются права доступа к порту через `devel-su chmod a+rx /dev/ttyACM0` после подключения устройства.

**Платформы**: Aurora 4/5, Linux, macOS, Windows, Android

**Установка через Git** (Aurora Community Plugins):
```yaml
dependencies:
  flutter_libserialport:
    git:
      url: https://developer.auroraos.ru/flutter/flutter-community-plugins/flutter_libserialport.git
      ref: flutter_libserialport-0.4.0-aurora
```
