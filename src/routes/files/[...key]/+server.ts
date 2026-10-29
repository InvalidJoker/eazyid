import { error } from '@sveltejs/kit';
import { readFile } from '#lib/server/storage/index.js';
import { isFileKey } from '#lib/server/storage/url.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	if (!isFileKey(params.key)) error(404, 'Not found');

	const file = await readFile(params.key);
	if (!file) error(404, 'Not found');

	return new Response(file.body, {
		headers: {
			'content-type': file.contentType,
			// Keys are never reused, so the content behind a URL never changes
			'cache-control': 'public, max-age=31536000, immutable',
			'x-content-type-options': 'nosniff'
		}
	});
};
