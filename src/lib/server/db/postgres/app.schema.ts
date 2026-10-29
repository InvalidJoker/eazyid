import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const setting = pgTable('setting', {
	key: text('key').primaryKey(),
	value: jsonb('value').notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const asset = pgTable('asset', {
	id: text('id').primaryKey(),
	contentType: text('content_type').notNull(),
	data: text('data').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
