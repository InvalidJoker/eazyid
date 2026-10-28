import { definitions, settingKeys, type SettingKey, type SettingValues } from './definitions';
import { envName, readEnvOverride } from './env';
import { loadStoredSettings, storeSetting } from './store';

export type SettingSource = 'default' | 'database' | 'env';

export interface ResolvedSetting {
	key: SettingKey;
	value: unknown;
	source: SettingSource;
	envName: string;
	description: string;
}

export class SettingLockedError extends Error {
	constructor(key: SettingKey) {
		super(`Setting "${key}" is set by ${envName(key)} and cannot be changed`);
	}
}

/** Resolves every setting: env overrides the database, which overrides the default. */
export async function resolveSettings(): Promise<ResolvedSetting[]> {
	const stored = await loadStoredSettings();

	return settingKeys.map((key) => {
		const definition = definitions[key];
		const base = { key, envName: envName(key), description: definition.description };

		const fromEnv = readEnvOverride(key);
		if (fromEnv !== undefined) {
			return { ...base, value: definition.schema.parse(fromEnv), source: 'env' };
		}

		const fromDatabase = definition.schema.safeParse(stored.get(key));
		if (fromDatabase.success) {
			return { ...base, value: fromDatabase.data, source: 'database' };
		}

		return { ...base, value: definition.default, source: 'default' };
	});
}

export async function getSettings(): Promise<SettingValues> {
	const resolved = await resolveSettings();
	return Object.fromEntries(resolved.map((s) => [s.key, s.value])) as SettingValues;
}

export async function updateSettings(changes: Partial<SettingValues>) {
	const entries = Object.entries(changes) as [SettingKey, unknown][];

	for (const [key] of entries) {
		if (readEnvOverride(key) !== undefined) throw new SettingLockedError(key);
	}

	for (const [key, value] of entries) {
		await storeSetting(key, definitions[key].schema.parse(value));
	}
}
