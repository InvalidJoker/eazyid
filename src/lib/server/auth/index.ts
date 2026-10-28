import { BETTER_AUTH_SECRET, ORIGIN } from '$app/env/private';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db, dialect, schema } from '#lib/server/db/index.js';

export const auth = betterAuth({
	appName: 'EazyID',
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: dialect === 'postgres' ? 'pg' : 'sqlite',
		schema
	}),
	emailAndPassword: { enabled: true },
	plugins: [
		admin(),
		// Must stay last so it can set cookies from every other plugin's responses
		sveltekitCookies(getRequestEvent)
	]
});

export type AuthSession = typeof auth.$Infer.Session;
