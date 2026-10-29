import { z } from 'zod';
import { isStoredFileOrHttpsUrl } from '#lib/server/storage/url.js';
import { loginLayouts } from '#lib/login-layouts.js';
import type { SettingGroup } from '#lib/setting-groups.js';

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
	/** A dedicated control instead of the one derived from the value type. */
	control?: 'login-layout' | 'image';
	options?: Record<string, OptionMeta>;
	visibleWhen?: { key: string; equals: unknown };
}

function defineSetting<S extends z.ZodType>(definition: SettingDefinition<S>) {
	return definition;
}

export const emailVerificationModes = ['disabled', 'optional', 'required'] as const;
export const emailTransports = ['none', 'smtp', 'resend'] as const;
export const storageDrivers = ['database', 'local', 's3'] as const;

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
		control: 'login-layout'
	}),
	'auth.loginImage': defineSetting({
		group: 'authentication',
		label: 'Login image',
		description:
			'Brand panel image in the split layout, page background in the centered layout. Upload one or use an https URL.',
		schema: z.string().refine(isStoredFileOrHttpsUrl, 'Must be an uploaded image or an https URL'),
		default: '',
		control: 'image'
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
	}),
	'storage.driver': defineSetting({
		group: 'storage',
		label: 'Driver',
		description:
			'Where new uploads go. Files already stored stay with the driver they were saved with.',
		schema: z.enum(storageDrivers),
		default: 'database',
		options: {
			database: { label: 'Database' },
			local: { label: 'Local disk' },
			s3: { label: 'S3 compatible' }
		}
	}),
	'storage.local.path': defineSetting({
		group: 'storage',
		label: 'Directory',
		description: 'Folder for uploads, relative to the working directory or absolute.',
		schema: z.string(),
		default: './data/uploads',
		visibleWhen: { key: 'storage.driver', equals: 'local' }
	}),
	'storage.s3.bucket': defineSetting({
		group: 'storage',
		label: 'Bucket',
		description: 'Name of the bucket uploads are written to.',
		schema: z.string(),
		default: '',
		visibleWhen: { key: 'storage.driver', equals: 's3' }
	}),
	'storage.s3.region': defineSetting({
		group: 'storage',
		label: 'Region',
		description: 'Bucket region. Use auto for Cloudflare R2.',
		schema: z.string().min(1),
		default: 'us-east-1',
		visibleWhen: { key: 'storage.driver', equals: 's3' }
	}),
	'storage.s3.endpoint': defineSetting({
		group: 'storage',
		label: 'Endpoint',
		description: 'Leave empty for AWS. Set it for MinIO, R2 or other S3 compatible services.',
		schema: z.string(),
		default: '',
		visibleWhen: { key: 'storage.driver', equals: 's3' }
	}),
	'storage.s3.forcePathStyle': defineSetting({
		group: 'storage',
		label: 'Path-style URLs',
		description: 'Needed by most self-hosted services like MinIO.',
		schema: z.boolean(),
		default: false,
		visibleWhen: { key: 'storage.driver', equals: 's3' }
	}),
	'storage.s3.accessKeyId': defineSetting({
		group: 'storage',
		label: 'Access key ID',
		description: 'Key with read and write access to the bucket.',
		schema: z.string(),
		default: '',
		visibleWhen: { key: 'storage.driver', equals: 's3' }
	}),
	'storage.s3.secretAccessKey': defineSetting({
		group: 'storage',
		label: 'Secret access key',
		description: 'Stored in the database. Prefer the env variable in production.',
		schema: z.string(),
		default: '',
		secret: true,
		visibleWhen: { key: 'storage.driver', equals: 's3' }
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
