import { eq } from 'drizzle-orm';
import { db, schema } from '#lib/server/db/index.js';
import { assetUrlPrefix } from './url';

export const maxImageBytes = 2 * 1024 * 1024;

// SVG is left out on purpose: it can carry scripts and is served from our own origin
export const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];

export class InvalidImageError extends Error {}

export async function storeImage(file: File) {
	if (!imageTypes.includes(file.type)) {
		throw new InvalidImageError('Use a PNG, JPEG, WebP, GIF or AVIF image');
	}
	if (file.size > maxImageBytes) {
		throw new InvalidImageError('The image must be 2 MB or smaller');
	}

	const id = crypto.randomUUID();
	const data = Buffer.from(await file.arrayBuffer()).toString('base64');
	await db.insert(schema.asset).values({ id, contentType: file.type, data });

	return `${assetUrlPrefix}${id}`;
}

export async function getAsset(id: string) {
	const [asset] = await db.select().from(schema.asset).where(eq(schema.asset.id, id)).limit(1);
	if (!asset) return null;

	return { contentType: asset.contentType, body: Buffer.from(asset.data, 'base64') };
}

/** Deletes the asset behind a URL from `storeImage`. Other URLs are left alone. */
export async function deleteAssetByUrl(url: unknown) {
	if (typeof url !== 'string' || !url.startsWith(assetUrlPrefix)) return;
	await db.delete(schema.asset).where(eq(schema.asset.id, url.slice(assetUrlPrefix.length)));
}
