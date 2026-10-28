import { ORPCError, os } from '@orpc/server';
import type { AuthSession } from '#lib/server/auth/index.js';
import { isAdmin } from '#lib/server/auth/roles.js';

export interface RpcContext {
	headers: Headers;
	user: AuthSession['user'] | null;
	session: AuthSession['session'] | null;
}

export const publicProcedure = os.$context<RpcContext>();

export const authedProcedure = publicProcedure.use(({ context, next }) => {
	if (!context.user || !context.session) throw new ORPCError('UNAUTHORIZED');

	return next({ context: { user: context.user, session: context.session } });
});

export const adminProcedure = authedProcedure.use(({ context, next }) => {
	if (!isAdmin(context.user)) throw new ORPCError('FORBIDDEN');

	return next();
});
