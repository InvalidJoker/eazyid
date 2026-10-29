import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const setting = sqliteTable('setting', {
	key: text('key').primaryKey(),
	value: text('value', { mode: 'json' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});

export const file = sqliteTable('file', {
	key: text('key').primaryKey(),
	driver: text('driver').notNull(),
	contentType: text('content_type').notNull(),
	size: integer('size').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.notNull()
});

export const fileBlob = sqliteTable('file_blob', {
	key: text('key').primaryKey(),
	data: text('data').notNull()
});
