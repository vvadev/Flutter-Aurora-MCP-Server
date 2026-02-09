<description>
Выполнение фоновых задач на Aurora OS через Runtime Manager
</description>

# WORKMANAGER

## TYPE
custom

## QUICK_START
```dart
import 'package:workmanager/workmanager.dart';

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) {
    print('Task: $task');
    return Future.value(true);
  });
}

void main() {
  Workmanager().initialize(callbackDispatcher, isInDebugMode: true);
  Workmanager().registerPeriodicTask('task-name', 'TaskName', 
    frequency: const Duration(hours: 1),
  );
}
```

## API_SUMMARY
- initialize(Function callbackDispatcher, {bool isInDebugMode}) → void
- registerOneOffTask(String uniqueName, String taskTag) → void
- registerPeriodicTask(String uniqueName, String taskTag, {Duration frequency, Duration initialDelay}) → void
- cancelByUniqueName(String uniqueName) → Future<bool>
- cancelByTag(String tag) → Future<bool>
- cancelAll() → Future<bool>

## USAGE_PATTERNS

**Инициализация:**
```dart
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) {
    switch (task) {
      case 'SimpleTask':
        print('Task started');
        return Future.value(true);
      default:
        return Future.value(false);
    }
  });
}

void main() {
  Workmanager().initialize(callbackDispatcher, isInDebugMode: true);
}
```

**Периодическая задача:**
```dart
Workmanager().registerPeriodicTask(
  'periodic-task',
  'MyTask',
  frequency: const Duration(hours: 1),
);
```

**Одноразовая задача:**
```dart
Workmanager().registerOneOffTask('one-off-task', 'SimpleTask');
```

**Отмена задачи:**
```dart
await Workmanager().cancelByUniqueName('periodic-task');
```

## DEPS
- workmanager: ^0.5.2
- workmanager_aurora: SDK flutter

## NOTES
**Поддержка на Aurora:**
- registerOneOffTask - поддерживается
- registerPeriodicTask - поддерживается
- cancelByUniqueName - поддерживается
- cancelByTag - поддерживается
- cancelAll - поддерживается

**Ограничения:**
1. Точка входа ОБЯЗАТЕЛЬНО называется `callbackDispatcher`
2. Одноразовые задачи не перезапускаются при ошибке
3. Конфигурация задаётся в .desktop файле, не в Dart коде
4. Начальная задержка (initialDelay) НЕ поддерживается
5. Периодические задачи запускаются сразу при регистрации
6. Минимальная частота - 15 минут
7. Требуется запуск через иконку (flutter run не работает)
8. Задачи запускаются в отдельном процессе с собственным Dart VM

**Требования к конфигурации (.desktop файл):**
```desktop
[X-Task <ONE_OFF_TASK_NAME>]
Type=worker
Permissions=

[X-Task <PERIODIC_TASK_NAME>]
Type=periodic
Permissions=Location
Conditions=internet
```

**Требования к CMakeLists.txt:**
```cmake
find_package(Qt5 COMPONENTS Core REQUIRED)
target_link_libraries(${BINARY_NAME} PRIVATE Qt5::Core)
```

**Требования к main.cpp:**
```cpp
aurora::EnableQtCompatibility(); // Включить Qt
```

**Разрешения и условия:**
- Permissions: Location, Internet, UserDirs и т.д.
- Conditions: internet (запускать только при наличии интернета)

**Ограничения Runtime Manager:**
- Требуется OS Aurora >= 5.1.3
- Задачи работают как отдельные процессы
- Нет доступа к памяти основного приложения
