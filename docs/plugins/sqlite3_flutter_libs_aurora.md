<description>
Нативные библиотеки SQLite 3.51.1 для Aurora OS. Используется совместно с sqflite_common_ffi и sqlite3 для работы с базами данных.
</description>

# sqlite3_flutter_libs_aurora

## TYPE
fork

## QUICK_START
```dart
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
databaseFactory = databaseFactoryFfi;
var db = await openDatabase(path);
```

## API_SUMMARY
См. pub.dev/packages/sqlite3_flutter_libs

## USAGE_PATTERNS
**Инициализация**
```dart
databaseFactory = databaseFactoryFfi;
```

**Открытие базы**
```dart
_db = await openDatabase(path, version: 1, onCreate: (db, v) async {
  await db.execute('CREATE TABLE Test (val_str TEXT)');
});
```

**Запрос данных**
```dart
final rows = await _db?.rawQuery('SELECT rowid as id, * FROM Test');
```

**Вставка в транзакции**
```dart
await _db?.transaction((txn) async {
  await txn.rawInsert('INSERT INTO Test(val_str) VALUES(?)', [value]);
});
```

**Обновление**
```dart
await txn.rawUpdate('UPDATE Test SET val_str = ? WHERE rowid = ?', [value, id]);
```

**Удаление**
```dart
await _db?.rawDelete('DELETE FROM Test');
```

**Закрытие**
```dart
await _db?.close();
```

## DEPS
sqlite3: ^2.5.0
sqflite_common_ffi: ^2.0.0

## NOTES
- SQLite версии 3.51.1
- Совместимость: Aurora OS 5.1+
- Требуется разрешение UserDirs
- Использует getApplicationSupportDirectory() для пути
