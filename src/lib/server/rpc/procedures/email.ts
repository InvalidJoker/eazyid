import { ORPCError } from '@orpc/server';
import { EmailNotConfiguredError, sendEmail } from '#lib/server/email/index.js';
import { renderTemplate } from '#lib/server/email/templates/template.js';
import { testEmailTemplate } from '#lib/server/email/templates/test-email.js';
import { getSettings } from '#lib/server/settings/index.js';
import { adminProcedure } from '../base';

export const sendTest = adminProcedure.handler(async ({ context }) => {
	const settings = await getSettings();

	try {
		await sendEmail(
			renderTemplate(testEmailTemplate, context.user.email, {
				instanceName: settings['instance.name']
			})
		);
	} catch (error) {
		if (error instanceof EmailNotConfiguredError) {
			throw new ORPCError('PRECONDITION_FAILED', { message: error.message });
		}
		throw new ORPCError('BAD_GATEWAY', {
			message: error instanceof Error ? error.message : 'Sending failed'
		});
	}

	return { sentTo: context.user.email };
});

export const email = {
	sendTest
};
