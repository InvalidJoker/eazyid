import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { auth } from '#lib/server/auth/index.js';
import { migrate } from '#lib/server/db/index.js';

export const init: ServerInit = async () => {
	await migrate();
};

export const handle: Handle = async ({ event, resolve }) => {
	const result = await auth.api.getSession({ headers: event.request.headers });

	event.locals.user = result?.user ?? null;
	event.locals.session = result?.session ?? null;

	return resolve(event);
};
