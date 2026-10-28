import { error, redirect } from '@sveltejs/kit';
import { isAdmin } from '#lib/server/auth/roles.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	if (!isAdmin(locals.user)) error(403, 'Admins only');

	return { user: { name: locals.user.name, email: locals.user.email } };
};
