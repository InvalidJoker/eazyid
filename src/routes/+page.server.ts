import { listDashboardApplications } from '#lib/server/applications/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { apps: [] };

	const applications = await listDashboardApplications();
	return {
		apps: applications.map(({ clientId, name, description, launchUrl, logo }) => ({
			clientId,
			name,
			description,
			launchUrl,
			logo
		}))
	};
};
