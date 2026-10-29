/** What each scope lets an application do, as shown on the consent screen. */
export const scopeDescriptions: Record<string, string> = {
	openid: 'Confirm who you are',
	profile: 'See your name and profile picture',
	email: 'See your email address',
	offline_access: 'Stay signed in when you are not using it'
};

export function describeScope(scope: string) {
	return scopeDescriptions[scope] ?? scope;
}
