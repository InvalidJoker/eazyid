import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { listSettingsForAdmin } from '#lib/server/settings/admin-view.js';
import { definitions, settingKeys } from '#lib/server/settings/definitions.js';
import {
	SettingInvalidError,
	SettingLockedError,
	updateSettings
} from '#lib/server/settings/index.js';
import { adminProcedure } from '../base';

const changesSchema = z
	.object(Object.fromEntries(settingKeys.map((key) => [key, definitions[key].schema.optional()])))
	.strict();

export const list = adminProcedure.handler(() => listSettingsForAdmin());

export const update = adminProcedure.input(changesSchema).handler(async ({ input }) => {
	try {
		await updateSettings(input);
	} catch (error) {
		if (error instanceof SettingLockedError) {
			throw new ORPCError('CONFLICT', { message: error.message });
		}
		if (error instanceof SettingInvalidError) {
			throw new ORPCError('BAD_REQUEST', { message: error.message });
		}
		throw error;
	}

	return listSettingsForAdmin();
});

export const settings = {
	list,
	update
};
