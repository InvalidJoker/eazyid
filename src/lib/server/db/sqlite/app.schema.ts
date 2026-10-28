import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const setting = sqliteTable('setting', {
	key: text('key').primaryKey(),
	value: text('value', { mode: 'json' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});
