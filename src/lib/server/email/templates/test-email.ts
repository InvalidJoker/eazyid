import type { EmailTemplate } from './template';

export const testEmailTemplate: EmailTemplate<never> = {
	placeholders: [],
	subject: 'Test email from {{instanceName}}',
	heading: 'Email works',
	paragraphs: ['Your email transport for {{instanceName}} is set up correctly.']
};
