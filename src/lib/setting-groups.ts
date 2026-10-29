export const settingGroups = {
	instance: {
		label: 'Instance',
		description: 'Name and identity of this instance.'
	},
	authentication: {
		label: 'Authentication',
		description: 'How people sign up and sign in, and what the login page looks like.'
	},
	email: {
		label: 'Email',
		description: 'How emails are delivered. Needed for email verification.'
	},
	storage: {
		label: 'Storage',
		description: 'Where uploaded files like login images are kept.'
	}
} as const;

export type SettingGroup = keyof typeof settingGroups;

export const settingGroupIds = Object.keys(settingGroups) as SettingGroup[];

export function isSettingGroup(value: string): value is SettingGroup {
	return value in settingGroups;
}
