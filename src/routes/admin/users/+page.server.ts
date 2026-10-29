import { getAuth } from '#lib/server/auth/index.js';
import { isAdmin } from '#lib/server/auth/roles.js';
import type { PageServerLoad } from './$types';

const pageSize = 50;

export const load: PageServerLoad = async ({ request, url, locals }) => {
	const search = url.searchParams.get('q')?.trim() ?? '';
	const auth = await getAuth();

	const result = await auth.api.listUsers({
		headers: request.headers,
		query: {
			limit: pageSize,
			sortBy: 'createdAt',
			sortDirection: 'desc',
			...(search && { searchValue: search, searchField: 'email', searchOperator: 'contains' })
		}
	});

	return {
		search,
		total: result.total,
		currentUserId: locals.user?.id,
		users: result.users.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			emailVerified: user.emailVerified,
			isAdmin: isAdmin(user),
			banned: user.banned ?? false,
			createdAt: user.createdAt
		}))
	};
};
