import { isEmailConfigured } from '#lib/server/email/config.js';
import { sendEmail } from '#lib/server/email/index.js';
import { renderTemplate } from '#lib/server/email/templates/template.js';
import { verifyEmailTemplate } from '#lib/server/email/templates/verify-email.js';
import type { SettingValues } from '#lib/server/settings/definitions.js';

/** The mode in effect: without a working email transport verification cannot run. */
export function effectiveVerificationMode(settings: SettingValues) {
	return isEmailConfigured(settings) ? settings['auth.emailVerification'] : 'disabled';
}

export function sendVerificationEmail(email: string, url: string, instanceName: string) {
	// Not awaited, so response timing does not reveal whether the address exists
	sendEmail(renderTemplate(verifyEmailTemplate, email, { instanceName, url })).catch((error) => {
		console.error('Failed to send verification email', error);
	});
}
