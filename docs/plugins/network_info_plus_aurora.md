<description>
Получает информацию о Wi-Fi сети на Aurora OS через ConnMan (SSID, BSSID, IPv4/IPv6, шлюз, broadcast, маска подсети)
</description>

# network_info_plus_aurora

## TYPE
fork

## QUICK_START
```dart
import 'package:network_info_plus/network_info_plus.dart';
final info = NetworkInfo();
```

## API_SUMMARY
См. pub.dev/packages/network_info_plus (стандартный API)
- getWifiName() → String? - SSID или имя сети
- getWifiBSSID() → String? - MAC-адрес точки доступа
- getWifiIP() → String? - IPv4 адрес
- getWifiIPv6() → String? - IPv6 адрес
- getWifiSubmask() → String? - Маска подсети IPv4
- getWifiGatewayIP() → String? - Шлюз IPv4
- getWifiBroadcast() → String? - Broadcast адрес IPv4

## USAGE_PATTERNS
Паттерн: `final info = NetworkInfo(); final name = await info.getWifiName();`
Результат: SSID сети в String или null

Паттерн: `final ip = await info.getWifiIP();`
Результат: IPv4 адрес в формате "192.168.1.100" или null

Паттерн: `final gateway = await info.getWifiGatewayIP();`
Результат: IP адрес шлюза в формате "192.168.1.1" или null

## DEPS
network_info_plus: ^7.0.0
dbus: ^0.7.11
network_info_plus_platform_interface: ^2.0.2

## NOTES
- Требует разрешения Internet в aurora/permissions
- Совместим с Flutter 3.32.7+, Aurora OS 5.0.0+
- Использует ConnMan через DBus для получения информации
- Возвращает null если нет активного Wi-Fi подключения
- Broadcast адрес вычисляется автоматически из IP и маски подсети
