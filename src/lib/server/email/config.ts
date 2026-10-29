import type { SettingValues } from '#lib/server/settings/definitions.js';

export type EmailConfig =
	| {
			transport: 'smtp';
			from: string;
			host: string;
			port: number;
			secure: boolean;
			user: string;
			password: string;
	  }
	| { transport: 'resend'; from: string; apiKey: string };

/** Returns the email config if the selected transport has everything it needs, else `null`. */
export function getEmailConfig(settings: SettingValues): EmailConfig | null {
	const from = settings['email.from'];
	if (!from) return null;

	switch (settings['email.transport']) {
		case 'smtp':
			if (!settings['email.smtp.host']) return null;
			return {
				transport: 'smtp',
				from,
				host: settings['email.smtp.host'],
				port: settings['email.smtp.port'],
				secure: settings['email.smtp.secure'],
				user: settings['email.smtp.user'],
				password: settings['email.smtp.password']
			};
		case 'resend':
			if (!settings['email.resend.apiKey']) return null;
			return { transport: 'resend', from, apiKey: settings['email.resend.apiKey'] };
		case 'none':
			return null;
	}
}

export function isEmailConfigured(settings: SettingValues) {
	return getEmailConfig(settings) !== null;
}
