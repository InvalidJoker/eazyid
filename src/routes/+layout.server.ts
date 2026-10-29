import { effectiveVerificationMode } from '#lib/server/auth/verification.js';
import { getSettings } from '#lib/server/settings/index.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const settings = await getSettings();

	return {
		branding: {
			instanceName: settings['instance.name'],
			loginLayout: settings['auth.loginLayout'],
			loginImage: settings['auth.loginImage']
		},
		authOptions: {
			emailPassword: settings['auth.emailPassword.enabled'],
			signUp: settings['auth.signUp.enabled'],
			emailVerification: effectiveVerificationMode(settings)
		}
	};
};
