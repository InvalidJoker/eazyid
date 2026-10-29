export const fileUrlPrefix = '/files/';

/** Keys look like `<folder>/<uuid>`, e.g. `branding/0b6c...`. */
const keyPattern = /^[a-z0-9-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isFileKey(value: string) {
	return keyPattern.test(value);
}

export function fileUrl(key: string) {
	return `${fileUrlPrefix}${key}`;
}

export function fileKeyFromUrl(url: unknown) {
	if (typeof url !== 'string' || !url.startsWith(fileUrlPrefix)) return null;

	const key = url.slice(fileUrlPrefix.length);
	return isFileKey(key) ? key : null;
}

export function isStoredFileOrHttpsUrl(value: string) {
	return value === '' || fileKeyFromUrl(value) !== null || value.startsWith('https://');
}
