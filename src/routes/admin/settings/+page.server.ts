import { resolveSettings } from '#lib/server/settings/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { settings: await resolveSettings() };
};
