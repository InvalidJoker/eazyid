import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { definitions, settingKeys } from '#lib/server/settings/definitions.js';
import { resolveSettings, SettingLockedError, updateSettings } from '#lib/server/settings/index.js';
import { adminProcedure } from '../base';

const changesSchema = z
	.object(Object.fromEntries(settingKeys.map((key) => [key, definitions[key].schema.optional()])))
	.strict();

export const list = adminProcedure.handler(() => resolveSettings());

export const update = adminProcedure.input(changesSchema).handler(async ({ input }) => {
	try {
		await updateSettings(input);
	} catch (error) {
		if (error instanceof SettingLockedError) {
			throw new ORPCError('CONFLICT', { message: error.message });
		}
		throw error;
	}

	return resolveSettings();
});

export const settings = {
	list,
	update
};
