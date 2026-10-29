import { error } from '@sveltejs/kit';
import { getAsset } from '#lib/server/assets/index.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const asset = await getAsset(params.id);
	if (!asset) error(404, 'Not found');

	return new Response(asset.body, {
		headers: {
			'content-type': asset.contentType,
			// Ids are never reused, so the content behind a URL never changes
			'cache-control': 'public, max-age=31536000, immutable',
			'x-content-type-options': 'nosniff'
		}
	});
};
