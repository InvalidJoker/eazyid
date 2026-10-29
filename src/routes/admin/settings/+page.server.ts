import { listSettingsForAdmin } from '#lib/server/settings/admin-view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { groups: await listSettingsForAdmin() };
};
