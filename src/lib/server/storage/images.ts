import { saveFile } from './index';

export const maxImageBytes = 2 * 1024 * 1024;

// SVG is left out on purpose: it can carry scripts and is served from our own origin
export const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];

export class InvalidImageError extends Error {}

/** Validates an uploaded image and saves it under `folder`, e.g. `branding` or `avatars`. */
export async function saveImage(folder: string, file: File) {
	if (!imageTypes.includes(file.type)) {
		throw new InvalidImageError('Use a PNG, JPEG, WebP, GIF or AVIF image');
	}
	if (file.size > maxImageBytes) {
		throw new InvalidImageError('The image must be 2 MB or smaller');
	}

	return saveFile(folder, new Uint8Array(await file.arrayBuffer()), file.type);
}
