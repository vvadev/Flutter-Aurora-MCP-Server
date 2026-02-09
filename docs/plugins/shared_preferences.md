<description>
Aurora-реализация shared_preferences для хранения простых пар ключ-значение.
</description>

# shared_preferences

## TYPE
fork

## QUICK_START
final prefs = await SharedPreferencesWithCache.create(cacheOptions: const SharedPreferencesWithCacheOptions(allowList: <String>{'counter'}));

## API_SUMMARY
см. pub.dev/packages/shared_preferences

## USAGE_PATTERNS
Паттерн: await migrateLegacySharedPreferencesToSharedPreferencesAsyncIfNecessary(legacySharedPreferencesInstance: prefs, sharedPreferencesAsyncOptions: const SharedPreferencesOptions(), migrationCompletedKey: 'migrationCompleted');
Результат: переносит данные из legacy в async-хранилище один раз.
Паттерн: final counter = (await SharedPreferencesAsync().getInt('externalCounter')) ?? 0;
Результат: читает значение из async-хранилища.
Паттерн: await prefs.setInt('counter', counter);
Результат: сохраняет значение в кеше и на платформе.

## DEPS
shared_preferences: 2.5.3 (см. pub.dev)

## NOTES
Это Aurora-реализация стандартного плагина; полный API см. на pub.dev.
Рекомендуется использовать allowList для кеша и операций очистки.
