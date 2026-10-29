import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { deleteAssetByUrl, InvalidImageError, storeImage } from '#lib/server/assets/index.js';
import { getSettingGroupForAdmin } from '#lib/server/settings/admin-view.js';
import { definitions, settingKeys, type SettingKey } from '#lib/server/settings/definitions.js';
import {
	getSettings,
	SettingInvalidError,
	SettingLockedError,
	updateSettings
} from '#lib/server/settings/index.js';
import { settingGroupIds } from '#lib/setting-groups.js';
import { adminProcedure } from '../base';

const changesSchema = z
	.object(Object.fromEntries(settingKeys.map((key) => [key, definitions[key].schema.optional()])))
	.strict();

const imageKeys = settingKeys.filter(
	(key) => (definitions[key] as { control?: string }).control === 'image'
);

const imageKeySchema = z.custom<SettingKey>(
	(value) => imageKeys.includes(value as SettingKey),
	'Not an image setting'
);

async function saveSettings(changes: z.infer<typeof changesSchema>) {
	try {
		await updateSettings(changes);
	} catch (error) {
		if (error instanceof SettingLockedError) {
			throw new ORPCError('CONFLICT', { message: error.message });
		}
		if (error instanceof SettingInvalidError) {
			throw new ORPCError('BAD_REQUEST', { message: error.message });
		}
		throw error;
	}
}

export const group = adminProcedure
	.input(z.object({ group: z.enum(settingGroupIds) }))
	.handler(({ input }) => getSettingGroupForAdmin(input.group));

export const update = adminProcedure.input(changesSchema).handler(async ({ input }) => {
	await saveSettings(input);
});

export const uploadImage = adminProcedure
	.input(z.object({ key: imageKeySchema, file: z.file() }))
	.handler(async ({ input }) => {
		const previous = (await getSettings())[input.key];

		let url: string;
		try {
			url = await storeImage(input.file);
		} catch (error) {
			if (error instanceof InvalidImageError) {
				throw new ORPCError('BAD_REQUEST', { message: error.message });
			}
			throw error;
		}

		try {
			await saveSettings({ [input.key]: url });
		} catch (error) {
			await deleteAssetByUrl(url);
			throw error;
		}
		await deleteAssetByUrl(previous);

		return { url };
	});

export const setImageUrl = adminProcedure
	.input(z.object({ key: imageKeySchema, url: z.url({ protocol: /^https$/ }) }))
	.handler(async ({ input }) => {
		const previous = (await getSettings())[input.key];
		await saveSettings({ [input.key]: input.url });
		if (previous !== input.url) await deleteAssetByUrl(previous);
	});

export const removeImage = adminProcedure
	.input(z.object({ key: imageKeySchema }))
	.handler(async ({ input }) => {
		const previous = (await getSettings())[input.key];
		await saveSettings({ [input.key]: '' });
		await deleteAssetByUrl(previous);
	});

export const settings = {
	group,
	update,
	uploadImage,
	setImageUrl,
	removeImage
};
