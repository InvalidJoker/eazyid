import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { applicationTypes } from '#lib/applications.js';
import {
	createApplication,
	deleteApplication,
	getApplication,
	listApplications,
	rotateApplicationSecret,
	setApplicationLogo,
	updateApplication
} from '#lib/server/applications/index.js';
import { deleteFileByUrl, StorageNotConfiguredError } from '#lib/server/storage/index.js';
import { InvalidImageError, saveImage } from '#lib/server/storage/images.js';
import { withAuthErrors } from '../auth-errors';
import { adminProcedure } from '../base';

const detailsSchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().max(500),
	launchUrl: z.union([z.literal(''), z.url({ protocol: /^https?$/ })]),
	redirectUris: z.array(z.url()).min(1),
	skipConsent: z.boolean(),
	showOnDashboard: z.boolean()
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

export const uploadLogo = adminProcedure
	.input(z.object({ clientId: z.string(), file: z.file() }))
	.handler(async ({ input, context }) => {
		const { logo: previous } = await requireApplication(input.clientId);

		let url: string;
		try {
			({ url } = await saveImage('apps', input.file));
		} catch (error) {
			if (error instanceof InvalidImageError || error instanceof StorageNotConfiguredError) {
				throw new ORPCError('BAD_REQUEST', { message: error.message });
			}
			throw error;
		}

		await withAuthErrors(() => setApplicationLogo(context.headers, input.clientId, url));
		await deleteFileByUrl(previous);
	});

export const setLogoUrl = adminProcedure
	.input(z.object({ clientId: z.string(), url: z.url({ protocol: /^https$/ }) }))
	.handler(async ({ input, context }) => {
		const { logo: previous } = await requireApplication(input.clientId);
		await withAuthErrors(() => setApplicationLogo(context.headers, input.clientId, input.url));
		if (previous !== input.url) await deleteFileByUrl(previous);
	});

export const removeLogo = adminProcedure
	.input(z.object({ clientId: z.string() }))
	.handler(async ({ input, context }) => {
		const { logo: previous } = await requireApplication(input.clientId);
		await withAuthErrors(() => setApplicationLogo(context.headers, input.clientId, ''));
		await deleteFileByUrl(previous);
	});

export const remove = adminProcedure
	.input(z.object({ clientId: z.string() }))
	.handler(async ({ input }) => {
		const { logo } = await requireApplication(input.clientId);
		await deleteApplication(input.clientId);
		await deleteFileByUrl(logo);
	});

export const applications = {
	list,
	get,
	create,
	update,
	rotateSecret,
	uploadLogo,
	setLogoUrl,
	removeLogo,
	remove
};
