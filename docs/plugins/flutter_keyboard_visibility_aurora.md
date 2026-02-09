<description>
Плагин для отслеживания видимости клавиатуры в приложениях Flutter на Aurora OS. Предоставляет Stream<bool> с состоянием клавиатуры.
</description>

# flutter_keyboard_visibility_aurora

## TYPE
custom

## QUICK_START
```dart
KeyboardVisibilityController().onChange.listen((isOpen) {
  print(isOpen);
});
```

## API_SUMMARY
- FlutterKeyboardVisibilityAurora.onChange → Stream<bool>
  Поток событий об изменении видимости клавиатуры (true = открыта)

## USAGE_PATTERNS
Паттерн: `KeyboardVisibilityController().onChange.listen((isOpen) {...})`
Результат: стрим с boolean состоянием клавиатуры

Паттерн: `KeyboardVisibilityBuilder(builder: (context, visible) => ...)`
Результат: виджет обновляется при изменении видимости клавиатуры

Паттерн: `KeyboardDismissOnTap(child: ...)`
Результат: скрытие клавиатуры при нажатии вне области ввода

## DEPS
- flutter_keyboard_visibility_platform_interface: ^2.0.0
- plugin_platform_interface: ^2.0.2

## NOTES
Платформа: Aurora OS 5.0.0+, Flutter 3.32.7+
Реализует platform interface пакета flutter_keyboard_visibility
Использует MethodChannel 'flutter_keyboard_visibility_aurora'
