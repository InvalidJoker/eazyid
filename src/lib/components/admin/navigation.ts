import BuildingIcon from '@lucide/svelte/icons/building-2';
import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
import KeyRoundIcon from '@lucide/svelte/icons/key-round';
import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
import MailIcon from '@lucide/svelte/icons/mail';
import PlugIcon from '@lucide/svelte/icons/plug';
import UsersIcon from '@lucide/svelte/icons/users';
import { settingGroupIds, settingGroups, type SettingGroup } from '#lib/setting-groups.js';

export interface NavItem {
	href: string;
	label: string;
	icon: typeof LayoutDashboardIcon;
	exact?: boolean;
}

export interface NavSection {
	label?: string;
	items: NavItem[];
}

const settingGroupIcons: Record<SettingGroup, typeof LayoutDashboardIcon> = {
	instance: BuildingIcon,
	authentication: KeyRoundIcon,
	oidc: PlugIcon,
	email: MailIcon,
	storage: HardDriveIcon
};

export const adminNavigation: NavSection[] = [
	{
		items: [{ href: '/admin', label: 'Overview', icon: LayoutDashboardIcon, exact: true }]
	},
	{
		label: 'Directory',
		items: [{ href: '/admin/users', label: 'Users', icon: UsersIcon }]
	},
	{
		label: 'Settings',
		items: settingGroupIds.map((group) => ({
			href: `/admin/settings/${group}`,
			label: settingGroups[group].label,
			icon: settingGroupIcons[group]
		}))
	}
];
