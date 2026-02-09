<description>
Aurora UI-kit для Flutter: набор виджетов/тем/иконок, повторяющих стиль Aurora OS (AppBar, кнопки, поля ввода, индикаторы, popup-меню и т.д.).
</description>

# aurora_controls

## TYPE
custom

## QUICK_START
```dart
runApp(AuroraApp(navigatorKey: navKey, home: const MyHomePage()));
```

## API_SUMMARY
- AuroraApp({navigatorKey: GlobalKey<NavigatorState>?, home: Widget?, theme: AuroraThemeData?, darkTheme: AuroraThemeData?, themeMode: ThemeMode?, enableNativeBackground: bool, ...}) → Widget  
Aurora-обертка над WidgetsApp с темой/локализациями и интеграцией с Aurora Window Manager.
- AuroraTheme(data: AuroraThemeData, child: Widget) → Widget  
Прокидывает Aurora-тему вниз по дереву (и вставляет Material Theme по brightness).
- AuroraTheme.of(context: BuildContext) → AuroraThemeData  
Получить текущую Aurora-тему (или дефолтную по Brightness).
- AuroraTheme.maybeOf(context: BuildContext) → AuroraThemeData?  
Получить Aurora-тему, если она есть в дереве.
- AuroraThemeData(...) → AuroraThemeData  
Тема Aurora (цвета/типографика/размеры).
- AuroraThemeData.fromWindowTheme(data: WindowTheme) → AuroraThemeData  
Создать тему из системной темы окна.
- AuroraThemeData.<atmosphere>() → AuroraThemeData  
Готовые пресеты: `reef|peak|pebbles|volcano|lake|aura` × `Light|Dark`.
- AuroraThemeData.copyWith(...) → AuroraThemeData  
Клонирование темы с заменой части параметров.
- AuroraColors.primary|primary80|secondary|... → AtmosphereColor, AuroraColors.transparent → Color  
Набор цветов по атмосферам (ColorSwatch).
- AtmosphereColor.<atmosphere>() → Color  
Доступ к цвету для `reefDark/reefLight/...`.
- AuroraGeometry.module|halfModule → double; AuroraGeometry.moduleX(multiplier: int) → double  
Модульная сетка размеров + множество готовых `moduleX*` констант.
- AuroraIcons.<name>([defaultIcon: IconData]) → IconData  
Иконки Aurora OS (на не-Aurora возвращает `defaultIcon` или `Icons.question_mark`).
- AuroraPageRoute<T>({builder: (BuildContext)→Widget, transitionDuration: Duration, ...}) → Route<T>  
Переход страниц в стиле Aurora + жест “назад” и индикатор навигации.
- AuroraPageTransition({child: Widget, primaryRouteAnimation: Animation<double>, secondaryRouteAnimation: Animation<double>, linearTransition: bool}) → Widget  
Виджет перехода (используется внутри `AuroraPageRoute`).

- AuroraAppBar({headerText: String, subHeaderText: String, content: List<AppBarControl>, background: bool, monochrome: bool, divider: bool, opened: bool, ...}) → PreferredSizeWidget  
AppBar в стиле Aurora.
- AppBarControl → Widget  
Базовый тип элемента `AuroraAppBar.content`.
- AuroraAppBarButton({icon: IconData?, text: String?, onPressed: VoidCallback?, layoutDirection: IconPosition?, ...}) → Widget  
Кнопка для `AuroraAppBar`.

- AuroraButton({onPressed: VoidCallback?, label: String?, icon: IconData?, primary: bool, iconPosition: IconPosition, ...}) → Widget  
Кнопка в стиле Aurora (primary: фон, иначе рамка; null onPressed = disabled).
- ButtonState {pressed, released}  
Состояние кнопки (внутренний enum, публичный тип).
- IconPosition {left, right}  
Позиция иконки в `AuroraButton`/`AuroraAppBarButton`.

- AuroraSwitch({value: bool, onChanged: ValueChanged<bool>?, busy: bool, ...}) → Widget  
Переключатель (busy: анимация ожидания + блокировка).
- AuroraTextSwitch({value: bool, text: String, description: String?, onChanged: ValueChanged<bool>?, ...}) → Widget  
Переключатель с текстом/описанием.
- AuroraIconTextSwitch({value: bool, text: String, icon: IconData, description: String?, onChanged: ValueChanged<bool>?, ...}) → Widget  
Переключатель с текстом и дополнительной иконкой.

- AuroraSlider({value: double, onChanged: ValueChanged<double>?, min: double, max: double, valueIndicatorLabel: String?, textLabel: String?, handle: bool, ...}) → Widget  
Слайдер в стиле Aurora (handle=false скрывает бегунок).
- AuroraSliderThumbShape({...}) → SliderComponentShape  
Форма бегунка слайдера (Aurora-стиль).
- AuroraSliderTrackShape({thumbRadius: double, thumbWidth: double, paintThumb: bool}) → SliderTrackShape  
Форма трека слайдера (Aurora-стиль).
- AuroraSliderValueIndicatorShape() → RectangularSliderValueIndicatorShape  
Форма value-indicator (Aurora-стиль).

- BusyIndicatorSize {extraSmall, small, medium, large}  
Размеры `AuroraBusyIndicator`.
- AuroraBusyIndicator({running: bool, size: BusyIndicatorSize, color: Color?}) → Widget  
Индикатор занятости.

- ProgressIndicatorSize {extraSmall, small, medium, extraLarge}  
Размеры `AuroraProgressCircle`.
- AuroraProgressCircle({size: ProgressIndicatorSize, activeColor: Color?, enableScalingAnimation: bool, ...}) → Widget  
Круговой индикатор прогресса (анимированный).

- AuroraProgressBar({value: double?, showValueIndicator: bool, label: String?, min: double, max: double, ...}) → Widget  
Прогресс-бар (value=null = indeterminate).
- AuroraLinearProgressIndicator({value: double?, minHeight: double?, borderRadius: BorderRadiusGeometry, color: Color?, backgroundColor: Color?}) → Widget  
Низкоуровневый индикатор (используется `AuroraProgressBar`).

- AuroraNavigationIndicator({value: double(0..1), orientation: NavigationIndicatorOrientation}) → Widget  
Индикатор навигации (положение 0..1).
- AuroraNavigationIndicatorButton({value: double?, orientation: NavigationIndicatorOrientation, onPressed: VoidCallback?}) → Widget  
Кликабельная версия индикатора.
- NavigationIndicatorOrientation {left, right}  
Сторона индикатора.

- AuroraPageHeader(text: String, alignment: AuroraHeaderAlignment, highlighted: bool, ...) → Widget  
Заголовок страницы.
- AuroraSectionHeader(text: String, alignment: AuroraHeaderAlignment, ...) → Widget  
Заголовок секции.
- AuroraHeaderAlignment {left, center, right}  
Выравнивание заголовков.

- AuroraScrollBehavior() → ScrollBehavior  
ScrollBehavior, который строит `AuroraScrollbar`.
- AuroraScrollbar({child: Widget, controller: ScrollController?, ...}) → Widget  
Scrollbar в стиле Aurora.

- AuroraTextField({controller: TextEditingController?, decoration: AuroraInputDecoration, showSuffix: bool, readOnly: bool, canRequestFocus: bool, ...}) → Widget  
Текстовое поле в стиле Aurora (поддержка helper/error/иконок/встроенных items).
- InputCounterWidgetBuilder(context: BuildContext, {currentLength: int, maxLength: int?, isFocused: bool}) → Widget?  
Сигнатура для `AuroraTextField.buildCounter`.
- AuroraTextFormField({...}) → FormField<String>  
FormField-обертка над `AuroraTextField` с validator/onSaved.
- AuroraSearchField({controller: TextEditingController?, decoration: AuroraInputDecoration?, restorationId: String?}) → Widget  
Поиск (по умолчанию: search-иконка слева и clear-кнопка справа).
- AuroraTextFieldItem({icon: IconData, onPressed: VoidCallback?, behavior: AuroraTextFieldItemBehavior, ...}) → Widget  
Небольшой item (обычно справа/слева в `AuroraInputDecoration`).
- AuroraTextFieldItemBehavior {onFocus, always, never, onNonEmptyText}  
Когда показывать `AuroraTextFieldItem`.
- AuroraTextFieldHelper({title: String?, body: String?, label: Widget?, helper: Widget?, ...}) → Widget  
Хелпер в стиле Aurora.
- AuroraInputDecoration({...}) → AuroraInputDecoration  
Декорация для `AuroraTextField` (placeholder/label/helper/error + leftItem/rightItem).
- AuroraOutlineInputBorder() → OutlineInputBorder; AuroraBorderSide() → BorderSide  
Базовые бордеры для текстовых полей.

- openAuroraPopup<T>({rootContext: BuildContext, anchorContext: BuildContext, items: List<AuroraPopupMenuEntry<T>>, bottomGroup: AuroraPopupMenuHorizontalGroup<T>?, ...}) → Future<T?>  
Открыть popup-меню, привязанное к anchor (автопозиционирование вверх/вниз).
- PopupMenuPositionBuilder(context: BuildContext, constraints: BoxConstraints) → RelativeRect  
Построитель позиции меню (если нужно вручную).
- PopupMenuItemBuilder<T>(context: BuildContext) → List<AuroraPopupMenuEntry<T>>  
Ленивая сборка списка пунктов (типдеф).
- PopupMenuItemSelected<T>(value: T) → void; PopupMenuCanceled() → void  
Коллбеки выбора/отмены (типдефы).
- AuroraPopupMenuEntry<T> → Widget  
Базовый тип элемента popup-меню.
- AuroraPopupMenuItem<T>({title: String?, leadingIcon: IconData?, trailingIcon: IconData?, value: T?, submenuItems: List<AuroraPopupMenuEntry<T>>?, submenuTitle: String?, popOnTap: bool?, ...}) → Widget  
Элемент меню (поддерживает подменю).
- AuroraPopupMenuHeader({title: String, ...}) → Widget  
Заголовок страницы меню.
- AuroraPopupMenuDivider({height: double}) → Widget  
Разделитель.
- AuroraCheckedPopupMenuItem<T>({title: String, checked: bool, popOnTap: bool, ...}) → Widget  
Пункт с чекбоксом (реализован через `AuroraSwitch`).
- AuroraPopupMenuHorizontalGroup<T>({buttons: List<AuroraPopupGroupButton<T>>}) → Widget  
Нижняя группа кнопок (до 4).
- AuroraPopupGroupButton<T>({icon: IconData, value: T?, ...}) → Widget  
Кнопка в горизонтальной группе.
- AuroraPopupSubmenu<T>({title: String, items: List<AuroraPopupMenuEntry<T>>}) → Object  
Описание подменю (внутренний тип данных).

## USAGE_PATTERNS
Паттерн:
```dart
runApp(AuroraApp(navigatorKey: navKey, home: const MyHomePage()));
```
Результат: включает Aurora-тему, локализации и интеграцию с системной темой/фоном окна.

Паттерн:
```dart
Navigator.of(context).push(AuroraPageRoute(builder: (_) => const NextPage()));
```
Результат: Aurora-анимация перехода + индикатор навигации (если можно `pop()`).

Паттерн:
```dart
AuroraButton(onPressed: () {}, icon: AuroraIcons.add(Icons.add));
```
Результат: кнопка в стиле Aurora (на не-Aurora иконка берется из fallback).

Паттерн:
```dart
AuroraSwitch(value: v, busy: busy, onChanged: (nv) => setState(() => v = nv));
```
Результат: переключатель; при `busy=true` мигает/анимируется и блокирует переключение до обновления состояния.

Паттерн:
```dart
AuroraTextField(decoration: AuroraInputDecoration(placeholderText: 'Email', filled: true));
```
Результат: текстовое поле с aurora-стилем placeholder/заливки.

Паттерн:
```dart
openAuroraPopup<int>(rootContext: context, anchorContext: anchorCtx, items: [AuroraPopupMenuItem(value: 1, title: '...')]);
```
Результат: открывает popup рядом с якорем; возвращает выбранный `value` (или null при закрытии).

## DEPS
- flutter (sdk)
- flutter_localizations (sdk)
- aurora_window_manager (sdk)

## NOTES
- Используйте `AuroraApp`, чтобы корректно работали тема/атмосферы и `enableNativeBackground`.
- `AuroraIcons.*()` проверяет Aurora OS через `/etc/os-release` (`ID=auroraos`); на других платформах вернет fallback-иконку.
- Для popup-меню нужен `anchorContext` из `Builder(...)`, а `rootContext` должен иметь доступ к `Overlay`.
- Пакет включает шрифт `AuroraIcons.ttf` (family: `AuroraIcons`).

