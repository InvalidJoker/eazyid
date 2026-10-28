import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
import SettingsIcon from '@lucide/svelte/icons/settings';

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

export const adminNavigation: NavSection[] = [
	{
		items: [{ href: '/admin', label: 'Overview', icon: LayoutDashboardIcon, exact: true }]
	},
	{
		label: 'System',
		items: [{ href: '/admin/settings', label: 'Settings', icon: SettingsIcon }]
	}
];
