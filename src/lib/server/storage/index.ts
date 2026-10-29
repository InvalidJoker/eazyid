import { eq } from 'drizzle-orm';
import { db, schema } from '#lib/server/db/index.js';
import type { SettingValues } from '#lib/server/settings/definitions.js';
import { getSettings } from '#lib/server/settings/index.js';
import { getStorageConfig, type StorageConfig, type StorageDriverName } from './config';
import { createDatabaseDriver } from './drivers/database';
import type { StorageDriver } from './drivers/driver';
import { createLocalDriver } from './drivers/local';
import { createS3Driver } from './drivers/s3';
import { fileKeyFromUrl, fileUrl } from './url';

export class StorageNotConfiguredError extends Error {
	constructor(driver: StorageDriverName) {
		super(`The ${driver} storage is missing required settings`);
	}
}

function createDriver(config: StorageConfig): StorageDriver {
	switch (config.driver) {
		case 'database':
			return createDatabaseDriver();
		case 'local':
			return createLocalDriver(config.path);
		case 's3':
			return createS3Driver(config);
	}
}

function driverFor(settings: SettingValues, name?: StorageDriverName) {
	const config = getStorageConfig(settings, name);
	if (!config) throw new StorageNotConfiguredError(name ?? settings['storage.driver']);
	return { name: config.driver, driver: createDriver(config) };
}

/** Saves a file with the active driver. Returns its key and the URL it is served from. */
export async function saveFile(folder: string, body: Uint8Array, contentType: string) {
	const { name, driver } = driverFor(await getSettings());
	const key = `${folder}/${crypto.randomUUID()}`;

	await driver.put(key, body, contentType);
	await db.insert(schema.file).values({ key, driver: name, contentType, size: body.byteLength });

	return { key, url: fileUrl(key) };
}

/** Reads a file from the driver it was saved with, even if the active driver changed since. */
export async function readFile(key: string) {
	const [file] = await db.select().from(schema.file).where(eq(schema.file.key, key)).limit(1);
	if (!file) return null;

	const { driver } = driverFor(await getSettings(), file.driver as StorageDriverName);
	const body = await driver.get(key);

	return body && { body, contentType: file.contentType };
}

export async function deleteFile(key: string) {
	const [file] = await db.select().from(schema.file).where(eq(schema.file.key, key)).limit(1);
	if (!file) return;

	const { driver } = driverFor(await getSettings(), file.driver as StorageDriverName);
	await driver.delete(key);
	await db.delete(schema.file).where(eq(schema.file.key, key));
}

/** Deletes the file behind a `/files/...` URL. Any other value is ignored. */
export async function deleteFileByUrl(url: unknown) {
	const key = fileKeyFromUrl(url);
	if (key) await deleteFile(key);
}
