<description>
Flutter плагин pdfrx с поддержкой Aurora. Быстрый PDF viewer на базе PDFium (PDF.js для Web). Поддерживает просмотр, навигацию, поиск текста, ссылки, оглавление, выделение текста.
</description>

# pdfrx

## TYPE
fork (оригинал: pub.dev/packages/pdfrx v1.0.82 + поддержка Aurora)

## QUICK_START
```dart
PdfViewer.asset('assets/file.pdf',
  controller: controller,
  params: PdfViewerParams(
    enableTextSelection: true,
    linkHandlerParams: PdfLinkHandlerParams(onLinkTap: _handleLink),
  ),
)
```

## API_SUMMARY

### Виджеты
- PdfViewer.asset(file, {controller, params, initialPageNumber, passwordProvider}) → Widget
- PdfViewer.file(path, {controller, params, passwordProvider}) → Widget
- PdfViewer.uri(uri, {controller, params, passwordProvider, headers, preferRangeAccess, withCredentials}) → Widget
- PdfViewer.data(data, sourceName, {controller, params, passwordProvider}) → Widget
- PdfViewer.custom(read, fileSize, sourceName, {controller, params, passwordProvider}) → Widget
- PdfPageView(document, pageNumber, {alignment, backgroundColor}) → Widget
- PdfDocumentViewBuilder.asset(file, builder, {passwordProvider}) → Widget
- PdfViewerScrollThumb(controller, {orientation, thumbSize, thumbBuilder}) → Widget

### Контроллер
- PdfViewerController() → контроллер для управления viewer
  - goToPage(pageNumber, {anchor, duration}) → Future<void>
  - goToDest(dest, {duration}) → Future<bool>
  - goTo(matrix, {duration}) → Future<void>
  - zoomUp({loop, zoomCenter}) → Future<void>
  - zoomDown({loop, zoomCenter}) → Future<void>
  - relayout() → void
  - isReady → bool
  - currentPageNumber → int?
  - pageCount → int
  - currentZoom → double
  - document → PdfDocument?
  - documentRef → PdfDocumentRef
  - alternativeFitScale → double

### Поиск
- PdfTextSearcher(controller) → TextSearcher
  - startTextSearch(pattern, {caseInsensitive, goToFirstMatch, searchImmediately}) → void
  - goToNextMatch() → Future<int>
  - goToPrevMatch() → Future<int>
  - goToMatch(match) → Future<void>
  - goToMatchOfIndex(index) → Future<int>
  - resetTextSearch() → void
  - matches → List<PdfTextRangeWithFragments>
  - currentIndex → int?
  - isSearching → bool
  - searchProgress → double?
  - pageTextMatchPaintCallback → Function (для highlights)
  - addListener/removeListener → manage listeners

### Документ
- PdfDocument.openFile(path, {passwordProvider}) → Future<PdfDocument>
- PdfDocument.openAsset(name, {passwordProvider}) → Future<PdfDocument>
- PdfDocument.openData(data, {sourceName}) → Future<PdfDocument>
- PdfDocument.openUri(uri, {passwordProvider, headers, progressCallback, reportCallback, preferRangeAccess, withCredentials}) → Future<PdfDocument>
- PdfDocument.openCustom(read, fileSize, sourceName, {passwordProvider}) → Future<PdfDocument>
- PdfDocument.pages → List<PdfPage>
- PdfDocument.loadOutline() → Future<List<PdfOutlineNode>>
- PdfDocument.sourceName → String
- PdfDocument.isEncrypted → bool
- PdfDocument.permissions → PdfPermissions
- PdfDocument.dispose() → Future<void>

### Страница
- PdfPage.render({x, y, width, height, fullWidth, fullHeight, backgroundColor, annotationRenderingMode, cancellationToken}) → Future<PdfImage?>
- PdfPage.loadText() → Future<PdfPageText>
- PdfPage.loadLinks({compact}) → Future<List<PdfLink>>
- PdfPage.pageNumber → int
- PdfPage.width → double (points at 72dpi)
- PdfPage.height → double
- PdfPage.size → Size
- PdfPage.rotation → PdfPageRotation
- PdfPage.createCancellationToken() → PdfPageRenderCancellationToken

### Текст страницы
- PdfPageText.fullText → String
- PdfPageText.fragments → List<PdfPageTextFragment>
- PdfPageText.pageNumber → int
- PdfPageText.allMatches(pattern, {caseInsensitive}) → Stream<PdfTextRangeWithFragments>

### Оглавление
- PdfOutlineNode.title → String
- PdfOutlineNode.dest → PdfDest?
- PdfOutlineNode.children → List<PdfOutlineNode>

### Ссылки
- PdfLink.url → Uri?
- PdfLink.dest → PdfDest?
- PdfLink.rects → List<PdfRect>
- PdfLinkHandlerParams(onLinkTap, {linkColor, customPainter}) → link handler config

### PdfViewerParams
```dart
PdfViewerParams({
  margin: 8.0,
  backgroundColor: Colors.grey,
  maxScale: 8.0,
  minScale: 0.1,
  enableTextSelection: false,
  linkHandlerParams,
  viewerOverlayBuilder,
  pageOverlaysBuilder,
  pagePaintCallbacks,
  loadingBannerBuilder,
  onPageChanged,
  onViewerReady,
  onDocumentChanged,
  onViewSizeChanged,
  onePassRenderingScaleThreshold: 200/72,
  layoutPages,          // custom layout
  pageAnchor: PdfPageAnchor.top,
  scrollByMouseWheel: 0.2,
  enableKeyboardNavigation: true,
  maxImageBytesCachedOnMemory: 100MB,
  // ... и др
})
```

## USAGE_PATTERNS

### Открытие PDF
```dart
// Из assets
PdfViewer.asset('assets/doc.pdf')

// Из файла
PdfViewer.file('/path/to/file.pdf')

// Из URL
PdfViewer.uri(Uri.parse('https://example.com/doc.pdf'))

// Из памяти
PdfViewer.data(fileBytes, sourceName: 'custom.pdf')

// С паролем
PdfViewer.asset('secret.pdf',
  passwordProvider: () async => await _showPasswordDialog())
```

### Текстовый поиск
```dart
final controller = PdfViewerController();
final textSearcher = PdfTextSearcher(controller)..addListener(_update);

// В PdfViewerParams:
PdfViewerParams(
  pagePaintCallbacks: [textSearcher.pageTextMatchPaintCallback],
)

// Запуск поиска
textSearcher.startTextSearch('search term', caseInsensitive: true)

// Навигация по результатам
textSearcher.goToNextMatch()
textSearcher.goToPrevMatch()

// Получение результатов
for (final match in textSearcher.matches) {
  print('${match.pageNumber}: ${match.bounds}');
}
```

### Обработка ссылок
```dart
PdfViewerParams(
  linkHandlerParams: PdfLinkHandlerParams(
    linkColor: Colors.blue.withOpacity(0.2),
    onLinkTap: (link) {
      if (link.url != null) {
        launchUrl(link.url!);
      } else if (link.dest != null) {
        controller.goToDest(link.dest);
      }
    },
  ),
)
```

### Оглавление (bookmarks)
```dart
PdfViewerParams(
  onViewerReady: (document, controller) async {
    final outline = await document.loadOutline();
    // outline: List<PdfOutlineNode>
    for (final node in outline) {
      print('${node.title} -> ${node.dest?.pageNumber}');
    }
  },
)

// Переход к разделу
controller.goToDest(outlineNode.dest);
```

### Кастомный layout (горизонтальный)
```dart
PdfViewerParams(
  layoutPages: (pages, params) {
    final height = pages.fold(0.0, (prev, page) => max(prev, page.height)) + params.margin * 2;
    final pageLayouts = <Rect>[];
    double x = params.margin;
    for (var page in pages) {
      pageLayouts.add(Rect.fromLTWH(x, (height - page.height) / 2, page.width, page.height));
      x += page.width + params.margin;
    }
    return PdfPageLayout(pageLayouts: pageLayouts, documentSize: Size(x, height));
  },
)
```

### Scroll thumbs
```dart
PdfViewerParams(
  viewerOverlayBuilder: (context, size, handleLinkTap) => [
    PdfViewerScrollThumb(
      controller: controller,
      orientation: ScrollbarOrientation.right,
      thumbSize: const Size(40, 25),
      thumbBuilder: (context, thumbSize, pageNumber, _) =>
        Container(color: Colors.black, child: Text(pageNumber.toString())),
    ),
  ],
)
```

### Loading indicator
```dart
PdfViewerParams(
  loadingBannerBuilder: (context, bytesDownloaded, totalBytes) {
    return Center(child: CircularProgressIndicator(
      value: totalBytes != null ? bytesDownloaded / totalBytes : null,
    ));
  },
)
```

### Навигация
```dart
// К странице
controller.goToPage(pageNumber: 5)

// К месту в документе
controller.goToPage(pageNumber: 3, anchor: PdfPageAnchor.top)

// К цели (оглавление/ссылка)
controller.goToDest(pdfDest)

// Зум
controller.zoomUp()
controller.zoomDown()
controller.zoomUp(loop: true) // циклический
```

### Выделение текста
```dart
PdfViewerParams(
  enableTextSelection: true,
  onTextSelectionChange: (selection) {
    if (selection != null && selection.isNotEmpty) {
      print('Selected: ${selection.text} on page ${selection.pageNumber}');
    }
  },
)
```

### Рендер страницы вручную
```dart
final image = await page.render(
  fullWidth: page.width * 2,  // 144 dpi
  fullHeight: page.height * 2,
  backgroundColor: Colors.white,
);
image?.dispose();
```

## DEPS
collection, crypto, ffi, http, path, path_provider, rxdart, synchronized, url_launcher, vector_math, web, package_info_plus

Aurora-специфичные: path_provider_aurora, url_launcher_aurora, package_info_plus_aurora, platform_aurora

## NOTES
- **Aurora**: только версии 5+
- **Web**: требует CORS для внешних URL
- **macOS**: может блокироваться App Sandbox
- **Windows**: нужен Developer Mode для symbolic links
- **Пароли**: passwordProvider вызывается многократно пока не вернёт null или валидный пароль
- **Text selection**: экспериментально, известны проблемы на Desktop/Web
- **Максимальный zoom**: по умолчанию 8.0
- **Память**: maxImageBytesCachedOnMemory по умолчанию 100MB
- **Кастомный layout**: требует controller.relayout() при изменении layoutPages callback
- **Цвета**: matchTextColor (желтый), activeMatchTextColor (оранжевый) для поиска
- **Координаты**: PdfRect использует bottom-left origin (PDF координаты), не Flutter
- **Оригинал**: см. pub.dev/packages/pdfrx для полной документации
