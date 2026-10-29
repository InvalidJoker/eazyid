import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { applicationTypes } from '#lib/applications.js';
import {
	createApplication,
	deleteApplication,
	getApplication,
	listApplications,
	rotateApplicationSecret,
	updateApplication
} from '#lib/server/applications/index.js';
import { withAuthErrors } from '../auth-errors';
import { adminProcedure } from '../base';

const detailsSchema = z.object({
	name: z.string().trim().min(1).max(100),
	redirectUris: z.array(z.url()).min(1),
	skipConsent: z.boolean()
});

async function requireApplication(clientId: string) {
	const application = await getApplication(clientId);
	if (!application) throw new ORPCError('NOT_FOUND', { message: 'Application not found' });
	return application;
}

export const list = adminProcedure.handler(() => listApplications());

export const get = adminProcedure
	.input(z.object({ clientId: z.string() }))
	.handler(({ input }) => requireApplication(input.clientId));

export const create = adminProcedure
	.input(detailsSchema.extend({ type: z.enum(applicationTypes) }))
	.handler(({ input, context }) => withAuthErrors(() => createApplication(context.headers, input)));

export const update = adminProcedure
	.input(detailsSchema.extend({ clientId: z.string(), disabled: z.boolean() }))
	.handler(async ({ input, context }) => {
		const { clientId, ...details } = input;
		await requireApplication(clientId);
		await withAuthErrors(() => updateApplication(context.headers, clientId, details));
	});

export const rotateSecret = adminProcedure
	.input(z.object({ clientId: z.string() }))
	.handler(async ({ input, context }) => {
		await requireApplication(input.clientId);
		return withAuthErrors(() => rotateApplicationSecret(context.headers, input.clientId));
	});

export const remove = adminProcedure
	.input(z.object({ clientId: z.string() }))
	.handler(async ({ input }) => {
		await requireApplication(input.clientId);
		await deleteApplication(input.clientId);
	});

export const applications = {
	list,
	get,
	create,
	update,
	rotateSecret,
	remove
};
