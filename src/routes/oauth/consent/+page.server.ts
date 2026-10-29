import { verifyOAuthQueryParams } from '@better-auth/oauth-provider';
import { error, redirect } from '@sveltejs/kit';
import { getAuth } from '#lib/server/auth/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, request }) => {
	if (!locals.user) redirect(303, `/login${url.search}`);

	const auth = await getAuth();
	const { secret } = await auth.$context;
	const query = url.search.slice(1);
	if (!(await verifyOAuthQueryParams(query, secret))) error(400, 'Invalid consent request');

	const params = new URLSearchParams(query);
	const clientId = params.get('client_id');
	if (!clientId) error(400, 'Invalid consent request');

	const client = await auth.api.getOAuthClientPublic({
		query: { client_id: clientId },
		headers: request.headers
	});

	return {
		client: {
			name: client.client_name ?? clientId,
			uri: client.client_uri ?? null,
			logo: client.logo_uri ?? null
		},
		scopes: (params.get('scope') ?? '').split(' ').filter(Boolean),
		user: { name: locals.user.name, email: locals.user.email }
	};
};
