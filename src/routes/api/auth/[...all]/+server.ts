import { error } from '@sveltejs/kit';
import { getAuth } from '#lib/server/auth/index.js';
import { isOidcEnabled, isOidcPath } from '#lib/server/auth/oidc.js';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async ({ request, url }) => {
	if (isOidcPath(url.pathname) && !(await isOidcEnabled())) error(404, 'Not found');

	const auth = await getAuth();
	return auth.handler(request);
};

export const GET = handler;
export const POST = handler;
