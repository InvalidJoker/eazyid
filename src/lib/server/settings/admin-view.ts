import { isEmailConfigured } from '#lib/server/email/config.js';
import { definitions, settingGroups, type SettingGroup, type SettingKey } from './definitions';
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
	kind: 'boolean' | 'number' | 'string' | 'enum' | 'image';
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
	settings: AdminSetting[];
}

/** Settings as the admin UI shows them: grouped, secrets redacted, hidden ones left out. */
export async function listSettingsForAdmin(): Promise<AdminSettingGroup[]> {
	const resolved = await resolveSettings();
	const values: Record<string, unknown> = toValues(resolved);
	const emailConfigured = isEmailConfigured(toValues(resolved));

	const settings = resolved.flatMap(({ key, value, source }) => {
		const definition: (typeof definitions)[keyof typeof definitions] = definitions[key];
		const { visibleWhen, options } = definition;
		if (visibleWhen && values[visibleWhen.key] !== visibleWhen.equals) return [];

		const optionList = options
			? Object.entries(options).map(([optionValue, meta]) => ({
					value: optionValue,
					label: meta.label,
					unsafe: meta.unsafe ?? false,
					unavailable: (meta.requiresEmail ?? false) && !emailConfigured
				}))
			: undefined;

		const setting: AdminSetting = {
			key,
			label: definition.label,
			description: definition.description,
			kind:
				definition.control ??
				(optionList ? 'enum' : (typeof definition.default as 'boolean' | 'number' | 'string')),
			value: definition.secret ? null : value,
			hasValue: value !== '',
			secret: definition.secret ?? false,
			source,
			envName: envName(key),
			options: optionList,
			unsafe: optionList?.find((option) => option.value === value)?.unsafe ?? false
		};

		return [{ group: definition.group, setting }];
	});

	return (Object.keys(settingGroups) as SettingGroup[]).map((id) => ({
		id,
		label: settingGroups[id],
		settings: settings.filter((s) => s.group === id).map((s) => s.setting)
	}));
}
