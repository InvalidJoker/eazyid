import { findConstraintViolation } from './constraints';
import { definitions, settingKeys, type SettingKey, type SettingValues } from './definitions';
import { envName, readEnvOverride } from './env';
import { loadStoredSettings, storeSetting } from './store';

export type SettingSource = 'default' | 'database' | 'env';

export interface ResolvedSetting {
	key: SettingKey;
	value: unknown;
	source: SettingSource;
}

export class SettingLockedError extends Error {
	constructor(key: SettingKey) {
		super(`Setting "${key}" is set by ${envName(key)} and cannot be changed`);
	}
}

export class SettingInvalidError extends Error {}

/** Resolves every setting: env overrides the database, which overrides the default. */
export async function resolveSettings(): Promise<ResolvedSetting[]> {
	const stored = await loadStoredSettings();

	return settingKeys.map((key) => {
		const definition = definitions[key];

		const fromEnv = readEnvOverride(key);
		if (fromEnv !== undefined) {
			return { key, value: definition.schema.parse(fromEnv), source: 'env' };
		}

		const fromDatabase = definition.schema.safeParse(stored.get(key));
		if (fromDatabase.success) {
			return { key, value: fromDatabase.data, source: 'database' };
		}

		return { key, value: definition.default, source: 'default' };
	});
}

export function toValues(resolved: ResolvedSetting[]) {
	return Object.fromEntries(resolved.map((s) => [s.key, s.value])) as SettingValues;
}

export async function getSettings(): Promise<SettingValues> {
	return toValues(await resolveSettings());
}

export async function updateSettings(changes: Partial<SettingValues>) {
	const keys = Object.keys(changes) as SettingKey[];
	const next: Record<string, unknown> = await getSettings();

	for (const key of keys) {
		if (readEnvOverride(key) !== undefined) throw new SettingLockedError(key);
		next[key] = definitions[key].schema.parse(changes[key]);
	}

	const violation = findConstraintViolation(next as SettingValues);
	if (violation) throw new SettingInvalidError(violation);

	for (const key of keys) {
		await storeSetting(key, next[key]);
	}
}
