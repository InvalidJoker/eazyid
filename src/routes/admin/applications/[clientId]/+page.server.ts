import { error } from '@sveltejs/kit';
import { ORIGIN } from '$app/env/private';
import { getApplication } from '#lib/server/applications/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const application = await getApplication(params.clientId);
	if (!application) error(404, 'Application not found');

	return {
		application,
		issuer: ORIGIN,
		discoveryUrl: `${ORIGIN}/.well-known/openid-configuration`
	};
};
