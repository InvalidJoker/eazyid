import { z } from 'zod';
import { loginLayouts } from '#lib/login-layouts.js';

interface SettingDefinition<T> {
	schema: z.ZodType<T>;
	default: T;
	description: string;
}

function defineSetting<T>(definition: SettingDefinition<T>) {
	return definition;
}

export const definitions = {
	'instance.name': defineSetting({
		schema: z.string().min(1),
		default: 'EazyID',
		description: 'Name shown on sign-in pages and in emails.'
	}),
	'auth.loginLayout': defineSetting({
		schema: z.enum(loginLayouts),
		default: 'centered',
		description: 'Layout of the sign-in and other signed-out pages.'
	}),
	'auth.signUp.enabled': defineSetting({
		schema: z.boolean(),
		default: true,
		description: 'Allow new users to create an account.'
	}),
	'auth.emailPassword.enabled': defineSetting({
		schema: z.boolean(),
		default: true,
		description: 'Allow signing in with email and password.'
	})
};

export type SettingKey = keyof typeof definitions;

export type SettingValues = {
	[K in SettingKey]: (typeof definitions)[K]['default'];
};

export const settingKeys = Object.keys(definitions) as SettingKey[];
