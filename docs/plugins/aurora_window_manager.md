<description>
Плагин для управления окнами Flutter на Aurora OS: смена режима окна, темы, создание и закрытие окон.
</description>
# aurora_window_manager

## TYPE
custom

## QUICK_START
WidgetsFlutterBinding.ensureInitialized();
runApp(const MyApp());

## API_SUMMARY
- WindowMode {foreground|cover}
Режим окна: активное или фоновое.
- WindowType {main|popup|cover}
Тип окна: основное, всплывающее, cover.
- AuroraWindowManager.fullscreen() → Future<void>
Переводит окно в полноэкранный режим.
- AuroraWindowManager.maximizeWindow() → Future<void>
Разворачивает окно.
- AuroraWindowManager.minimizeWindow() → Future<void>
Сворачивает окно.
- AuroraWindowManager.setBackgroundVisibility(value: bool) → Future<void>
Включает/выключает нативный фон.
- AuroraWindowManager.getBackgroundVisibility() → Future<bool>
Возвращает флаг нативного фона.
- AuroraWindowManager.addWindowModeListener(listener: VoidCallback) → void
Подписка на изменение WindowMode.
- AuroraWindowManager.removeWindowModeListener(listener: VoidCallback) → void
Отписка от изменения WindowMode.
- AuroraWindowManager.getWindowMode() → WindowMode
Текущий режим окна.
- AuroraWindowManager.getWindowType() → Future<WindowType>
Текущий тип окна.
- AuroraWindowManager.addThemeListener(listener: VoidCallback) → void
Подписка на изменение темы окна.
- AuroraWindowManager.removeThemeListener(listener: VoidCallback) → void
Отписка от изменения темы окна.
- AuroraWindowManager.getCurrentTheme() → WindowTheme
Текущая тема окна.
- AuroraWindowManager.createWindow(entryPoint: String, entryPointLibrary: String = '', params: Map<String,Object>?) → Future<Map<String,Object>>
Создаёт новое окно и возвращает данные закрытия.
- AuroraWindowManager.getWindowPayload() → Future<Map<String,Object>>
Возвращает параметры, переданные в окно.
- AuroraWindowManager.closeWindow(value: Map<String,Object>) → Future<void>
Закрывает текущее окно с данными.
- AuroraWindowModeChanger(windowModeBuilder: (BuildContext, WindowMode) → Widget)
Виджет для перестройки UI по WindowMode.
- WindowTheme(isDark: bool, statusbarHeight: double, statusbarBaseline: double, highlightColor: Color, primaryColor: Color, secondaryColor: Color, secondaryHighlightColor: Color)
Данные темы окна.

## USAGE_PATTERNS
Паттерн: AuroraWindowModeChanger(windowModeBuilder: windowBuilder);
Результат: UI перестраивается при смене режима окна.

Паттерн: await AuroraWindowManager.fullscreen();
Результат: окно становится полноэкранным.

Паттерн: AuroraWindowManager.createWindow(entryPoint: "newWindowEntryPoint", params: {'result': 'success'});
Результат: создаёт новое окно с параметрами.

Паттерн: final payload = await AuroraWindowManager.getWindowPayload();
Результат: получает параметры, переданные при создании окна.

Паттерн: AuroraWindowManager.closeWindow({'exitCode': 10});
Результат: закрывает окно и возвращает код закрытия.

Паттерн: AuroraWindowManager.addThemeListener(() => setState(() {}));
Результат: обновляет UI при смене темы окна.

## DEPS
- flutter (sdk)
- plugin_platform_interface ^2.0.2
- aurora_platform (sdk)

## NOTES
Только Aurora OS; на других платформах методы являются заглушками.
Для entryPoint используйте @pragma('vm:entry-point') и runApp внутри.
WindowMode.cover используется при работе приложения в фоне.
