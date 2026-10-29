import { error } from '@sveltejs/kit';
import { getSettingGroupForAdmin } from '#lib/server/settings/admin-view.js';
import { isSettingGroup } from '#lib/setting-groups.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isSettingGroup(params.group)) error(404, 'Not found');

	return { group: await getSettingGroupForAdmin(params.group) };
};
