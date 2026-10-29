import { error } from '@sveltejs/kit';
import { oauthProviderAuthServerMetadata } from '@better-auth/oauth-provider';
import { getAuth } from '#lib/server/auth/index.js';
import { isOidcEnabled } from '#lib/server/auth/oidc.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (!(await isOidcEnabled())) error(404, 'Not found');
	return oauthProviderAuthServerMetadata(await getAuth())(request);
};
