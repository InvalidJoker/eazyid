import { isEmailConfigured } from '#lib/server/email/config.js';
import type { SettingValues } from './definitions';

/** Rules that span several settings. Returns why the values are invalid, or `null`. */
export function findConstraintViolation(values: SettingValues): string | null {
	if (values['auth.emailVerification'] !== 'disabled' && !isEmailConfigured(values)) {
		return 'Email verification needs a configured email transport. Set up email first or disable verification.';
	}

	return null;
}
