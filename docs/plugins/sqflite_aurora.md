<description>
Платформенная реализация sqflite для Aurora OS. Позволяет работать с SQLite базами данных на Aurora OS 5.1+. Использует стандартный API пакета sqflite.
</description>

# sqflite_aurora

## TYPE
fork

## QUICK_START
```yaml
dependencies:
  sqflite: ^2.4.1
  sqflite_aurora:
    git: https://hub.mos.ru/auroraos/flutter/flutter-community-plugins/sqflite_aurora.git
```

## API_SUMMARY
Полный API: см. pub.dev/packages/sqflite
- getDatabasesPath() → Future<String>
- openDatabase(String path, {int version, onCreate, onUpgrade, onConfigure}) → Future<Database>
- Database.execute(String sql) → Future<void>
- Database.rawQuery(String sql, [List<Object?>? arguments]) → Future<List<Map<String, Object?>>>
- Database.transaction(TransactionHandler action) → Future<T>
- Transaction.rawInsert(String sql, [List<Object?>? arguments]) → Future<int>
- Transaction.rawUpdate(String sql, [List<Object?>? arguments]) → Future<int>
- Database.rawDelete(String sql, [List<Object?>? arguments]) → Future<int>
- Database.close() → Future<void>

## USAGE_PATTERNS
```dart
// Инициализация БД
var databasesPath = await getDatabasesPath();
_db = await openDatabase(
  path,
  version: 1,
  onCreate: (Database db, int version) async {
    await db.execute('CREATE TABLE Test (val_str TEXT)');
  },
);

// Чтение данных
final rows = await _db.rawQuery('SELECT rowid as id, * FROM Test');

// Вставка в транзакции
await _db.transaction((txn) async {
  await txn.rawInsert('INSERT INTO Test(val_str) VALUES(?)', [value]);
});

// Обновление в транзакции
await _db.transaction((txn) async {
  await txn.rawUpdate('UPDATE Test SET val_str = ? WHERE rowid = ?', [value, id]);
});

// Удаление
await _db.rawDelete('DELETE FROM Test');

// Закрытие
await _db.close();
```

## DEPS
- sqflite: ^2.4.1
- pkgconfig(sqlite3)

## NOTES
- Работает на Aurora OS 5.1+
- Требует разрешение UserDirs
- Не публикуется в pub.dev (установка через git)
- Полная документация: https://pub.dev/packages/sqflite
