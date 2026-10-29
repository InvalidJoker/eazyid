import { getAuth } from '#lib/server/auth/index.js';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async ({ request }) => {
	const auth = await getAuth();
	return auth.handler(request);
};

export const GET = handler;
export const POST = handler;
