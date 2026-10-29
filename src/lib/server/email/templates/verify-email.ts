import type { EmailTemplate } from './template';

export const verifyEmailTemplate: EmailTemplate<'url'> = {
	placeholders: ['url'],
	subject: 'Verify your email for {{instanceName}}',
	heading: 'Verify your email',
	paragraphs: [
		'Confirm this email address to finish setting up your {{instanceName}} account.',
		'If you did not create an account, you can ignore this email.'
	],
	action: { label: 'Verify email', url: '{{url}}' }
};
