import { getSettings } from '#lib/server/settings/index.js';
import { getEmailConfig, type EmailConfig } from './config';
import type { EmailMessage, SendEmail } from './message';
import { createResendTransport } from './transports/resend';
import { createSmtpTransport } from './transports/smtp';

export class EmailNotConfiguredError extends Error {
	constructor() {
		super('No email transport is configured');
	}
}

function createTransport(config: EmailConfig): SendEmail {
	switch (config.transport) {
		case 'smtp':
			return createSmtpTransport(config);
		case 'resend':
			return createResendTransport(config);
	}
}

export async function sendEmail(message: EmailMessage) {
	const config = getEmailConfig(await getSettings());
	if (!config) throw new EmailNotConfiguredError();

	await createTransport(config)(config.from, message);
}
