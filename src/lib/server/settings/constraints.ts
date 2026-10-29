import { isEmailConfigured } from '#lib/server/email/config.js';
import { getStorageConfig } from '#lib/server/storage/config.js';
import type { SettingValues } from './definitions';

/** Rules that span several settings. Returns why the values are invalid, or `null`. */
export function findConstraintViolation(values: SettingValues): string | null {
	if (values['auth.emailVerification'] !== 'disabled' && !isEmailConfigured(values)) {
		return 'Email verification needs a configured email transport. Set up email first or disable verification.';
	}

	if (!getStorageConfig(values)) {
		return 'The selected storage driver is missing required settings.';
	}

	return null;
}
