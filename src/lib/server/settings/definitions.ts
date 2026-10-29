import { z } from 'zod';
import { loginLayouts } from '#lib/login-layouts.js';

export const settingGroups = {
	instance: 'Instance',
	authentication: 'Authentication',
	email: 'Email'
} as const;

export type SettingGroup = keyof typeof settingGroups;

export interface OptionMeta {
	label: string;
	unsafe?: boolean;
	requiresEmail?: boolean;
}

interface SettingDefinition<S extends z.ZodType> {
	group: SettingGroup;
	label: string;
	description: string;
	schema: S;
	default: z.output<S>;
	secret?: boolean;
	options?: Record<string, OptionMeta>;
	visibleWhen?: { key: string; equals: unknown };
}

function defineSetting<S extends z.ZodType>(definition: SettingDefinition<S>) {
	return definition;
}

export const emailVerificationModes = ['disabled', 'optional', 'required'] as const;
export const emailTransports = ['none', 'smtp', 'resend'] as const;

export const definitions = {
	'instance.name': defineSetting({
		group: 'instance',
		label: 'Instance name',
		description: 'Shown on sign-in pages and in emails.',
		schema: z.string().min(1),
		default: 'EazyID'
	}),
	'auth.loginLayout': defineSetting({
		group: 'authentication',
		label: 'Login page',
		description: 'Layout of the sign-in and other signed-out pages.',
		schema: z.enum(loginLayouts),
		default: 'centered',
		options: { centered: { label: 'Centered' }, split: { label: 'Split' } }
	}),
	'auth.signUp.enabled': defineSetting({
		group: 'authentication',
		label: 'Sign-up',
		description: 'Allow new users to create an account.',
		schema: z.boolean(),
		default: true
	}),
	'auth.emailPassword.enabled': defineSetting({
		group: 'authentication',
		label: 'Email and password',
		description: 'Allow signing in with email and password.',
		schema: z.boolean(),
		default: true
	}),
	'auth.emailVerification': defineSetting({
		group: 'authentication',
		label: 'Email verification',
		description:
			'Whether users must confirm their email address. Needs a configured email transport.',
		schema: z.enum(emailVerificationModes),
		default: 'disabled',
		options: {
			disabled: { label: 'Disabled', unsafe: true },
			optional: { label: 'Optional', unsafe: true, requiresEmail: true },
			required: { label: 'Required', requiresEmail: true }
		}
	}),
	'email.transport': defineSetting({
		group: 'email',
		label: 'Transport',
		description: 'How emails are delivered.',
		schema: z.enum(emailTransports),
		default: 'none',
		options: { none: { label: 'None' }, smtp: { label: 'SMTP' }, resend: { label: 'Resend' } }
	}),
	'email.from': defineSetting({
		group: 'email',
		label: 'From address',
		description: 'Sender of all emails, e.g. EazyID <no-reply@example.com>.',
		schema: z.string(),
		default: ''
	}),
	'email.smtp.host': defineSetting({
		group: 'email',
		label: 'SMTP host',
		description: 'Hostname of the SMTP server.',
		schema: z.string(),
		default: '',
		visibleWhen: { key: 'email.transport', equals: 'smtp' }
	}),
	'email.smtp.port': defineSetting({
		group: 'email',
		label: 'SMTP port',
		description: 'Usually 587 for STARTTLS or 465 for TLS.',
		schema: z.coerce.number().int().min(1).max(65535),
		default: 587,
		visibleWhen: { key: 'email.transport', equals: 'smtp' }
	}),
	'email.smtp.secure': defineSetting({
		group: 'email',
		label: 'SMTP TLS',
		description: 'Connect with TLS from the start. Turn off for STARTTLS on port 587.',
		schema: z.boolean(),
		default: false,
		visibleWhen: { key: 'email.transport', equals: 'smtp' }
	}),
	'email.smtp.user': defineSetting({
		group: 'email',
		label: 'SMTP user',
		description: 'Leave empty if the server needs no authentication.',
		schema: z.string(),
		default: '',
		visibleWhen: { key: 'email.transport', equals: 'smtp' }
	}),
	'email.smtp.password': defineSetting({
		group: 'email',
		label: 'SMTP password',
		description: 'Stored in the database. Prefer the env variable in production.',
		schema: z.string(),
		default: '',
		secret: true,
		visibleWhen: { key: 'email.transport', equals: 'smtp' }
	}),
	'email.resend.apiKey': defineSetting({
		group: 'email',
		label: 'Resend API key',
		description: 'Stored in the database. Prefer the env variable in production.',
		schema: z.string(),
		default: '',
		secret: true,
		visibleWhen: { key: 'email.transport', equals: 'resend' }
	})
};

export type SettingKey = keyof typeof definitions;

export type SettingValues = {
	[K in SettingKey]: z.output<(typeof definitions)[K]['schema']>;
};

export const settingKeys = Object.keys(definitions) as SettingKey[];

export const defaultSettings = Object.fromEntries(
	settingKeys.map((key) => [key, definitions[key].default])
) as SettingValues;
