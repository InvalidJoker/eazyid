import { listApplications } from '#lib/server/applications/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { applications: await listApplications() };
};
