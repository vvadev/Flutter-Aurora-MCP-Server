<description>
Flutter плагин для просмотра PDF документов на Aurora OS, форк pdfrx с использованием PDFium. Поддерживает открытие из assets, файлов, URL, памяти, поиск текста, оглавление и настраиваемую разметку страниц.
</description>

# pdfrx_aurora

## TYPE
fork

## QUICK_START
```dart
final documentRef = ValueNotifier<PdfDocumentRef?>(null);
final controller = PdfViewerController();

// Открытие из asset
documentRef.value = PdfDocumentRefAsset('assets/hello.pdf');

// Отображение
PdfViewer(
  documentRef.value,
  controller: controller,
  params: PdfViewerParams(
    enableTextSelection: true,
    maxScale: 8,
  ),
)
```

## API_SUMMARY
### PdfDocumentRef (ссылки на документы)
- PdfDocumentRefAsset(name, passwordProvider?, firstAttemptByEmptyPassword?) → Asset
- PdfDocumentRefFile(path, passwordProvider?, firstAttemptByEmptyPassword?) → File
- PdfDocumentRefUri(uri, passwordProvider?, preferRangeAccess?, headers?, withCredentials?) → Network
- PdfDocumentRefData(Uint8List, sourceName, passwordProvider?) → Memory
- PdfDocumentRefCustom(fileSize, read, sourceName, passwordProvider?) → Custom source
- PdfDocumentRefDirect(PdfDocument) → Direct reference

### PdfViewer (виджет)
- PdfViewer.asset(assetName, controller?, params?, initialPageNumber?) → Widget
- PdfViewer.file(path, controller?, params?, initialPageNumber?) → Widget
- PdfViewer.uri(uri, controller?, params?, preferRangeAccess?, headers?, withCredentials?) → Widget
- PdfViewer.data(Uint8List, sourceName, controller?, params?) → Widget
- PdfViewer.custom(fileSize, read, sourceName, controller?, params?) → Widget

### PdfViewerController (управление)
- zoomUp(loop?) → Увеличить масштаб
- zoomDown(loop?) → Уменьшить масштаб
- goToPage(pageNumber) → Перейти на страницу
- goToDest(PdfDest) → Перейти к destination
- goTo(Matrix4) → Применить матрицу трансформации
- relayout() → Пересчитать разметку
- calcRectForRectInsidePage(pageNumber, rect) → Rect в координатах виджета
- ensureVisible(Rect) → Прокрутить к области

### PdfDocument (документ)
- openAsset(name, passwordProvider?, firstAttemptByEmptyPassword?) → Future<PdfDocument>
- openFile(path, passwordProvider?, firstAttemptByEmptyPassword?) → Future<PdfDocument>
- openUri(uri, passwordProvider?, progressCallback?, reportCallback?, preferRangeAccess?, headers?) → Future<PdfDocument>
- openData(data, sourceName?, passwordProvider?, onDispose?) → Future<PdfDocument>
- openCustom(read, fileSize, sourceName, passwordProvider?, maxSizeToCacheOnMemory?) → Future<PdfDocument>
- loadOutline() → Future<List<PdfOutlineNode>>
- get pages → List<PdfPage>
- get permissions → PdfPermissions?

### PdfPage (страница)
- render(x?, y?, width?, height?, fullWidth?, fullHeight?, backgroundColor?, annotationRenderingMode?, cancellationToken?) → Future<PdfImage?>
- loadText() → Future<PdfPageText>
- loadLinks(compact?) → Future<List<PdfLink>>
- get pageNumber → int
- get width/height → double (в points при 72 dpi)
- get size → Size
- get rotation → PdfPageRotation

### PdfPageText (текст страницы)
- allMatches(pattern, caseInsensitive?) → Stream<PdfTextRangeWithFragments>
- get fullText → String
- get fragments → List<PdfPageTextFragment>

### PdfViewerParams (параметры вьюера)
- margin, backgroundColor, maxScale, minScale → Базовые параметры
- layoutPages → PdfPageLayoutFunction? (кастомная разметка)
- enableTextSelection → bool (выделение текста)
- pageAnchor, pageAnchorEnd → PdfPageAnchor (якоря)
- onDocumentChanged, onViewerReady, onPageChanged → Callbacks
- linkHandlerParams → PdfLinkHandlerParams? (обработка ссылок)
- viewerOverlayBuilder → List<Widget>? (оверлеи)
- pagePaintCallbacks → List<PdfViewerPagePaintCallback>? (отрисовка поверх)

### PdfTextSearcher (поиск текста)
- PdfTextSearcher(controller) → Создать поисковик
- find(pattern, caseInsensitive?) → Найти
- next() → Следующий результат
- previous() → Предыдущий результат
- get pageTextMatchPaintCallback → Callback для подсветки

### PdfTextRangeWithFragments (диапазон текста)
- fromTextRange(pageText, start, end) → PdfTextRangeWithFragments?
- get bounds → PdfRect
- get pageNumber → int

## USAGE_PATTERNS
Паттерн: Открытие из файла
```dart
documentRef.value = PdfDocumentRefFile('/path/to/file.pdf',
  passwordProvider: () => showPasswordDialog(context),
);
```

Паттерн: Открытие из URL
```dart
documentRef.value = PdfDocumentRefUri(
  Uri.parse('https://example.com/doc.pdf'),
  progressCallback: (downloaded, total) => print('$downloaded/$total'),
);
```

Паттерн: Поиск текста
```dart
final searcher = PdfTextSearcher(controller)
  ..addListener(() => setState(() {}));
await searcher.find('pattern', caseInsensitive: true);
searcher.next();
```

Паттерн: Получение оглавления
```dart
params: PdfViewerParams(
  onViewerReady: (document, controller) async {
    final outline = await document.loadOutline();
    // outline - List<PdfOutlineNode> с title, dest, children
  },
)
```

Паттерн: Кастомная разметка страниц (горизонтальная)
```dart
PdfViewerParams(
  layoutPages: (pages, params) {
    final height = pages.fold(0.0, (prev, p) => max(prev, p.height)) + params.margin * 2;
    final layouts = <Rect>[];
    double x = params.margin;
    for (final page in pages) {
      layouts.add(Rect.fromLTWH(x, (height - page.height) / 2, page.width, page.height));
      x += page.width + params.margin;
    }
    return PdfPageLayout(pageLayouts: layouts, documentSize: Size(x, height));
  },
)
```

## DEPS
См. pub.dev/packages/pdfrx (оригинальный пакет)

## NOTES
- Форк для Aurora OS (оригинал: https://pub.dev/packages/pdfrx)
- Совместимость: Aurora OS 5.0+
- Поддерживает PDFium через FFI
- Web поддержка через PDF.js
- Публичное API идентично оригинальному pdfrx
- Для Web требуется CORS на сервере при загрузке из URL
- Документация оригинала: https://github.com/espresso3389/pdfrx/blob/master/packages/pdfrx/README.md
