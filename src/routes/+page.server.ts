import { isAdmin } from '#lib/server/auth/roles.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	return {
		user: locals.user ? { name: locals.user.name, isAdmin: isAdmin(locals.user) } : null
	};
};
