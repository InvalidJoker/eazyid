import { isAdmin } from '#lib/server/auth/roles.js';
import { effectiveVerificationMode } from '#lib/server/auth/verification.js';
import { getSettings } from '#lib/server/settings/index.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const settings = await getSettings();

	return {
		branding: {
			instanceName: settings['instance.name'],
			logo: settings['instance.logo'],
			loginLayout: settings['auth.loginLayout'],
			loginImage: settings['auth.loginImage']
		},
		authOptions: {
			emailPassword: settings['auth.emailPassword.enabled'],
			signUp: settings['auth.signUp.enabled'],
			emailVerification: effectiveVerificationMode(settings)
		},
		viewer:
			locals.user && locals.session
				? {
						user: {
							name: locals.user.name,
							email: locals.user.email,
							emailVerified: locals.user.emailVerified,
							isAdmin: isAdmin(locals.user)
						},
						sessionId: locals.session.id
					}
				: null
	};
};
