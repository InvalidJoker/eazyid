import { redirect } from '@sveltejs/kit';
import { safeRedirect } from '#lib/safe-redirect.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
};
