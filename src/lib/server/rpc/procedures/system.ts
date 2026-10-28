import { z } from 'zod';
import { publicProcedure } from '../base';

export const health = publicProcedure
	.output(z.object({ status: z.literal('ok'), time: z.string() }))
	.handler(() => ({ status: 'ok' as const, time: new Date().toISOString() }));

export const system = {
	health
};
