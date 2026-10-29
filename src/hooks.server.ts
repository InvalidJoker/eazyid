import { json, redirect } from '@sveltejs/kit';
import { sequence, type Handle, type ServerInit } from '@sveltejs/kit/hooks';
import { getAuth } from '#lib/server/auth/index.js';
import { migrate } from '#lib/server/db/index.js';
import { isSetupRequired } from '#lib/server/setup.js';

const pathsOpenDuringSetup = ['/setup', '/rpc/setup/', '/rpc/system/'];

export const init: ServerInit = async () => {
	await migrate();
};

const handleSetup: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const open = pathsOpenDuringSetup.some((prefix) => path.startsWith(prefix));

	if (open || !(await isSetupRequired())) return resolve(event);

	if (path.startsWith('/api/') || path.startsWith('/rpc/')) {
		return json({ message: 'Setup required' }, { status: 503 });
	}
	redirect(303, '/setup');
};

const handleSession: Handle = async ({ event, resolve }) => {
	const auth = await getAuth();
	const result = await auth.api.getSession({ headers: event.request.headers });

	event.locals.user = result?.user ?? null;
	event.locals.session = result?.session ?? null;

	return resolve(event);
};

export const handle = sequence(handleSetup, handleSession);
