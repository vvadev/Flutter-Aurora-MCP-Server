<description>
Плагин для сканирования QR кодов на Aurora OS. Предоставляет QRView виджет и QRViewController для управления камерой и обработки результатов сканирования.
</description>

# qr_code_scanner_aurora

## TYPE
custom

## QUICK_START
```dart
QRView(key: _key, onQRViewCreated: _onQRViewCreated)
void _onQRViewCreated(QRViewController controller) {
  controller.scannedDataStream.listen((scanData) => setState(() => _result = scanData));
}
```

## API_SUMMARY
- QRView({required Key key, required onQRViewCreated, overlay, overlayMargin, cameraFacing, onPermissionSet, formatsAllowed}) → Widget
- QRViewController.scannedDataStream → Stream<Barcode>
- QRViewController.flipCamera() → Future<CameraFacing>
- QRViewController.pauseCamera() → Future<void>
- QRViewController.resumeCamera() → Future<void>
- QRViewController.stopCamera() → Future<void>
- QRViewController.getCameraInfo() → Future<CameraFacing>
- QRViewController.getFlashStatus() → Future<bool?> (не поддерживается на Aurora)
- QRViewController.toggleFlash() → Future<void> (не поддерживается на Aurora)
- QRViewController.getSystemFeatures() → Future<SystemFeatures>
- QRViewController.scanInvert(bool) → Future<void> (не поддерживается на Aurora)
- QRViewController.hasPermissions → bool
- QrScannerOverlayShape({borderColor, borderRadius, borderLength, borderWidth, cutOutSize, cutOutWidth, cutOutHeight, cutOutBottomOffset})
- Barcode.code → String?
- Barcode.format → BarcodeFormat
- Barcode.rawBytes → List<int>?

## USAGE_PATTERNS
Паттерн: `QRView(key: key, onQRViewCreated: (controller) => _controller = controller, overlay: QrScannerOverlayShape(cutOutSize: 250))`
Результат: Виджет камеры с областью сканирования

Паттерн: `controller.scannedDataStream.listen((scanData) => setState(() => _result = scanData.code))`
Результат: Поток распознанных QR кодов

Паттерн: `await controller.flipCamera()`
Результат: Переключение между фронтальной/задней камерой

Паттерн: `controller.pauseCamera() / controller.resumeCamera()`
Результат: Пауза/возобновление сканирования без закрытия

Паттерн: `controller.stopCamera()`
Результат: Остановка сканирования и камеры

Паттерн: `final features = await controller.getSystemFeatures()`
Результат: SystemFeatures {hasFlash: bool, hasBackCamera: bool, hasFrontCamera: bool}

## DEPS
qr_code_scanner: ^1.0.1
camera: ^0.11.2
camera_aurora (внутренняя зависимость)

## NOTES
- Работает только на Aurora OS 5.1+
- Не поддерживается фонарик (getFlashStatus, toggleFlash)
- Не поддерживается инвертирование сканирования (scanInvert)
- Требует разрешение Camera
- Поддерживает только QR коды (не линейные штрихкоды)
- Автоматическое управление lifecycle через LifecycleEventHandler
