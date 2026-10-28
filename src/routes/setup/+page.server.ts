import { redirect } from '@sveltejs/kit';
import { isAdmin } from '#lib/server/auth/roles.js';
import { isSetupRequired } from '#lib/server/setup.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const required = await isSetupRequired();

	// Admins may come back to finish the remaining steps after the account exists
	if (!required && !isAdmin(locals.user)) redirect(303, '/');

	return { required };
};
