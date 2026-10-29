import { getSettings } from '#lib/server/settings/index.js';

// Everything the OIDC provider serves, so the whole provider can be switched off in one place
const oidcPathPrefixes = [
	'/api/auth/oauth2/',
	'/api/auth/jwks',
	'/api/auth/.well-known/',
	'/.well-known/'
];

export function isOidcPath(pathname: string) {
	return oidcPathPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function isOidcEnabled() {
	return (await getSettings())['oidc.enabled'];
}
