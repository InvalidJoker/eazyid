import { redirect } from '@sveltejs/kit';
import { getAuth } from '#lib/server/auth/index.js';
import { isAdmin } from '#lib/server/auth/roles.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	if (!locals.user || !locals.session) redirect(303, '/login?redirectTo=/account');

	const auth = await getAuth();
	const sessions = await auth.api.listSessions({ headers: request.headers });

	return {
		user: {
			name: locals.user.name,
			email: locals.user.email,
			emailVerified: locals.user.emailVerified,
			isAdmin: isAdmin(locals.user)
		},
		currentSessionId: locals.session.id,
		sessions: sessions.map((session) => ({
			id: session.id,
			token: session.token,
			userAgent: session.userAgent,
			ipAddress: session.ipAddress,
			createdAt: session.createdAt
		}))
	};
};
