import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { createFirstAdmin, isSetupRequired, SetupCompletedError } from '#lib/server/setup.js';
import { publicProcedure } from '../base';

export const status = publicProcedure.handler(async () => ({
	required: await isSetupRequired()
}));

export const createAdmin = publicProcedure
	.input(
		z.object({
			name: z.string().trim().min(1).max(64),
			email: z.email(),
			password: z.string().min(8).max(128)
		})
	)
	.handler(async ({ input }) => {
		try {
			await createFirstAdmin(input);
		} catch (error) {
			if (error instanceof SetupCompletedError) {
				throw new ORPCError('CONFLICT', { message: error.message });
			}
			throw error;
		}
	});

export const setup = {
	status,
	createAdmin
};
