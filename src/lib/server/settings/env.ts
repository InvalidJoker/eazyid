import type { SettingKey } from './definitions';

/** `auth.signUp.enabled` becomes `EAZYID_AUTH_SIGN_UP_ENABLED`. */
export function envName(key: SettingKey) {
	const snake = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replaceAll('.', '_');
	return `EAZYID_${snake.toUpperCase()}`;
}

export function readEnvOverride(key: SettingKey): unknown {
	const raw = process.env[envName(key)];
	if (raw === undefined) return undefined;

	// Lets `true`, `42` and JSON arrays come through typed while plain text stays a string
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}
