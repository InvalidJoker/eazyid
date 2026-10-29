import { ORPCError } from '@orpc/server';
import { isAPIError } from 'better-auth/api';

/** Runs a better-auth API call and turns its errors into oRPC errors the client can show. */
export async function withAuthErrors<T>(call: () => Promise<T>): Promise<T> {
	try {
		return await call();
	} catch (error) {
		if (!isAPIError(error)) throw error;

		const body = error.body as { message?: string; error_description?: string } | undefined;
		throw new ORPCError(String(error.status), {
			status: error.statusCode,
			message: body?.error_description ?? body?.message ?? error.message
		});
	}
}
