export const settingsSections = ['profile', 'security', 'sessions', 'appearance'] as const;

export type SettingsSection = (typeof settingsSections)[number];

/** `#settings/security` opens that section; `#settings` alone opens the profile. */
export function parseSettingsHash(hash: string): SettingsSection | null {
	const [prefix, section] = hash.replace(/^#\/?/, '').split('/');
	if (prefix !== 'settings') return null;

	return settingsSections.includes(section as SettingsSection)
		? (section as SettingsSection)
		: 'profile';
}

export function settingsHash(section: SettingsSection) {
	return `#settings/${section}`;
}
