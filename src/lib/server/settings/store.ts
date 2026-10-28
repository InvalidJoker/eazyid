import { db, schema } from '#lib/server/db/index.js';
import type { SettingKey } from './definitions';

export async function loadStoredSettings() {
	const rows = await db.select().from(schema.setting);
	return new Map(rows.map((row) => [row.key as SettingKey, row.value]));
}

export async function storeSetting(key: SettingKey, value: unknown) {
	await db
		.insert(schema.setting)
		.values({ key, value })
		.onConflictDoUpdate({ target: schema.setting.key, set: { value } });
}
