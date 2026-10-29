import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const setting = pgTable('setting', {
	key: text('key').primaryKey(),
	value: jsonb('value').notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const file = pgTable('file', {
	key: text('key').primaryKey(),
	driver: text('driver').notNull(),
	contentType: text('content_type').notNull(),
	size: integer('size').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const fileBlob = pgTable('file_blob', {
	key: text('key').primaryKey(),
	data: text('data').notNull()
});
