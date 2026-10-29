import { createTransport } from 'nodemailer';
import type { EmailConfig } from '../config';
import type { SendEmail } from '../message';

export function createSmtpTransport(
	config: Extract<EmailConfig, { transport: 'smtp' }>
): SendEmail {
	const transporter = createTransport({
		host: config.host,
		port: config.port,
		secure: config.secure,
		auth: config.user ? { user: config.user, pass: config.password } : undefined
	});

	return async (from, message) => {
		await transporter.sendMail({ from, ...message });
	};
}
