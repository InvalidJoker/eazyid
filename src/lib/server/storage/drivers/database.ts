import { eq } from 'drizzle-orm';
import { db, schema } from '#lib/server/db/index.js';
import type { StorageDriver } from './driver';

// Base64 text works the same on every database dialect, at the cost of a third more space
export function createDatabaseDriver(): StorageDriver {
	return {
		async put(key, body) {
			const data = Buffer.from(body).toString('base64');
			await db.insert(schema.fileBlob).values({ key, data });
		},

		async get(key) {
			const [blob] = await db
				.select()
				.from(schema.fileBlob)
				.where(eq(schema.fileBlob.key, key))
				.limit(1);
			return blob ? new Uint8Array(Buffer.from(blob.data, 'base64')) : null;
		},

		async delete(key) {
			await db.delete(schema.fileBlob).where(eq(schema.fileBlob.key, key));
		}
	};
}
