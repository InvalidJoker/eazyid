import type { EmailConfig } from '../config';
import type { SendEmail } from '../message';

export function createResendTransport(
	config: Extract<EmailConfig, { transport: 'resend' }>
): SendEmail {
	return async (from, message) => {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${config.apiKey}`,
				'content-type': 'application/json'
			},
			body: JSON.stringify({ from, ...message })
		});

		if (!response.ok) {
			throw new Error(`Resend rejected the email (${response.status}): ${await response.text()}`);
		}
	};
}
