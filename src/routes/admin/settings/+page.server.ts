import { redirect } from '@sveltejs/kit';
import { settingGroupIds } from '#lib/setting-groups.js';

export const load = () => {
	redirect(307, `/admin/settings/${settingGroupIds[0]}`);
};
