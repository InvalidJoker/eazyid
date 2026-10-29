import { BETTER_AUTH_SECRET, ORIGIN } from '$app/env/private';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db, dialect, schema } from '#lib/server/db/index.js';
import type { SettingValues } from '#lib/server/settings/definitions.js';
import { getSettings } from '#lib/server/settings/index.js';
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
		plugins: [
			admin(),
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
