import { isEmailConfigured } from '#lib/server/email/config.js';
import { settingGroups, type SettingGroup } from '#lib/setting-groups.js';
import { definitions, type SettingKey } from './definitions';
import { envName } from './env';
import { resolveSettings, toValues, type SettingSource } from './index';

export interface AdminSettingOption {
	value: string;
	label: string;
	unsafe: boolean;
	unavailable: boolean;
}

export interface AdminSetting {
	key: SettingKey;
	label: string;
	description: string;
	kind: 'boolean' | 'number' | 'string' | 'enum' | 'login-layout' | 'image';
	/** `null` for secrets, which never leave the server. */
	value: unknown;
	hasValue: boolean;
	secret: boolean;
	source: SettingSource;
	envName: string;
	options?: AdminSettingOption[];
	unsafe: boolean;
}

export interface AdminSettingGroup {
	id: SettingGroup;
	label: string;
	description: string;
	settings: AdminSetting[];
}

/** One settings group as the admin UI shows it: secrets redacted, hidden settings left out. */
export async function getSettingGroupForAdmin(group: SettingGroup): Promise<AdminSettingGroup> {
	const resolved = await resolveSettings();
	const values: Record<string, unknown> = toValues(resolved);
	const emailConfigured = isEmailConfigured(toValues(resolved));

	const settings = resolved.flatMap(({ key, value, source }): AdminSetting[] => {
		const definition: (typeof definitions)[keyof typeof definitions] = definitions[key];
		const { visibleWhen, options } = definition;
		if (definition.group !== group) return [];
		if (visibleWhen && values[visibleWhen.key] !== visibleWhen.equals) return [];

		const optionList = options
			? Object.entries(options).map(([optionValue, meta]) => ({
					value: optionValue,
					label: meta.label,
					unsafe: meta.unsafe ?? false,
					unavailable: (meta.requiresEmail ?? false) && !emailConfigured
				}))
			: undefined;

		const kind =
			definition.control ??
			(optionList ? 'enum' : (typeof definition.default as 'boolean' | 'number' | 'string'));

		return [
			{
				key,
				label: definition.label,
				description: definition.description,
				kind,
				value: definition.secret ? null : value,
				hasValue: value !== '',
				secret: definition.secret ?? false,
				source,
				envName: envName(key),
				options: optionList,
				unsafe: optionList?.find((option) => option.value === value)?.unsafe ?? false
			}
		];
	});

	return { id: group, ...settingGroups[group], settings };
}
