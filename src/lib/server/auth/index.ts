import { BETTER_AUTH_SECRET, ORIGIN } from '$app/env/private';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oauthProvider } from '@better-auth/oauth-provider';
import { betterAuth } from 'better-auth/minimal';
import { admin, jwt } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db, dialect, schema } from '#lib/server/db/index.js';
import type { SettingValues } from '#lib/server/settings/definitions.js';
import { getSettings } from '#lib/server/settings/index.js';
import { isAdmin } from './roles';
import { effectiveVerificationMode, sendVerificationEmail } from './verification';

export function createAuth(settings: SettingValues) {
	const verification = effectiveVerificationMode(settings);

	return betterAuth({
		appName: settings['instance.name'],
		baseURL: ORIGIN,
		secret: BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: dialect === 'postgres' ? 'pg' : 'sqlite',
			schema
		}),
		emailAndPassword: {
			enabled: settings['auth.emailPassword.enabled'],
			disableSignUp: !settings['auth.signUp.enabled'],
			requireEmailVerification: verification === 'required',
			minPasswordLength: 8
		},
		emailVerification:
			verification === 'disabled'
				? undefined
				: {
						sendOnSignUp: true,
						sendOnSignIn: verification === 'required',
						autoSignInAfterVerification: true,
						sendVerificationEmail: async ({ user, url }) =>
							sendVerificationEmail(user.email, url, settings['instance.name'])
					},
		// The JWT plugin's own /token endpoint is not part of OIDC and would only confuse clients
		disabledPaths: ['/token'],
		plugins: [
			admin(),
			jwt({ jwt: { issuer: ORIGIN }, disableSettingJwtHeader: true }),
			oauthProvider({
				loginPage: '/login',
				consentPage: '/oauth/consent',
				scopes: ['openid', 'profile', 'email', 'offline_access'],
				allowDynamicClientRegistration: settings['oidc.dynamicRegistration'],
				accessTokenExpiresIn: settings['oidc.accessTokenLifetime'],
				refreshTokenExpiresIn: settings['oidc.refreshTokenLifetime'],
				// Admin-made applications belong to the instance, so deleting an admin keeps them
				clientReference: ({ user }) => (isAdmin(user) ? 'instance' : undefined),
				clientPrivileges: ({ user, action }) =>
					isAdmin(user) || (action === 'create' && settings['oidc.dynamicRegistration'])
			}),
			// Must stay last so it can set cookies from every other plugin's responses
			sveltekitCookies(getRequestEvent)
		]
	});
}

export type Auth = ReturnType<typeof createAuth>;
export type AuthSession = Auth['$Infer']['Session'];

let cached: { key: string; auth: Auth } | undefined;

/** better-auth options are fixed per instance, so a new one is built whenever settings change. */
export async function getAuth() {
	const settings = await getSettings();
	const key = JSON.stringify(settings);

	if (cached?.key !== key) cached = { key, auth: createAuth(settings) };
	return cached.auth;
}
