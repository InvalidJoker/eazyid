import { z } from 'zod';
import { base } from '../base';

export const health = base
	.output(z.object({ status: z.literal('ok'), time: z.string() }))
	.handler(() => ({ status: 'ok' as const, time: new Date().toISOString() }));

export const system = {
	health
};
