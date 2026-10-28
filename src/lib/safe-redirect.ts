/** Only same-origin paths, so `?redirectTo=` cannot send users to another site. */
export function safeRedirect(target: string | null, fallback = '/') {
	if (!target || !target.startsWith('/') || target.startsWith('//')) return fallback;
	return target;
}
